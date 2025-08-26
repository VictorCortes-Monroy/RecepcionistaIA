# AURA Receptionist — Fase 0

## Requisitos
- Supabase remoto con esquema cargado y Realtime en `public.messages`.
- Docker Desktop.
- Claves en `.env` y `apps/web/.env.local`.

## Dev
```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
docker compose up --build

Seed conocimiento
docker compose exec api python ingest_demo.py

Probar
curl -s http://localhost:8000/sim/message \
 -H "Content-Type: application/json" \
 -d '{"contact_name":"Carla","text":"precio depilación axilas"}'


Abrir http://localhost:3000/inbox para ver mensajes en vivo.

