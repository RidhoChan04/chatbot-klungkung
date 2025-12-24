# ingest.py
import os
import uuid
from base64 import b64decode
from typing import List, Tuple
from dotenv import load_dotenv
load_dotenv()  
from unstructured.partition.pdf import partition_pdf

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_core.stores import InMemoryStore
from langchain_classic.retrievers.multi_vector import MultiVectorRetriever
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser


# =========================
# CONFIG
# =========================
PDF_PATH = "data/10_destinasi_klungkung.pdf"
COLLECTION_NAME = "multi_modal_rag"
ID_KEY = "doc_id"


# =========================
# VECTORSTORE + RETRIEVER
# =========================
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/text-embedding-004",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

vectorstore = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embeddings,
    persist_directory="./chroma"
)

store = InMemoryStore()

retriever = MultiVectorRetriever(
    vectorstore=vectorstore,
    docstore=store,
    id_key=ID_KEY,
)


# =========================
# SUMMARIZER (Gemini)
# =========================
prompt = ChatPromptTemplate.from_template(
    """
You are an assistant tasked with summarizing text or tables.

Give a concise, information-dense summary.
Respond ONLY with the summary.

Content:
{element}
"""
)

summarizer = (
    {"element": lambda x: x}
    | prompt
    | ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        api_key=os.getenv("GEMINI_API_KEY")
    )
    | StrOutputParser()
)


# =========================
# HELPERS
# =========================
def extract_images_base64(chunks) -> List[str]:
    images = []
    for chunk in chunks:
        if "CompositeElement" in str(type(chunk)):
            for el in chunk.metadata.orig_elements:
                if "Image" in str(type(el)):
                    images.append(el.metadata.image_base64)
    return images


def safe_summarize(elements: List[str]) -> List[str]:
    summaries = []
    for el in elements:
        try:
            summary = summarizer.invoke(el)
            summaries.append(summary.strip() if summary else "")
        except Exception:
            summaries.append("")
    return summaries


def build_valid_docs(
    summaries: List[str],
    parents: List,
    id_key: str
) -> Tuple[List[Document], List[Tuple[str, object]]]:
    """
    - Buang summary kosong / None
    - Jaga sinkron parent-child
    """
    docs = []
    parent_pairs = []

    for summary, parent in zip(summaries, parents):
        if isinstance(summary, str) and summary.strip():
            doc_id = str(uuid.uuid4())
            docs.append(
                Document(
                    page_content=summary.strip(),
                    metadata={id_key: doc_id}
                )
            )
            parent_pairs.append((doc_id, parent))

    return docs, parent_pairs

    



# =========================
# INGESTION PIPELINE
# =========================
def run_ingestion():
    chunks = partition_pdf(
        filename=PDF_PATH,
        infer_table_structure=True,
        strategy="hi_res",
        extract_image_block_types=["Image"],
        extract_image_block_to_payload=True,
        chunking_strategy="by_title",
        max_characters=10000,
        combine_text_under_n_chars=2000,
        new_after_n_chars=6000,
    )

    texts = [c.text for c in chunks if "CompositeElement" in str(type(c))]
    tables = [str(c) for c in chunks if "Table" in str(type(c))]
    images = extract_images_base64(chunks)

    print(f"Texts: {len(texts)} | Tables: {len(tables)} | Images: {len(images)}")
    # Summarize text
    text_summaries = summarizer.batch(texts, {"max_concurrency": 3})

    # Summarize tables
    tables_html = [table.metadata.text_as_html for table in tables]
    table_summaries = summarizer.batch(tables_html, {"max_concurrency": 3})
    text_docs, text_pairs = build_valid_docs(
    summaries=text_summaries,
    parents=texts,
    id_key=ID_KEY
    )


    if text_docs:
        retriever.vectorstore.add_documents(text_docs)
        retriever.docstore.mset(text_pairs)



    table_docs, table_pairs = build_valid_docs(
        summaries=table_summaries,
        parents=tables,
        id_key=ID_KEY
    )

    if table_docs:
        retriever.vectorstore.add_documents(table_docs)
        retriever.docstore.mset(table_pairs)
    
    
    print("Ingestion berhasil")

    

    


# =========================
# AUTO RUN ON IMPORT/STARTUP
# =========================
# Ini trik agar saat Uvicorn jalan, ingestion langsung dieksekusi
# dan InMemoryStore terisi di RAM yang sama dengan aplikasi.

print("--- SYSTEM STARTUP: Memulai Ingestion PDF ---")
try:
    # Jalankan fungsi ingestion yang sudah kamu buat di atas
    run_ingestion()
    print("--- SYSTEM STARTUP: Ingestion Berhasil & Data Siap ---")
except Exception as e:
    print(f"--- SYSTEM ERROR: Ingestion Gagal: {e} ---")