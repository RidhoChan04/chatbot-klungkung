# rag.py
from base64 import b64decode
from typing import Dict, List

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
import os
# retriever DI-IMPORT, bukan dibuat ulang
from app.ingest import retriever
from dotenv import load_dotenv


# =========================
# HELPERS
# =========================
def parse_docs(docs: List[str]) -> Dict[str, List[str]]:
    images, texts = [], []
    for doc in docs:
        if not isinstance(doc, str):
            continue
        try:
            b64decode(doc, validate=True)
            images.append(doc)
        except Exception:
            texts.append(doc)
    return {"images": images, "texts": texts}


def build_prompt(kwargs):
    context = kwargs["context"]
    question = kwargs["question"]

    messages = []

    if context["texts"]:
        context_text = "\n".join(context["texts"])
        messages.append(
            HumanMessage(
                content=f"""
Anda adalah seorang pemandu wisata Klungkung

gunakan gaya ramah,singkat dan informatif

hanya gunakan dokumen yang ada untuk menjawab

Context:
{context_text}

Question:
{question}
"""
            )
        )
    else:
        messages.append(
            HumanMessage(content=f"Question: {question}")
        )

    for img in context["images"]:
        messages.append(
            HumanMessage(
                content=[
                    {
                        "type": "image",
                        "data": img,
                        "mime_type": "image/jpeg",
                    }
                ]
            )
        )

    return messages



model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
    api_key=os.getenv("GEMINI_API_KEY")
)



rag_chain = (
    {
        "context": retriever | RunnableLambda(parse_docs),
        "question": RunnablePassthrough(),
    }
    | RunnableLambda(build_prompt)
    | model
    | StrOutputParser()
)
