# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from dotenv import load_dotenv
load_dotenv()  
# import chain dari rag.py
from app.rag import rag_chain

app = FastAPI(
    title="Multimodal RAG API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str


@app.get("/health")
def health_check():
    load_dotenv()
    return {"status": "ok"}


@app.post("/chat")
def chat(req: ChatRequest):
    try:
        answer = rag_chain.invoke(req.question)
        return {"answer": answer}
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}

