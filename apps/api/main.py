import os, json, time
from typing import Optional, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from psycopg_pool import ConnectionPool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

APP = FastAPI(title="AURA API Fase0")

# CORS para Next dev
APP.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "")
print(f"DEBUG: DATABASE_URL = {DATABASE_URL[:20]}..." if DATABASE_URL else "DEBUG: DATABASE_URL is empty")
POOL = ConnectionPool(conninfo=DATABASE_URL, max_size=10, kwargs={"autocommit": False})
LLM = ChatOpenAI(model="gpt-4o-mini", temperature=0)
EMB = OpenAIEmbeddings(model="text-embedding-3-small")
DEMO_CLINIC_ID = os.getenv("DEMO_CLINIC_ID", "00000000-0000-0000-0000-000000000001")

class SimMsgIn(BaseModel):
    contact_name: str
    text: str
    conversation_id: Optional[str] = None

class IngestIn(BaseModel):
    title: str
    text: str

class SearchIn(BaseModel):
    query: str
    top_k: int = 3

def vec_literal(v: List[float]) -> str:
    return "[" + ",".join(f"{x:.6f}" for x in v) + "]"

def upsert_conversation(cur, clinic_id: str, contact_name: str, conv_id: Optional[str]) -> str:
    if conv_id:
        return conv_id
    cur.execute("insert into contacts(clinic_id,name) values (%s,%s) returning id", (clinic_id, contact_name))
    contact_id = cur.fetchone()[0]
    cur.execute(
        "insert into conversations(clinic_id,contact_id,channel) values (%s,%s,'sim') returning id",
        (clinic_id, contact_id),
    )
    return cur.fetchone()[0]

def insert_message(cur, conv_id: str, clinic_id: str, direction: str, sender: str, text: str,
                   intent: Optional[str]=None, tool: Optional[str]=None, payload: Optional[dict]=None):
    cur.execute(
        """
        insert into messages(conversation_id,clinic_id,direction,sender,text,intent,tool_called,payload_json)
        values (%s,%s,%s,%s,%s,%s,%s,%s) returning id
        """,
        (conv_id, clinic_id, direction, sender, text, intent, tool, json.dumps(payload or {})),
    )
    return cur.fetchone()[0]

def classify_intent(text:str) -> str:
    resp = LLM.invoke(f"Clasifica intención en una palabra de {{agendar, precios, faq}}. Texto: ```{text}```").content.lower()
    for k in ("agendar","precios","faq"):
        if k in resp: return k
    return "faq"

def rag_search(cur, clinic_id: str, query: str, top_k:int=3):
    qvec = EMB.embed_query(query)
    cur.execute(
        """
        select content from knowledge_chunks
        where clinic_id=%s
        order by embedding <-> %s::vector
        limit %s
        """,
        (clinic_id, vec_literal(qvec), top_k),
    )
    return [r[0] for r in cur.fetchall()]

@APP.get("/health")
def health(): return {"ok": True}

@APP.post("/sim/message")
def sim_message(msg: SimMsgIn):
    t0 = time.time()
    
    # Simular conversación sin base de datos
    conv_id = "demo-conv-001"
    
    # Clasificar intención
    intent = classify_intent(msg.text)
    
    if intent in ("faq","precios"):
        # Respuesta simulada para FAQ/precios
        ans = "Según nuestros servicios: Depilación láser axilas $29.990, duración 20 min. Promos: 2x1 axilas+bozo hasta 30/09."
    elif intent == "agendar":
        ans = "Tengo estos cupos: hoy 18:00 o mañana 11:30. ¿Cuál prefieres?"
    else:
        ans = "Entiendo tu consulta. ¿Te puedo ayudar con información sobre servicios, precios o agendar una cita?"
    
    return {
        "conversation_id": conv_id, 
        "intent": intent,
        "response": ans,
        "latency_ms": int((time.time()-t0)*1000)
    }

@APP.post("/knowledge/ingest")
def ingest_text(body: IngestIn):
    with POOL.connection() as conn, conn.cursor() as cur:
        cur.execute(
            "insert into knowledge_docs(clinic_id,title,uri) values (%s,%s,%s) returning id",
            (DEMO_CLINIC_ID, body.title, "inline"),
        )
        doc_id = cur.fetchone()[0]
        chunks = [p.strip() for p in body.text.split("\n") if p.strip()]
        for chunk in chunks:
            emb = EMB.embed_query(chunk)
            cur.execute(
                "insert into knowledge_chunks(doc_id,clinic_id,content,embedding,metadata_json) "
                "values (%s,%s,%s,%s::vector,'{}'::jsonb)",
                (doc_id, DEMO_CLINIC_ID, chunk, vec_literal(emb)),
            )
        conn.commit()
        return {"doc_id": str(doc_id), "chunks": len(chunks)}

@APP.post("/knowledge/search")
def search(body: SearchIn):
    with POOL.connection() as conn, conn.cursor() as cur:
        docs = rag_search(cur, DEMO_CLINIC_ID, body.query, body.top_k)
    return {"results": docs}
