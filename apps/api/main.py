import os, json, time
from typing import Optional, List
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from psycopg_pool import ConnectionPool
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import httpx
import asyncio

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

# Configuración de WhatsApp
WHATSAPP_ACCESS_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN", "your-whatsapp-access-token")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "your-phone-number-id")
WHATSAPP_VERIFY_TOKEN = os.getenv("WHATSAPP_VERIFY_TOKEN", "your-verify-token")
WHATSAPP_API_URL = "https://graph.facebook.com/v18.0"

# Modelos para WhatsApp
class WhatsAppWebhook(BaseModel):
    object: str
    entry: List[dict]

class WhatsAppMessage(BaseModel):
    messaging_product: str = "whatsapp"
    to: str
    type: str
    text: Optional[dict] = None
    template: Optional[dict] = None
    interactive: Optional[dict] = None

class WhatsAppTemplate(BaseModel):
    name: str
    language: dict
    components: Optional[List[dict]] = None

class WhatsAppInteractive(BaseModel):
    type: str
    body: dict
    action: dict

# Funciones de WhatsApp
async def send_whatsapp_message(phone_number: str, message: str, message_type: str = "text"):
    """Enviar mensaje a WhatsApp"""
    try:
        url = f"{WHATSAPP_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages"
        
        if message_type == "text":
            payload = {
                "messaging_product": "whatsapp",
                "to": phone_number,
                "type": "text",
                "text": {"body": message}
            }
        elif message_type == "template":
            payload = {
                "messaging_product": "whatsapp",
                "to": phone_number,
                "type": "template",
                "template": {
                    "name": "hello_world",
                    "language": {"code": "es"}
                }
            }
        
        headers = {
            "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
        return {"success": True, "message_id": response.json().get("messages", [{}])[0].get("id")}
    except Exception as e:
        print(f"Error sending WhatsApp message: {e}")
        return {"success": False, "error": str(e)}

async def send_whatsapp_interactive(phone_number: str, title: str, body: str, buttons: List[dict]):
    """Enviar mensaje interactivo con botones"""
    try:
        url = f"{WHATSAPP_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages"
        
        payload = {
            "messaging_product": "whatsapp",
            "to": phone_number,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {"text": body},
                "action": {
                    "buttons": buttons
                }
            }
        }
        
        headers = {
            "Authorization": f"Bearer {WHATSAPP_ACCESS_TOKEN}",
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
        return {"success": True, "message_id": response.json().get("messages", [{}])[0].get("id")}
    except Exception as e:
        print(f"Error sending WhatsApp interactive: {e}")
        return {"success": False, "error": str(e)}

async def process_whatsapp_message(phone_number: str, message_text: str, message_id: str):
    """Procesar mensaje entrante de WhatsApp"""
    try:
        # Crear o obtener sesión de chat
        session_data = {
            "clinic_id": "demo-clinic-001",
            "visitor_name": f"Usuario WhatsApp ({phone_number[-4:]})",
            "visitor_email": None,
            "source_url": "whatsapp",
            "user_agent": "WhatsApp/2.0",
            "whatsapp_phone": phone_number
        }
        
        # Simular creación de sesión
        session_id = f"whatsapp_{phone_number}_{int(time.time())}"
        
        # Procesar mensaje con IA
        ai_response = await process_message_with_ai(message_text, session_id)
        
        # Enviar respuesta a WhatsApp
        await send_whatsapp_message(phone_number, ai_response)
        
        # Log de la conversación
        print(f"WhatsApp conversation: {phone_number} -> {message_text} -> {ai_response}")
        
        return {"success": True, "session_id": session_id, "response": ai_response}
    except Exception as e:
        print(f"Error processing WhatsApp message: {e}")
        return {"success": False, "error": str(e)}

# Endpoints de WhatsApp
@APP.get("/whatsapp/webhook")
def whatsapp_webhook_verify(mode: str = Query(None), token: str = Query(None), challenge: str = Query(None)):
    """Verificación del webhook de WhatsApp"""
    if mode == "subscribe" and token == WHATSAPP_VERIFY_TOKEN:
        print("✅ WhatsApp webhook verified successfully")
        return int(challenge)
    else:
        raise HTTPException(status_code=403, detail="Verification failed")

@APP.post("/whatsapp/webhook")
async def whatsapp_webhook(webhook_data: WhatsAppWebhook):
    """Webhook para recibir mensajes de WhatsApp"""
    try:
        for entry in webhook_data.entry:
            for change in entry.get("changes", []):
                if change.get("value", {}).get("messages"):
                    for message in change["value"]["messages"]:
                        if message.get("type") == "text":
                            phone_number = message["from"]
                            message_text = message["text"]["body"]
                            message_id = message["id"]
                            
                            # Procesar mensaje de forma asíncrona
                            asyncio.create_task(
                                process_whatsapp_message(phone_number, message_text, message_id)
                            )
        
        return {"status": "ok"}
    except Exception as e:
        print(f"Error in WhatsApp webhook: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

class WhatsAppSendRequest(BaseModel):
    to: str
    message: str
    message_type: str = "text"

@APP.post("/whatsapp/send")
async def send_whatsapp_message_endpoint(request: WhatsAppSendRequest):
    """Enviar mensaje a WhatsApp"""
    result = await send_whatsapp_message(request.to, request.message, request.message_type)
    return result

@APP.post("/whatsapp/send-interactive")
async def send_whatsapp_interactive_endpoint(
    phone_number: str, 
    title: str, 
    body: str, 
    buttons: List[dict]
):
    """Enviar mensaje interactivo a WhatsApp"""
    result = await send_whatsapp_interactive(phone_number, title, body, buttons)
    return result

@APP.get("/whatsapp/status")
def whatsapp_status():
    """Verificar estado de la integración WhatsApp"""
    return {
        "status": "active",
        "phone_number_id": WHATSAPP_PHONE_NUMBER_ID,
        "api_url": WHATSAPP_API_URL,
        "features": [
            "webhook_reception",
            "message_sending",
            "interactive_messages",
            "template_messages"
        ]
    }
