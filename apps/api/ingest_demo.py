import os
from psycopg_pool import ConnectionPool
from langchain_openai import OpenAIEmbeddings

DATABASE_URL = os.getenv("DATABASE_URL", "")
print(f"DEBUG: DATABASE_URL = {DATABASE_URL[:20]}..." if DATABASE_URL else "DEBUG: DATABASE_URL is empty")
POOL = ConnectionPool(conninfo=DATABASE_URL)
EMB = OpenAIEmbeddings(model="text-embedding-3-small")
CLINIC = os.getenv("DEMO_CLINIC_ID","00000000-0000-0000-0000-000000000001")

DOC = """
Servicios: Depilación láser axilas $29.990, duración 20 min.
Contraindicaciones: embarazo, fotosensibilidad.
Políticas: reagendos con 24h.
Promos: 2x1 axilas+bozo hasta 30/09.
"""

def vec_literal(v): return "[" + ",".join(f"{x:.6f}" for x in v) + "]"

with POOL.connection() as conn, conn.cursor() as cur:
    cur.execute("insert into knowledge_docs(clinic_id,title,uri) values (%s,%s,%s) returning id",
                (CLINIC,"Servicios Demo","inline"))
    doc_id = cur.fetchone()[0]
    for line in [l.strip() for l in DOC.split("\n") if l.strip()]:
        emb = EMB.embed_query(line)
        cur.execute(
            "insert into knowledge_chunks(doc_id,clinic_id,content,embedding,metadata_json) "
            "values (%s,%s,%s,%s::vector,'{}'::jsonb)",
            (doc_id, CLINIC, line, vec_literal(emb))
        )
    conn.commit()
print("OK")
