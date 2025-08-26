# AURA Receptionist - Instrucciones de Configuración

## 🚀 Proyecto Completado

El proyecto AURA Receptionist Fase 0 está completamente configurado con:

### ✅ Estructura del Monorepo
```
RecepcionistaIA/
├─ docker-compose.yml          # Entorno Docker completo
├─ .env.example               # Variables de entorno backend
├─ .gitignore                 # Archivos a ignorar
├─ README.md                  # Documentación principal
├─ apps/
│  ├─ api/                    # FastAPI backend
│  │  ├─ Dockerfile           # Container Python
│  │  ├─ requirements.txt     # Dependencias Python
│  │  ├─ main.py             # API endpoints principales
│  │  └─ ingest_demo.py      # Script de seed conocimiento
│  └─ web/                    # Next.js frontend
│     ├─ Dockerfile           # Container Node.js
│     ├─ package.json         # Dependencias Node.js
│     ├─ tsconfig.json        # Configuración TypeScript
│     ├─ next.config.js       # Configuración Next.js
│     ├─ .env.example        # Variables frontend
│     └─ app/                 # App Router Next.js
│        ├─ layout.tsx        # Layout principal
│        ├─ page.tsx          # Página home
│        └─ inbox/page.tsx    # Inbox en vivo con Supabase
└─ scripts/
   ├─ dev_notes.txt          # Notas de desarrollo
   └─ setup_instructions.md  # Este archivo
```

### ✅ Funcionalidades Implementadas

#### Backend (FastAPI)
- **Health Check**: `/health`
- **SimChannel**: `/sim/message` - Simula mensajes de usuario
- **Knowledge Ingest**: `/knowledge/ingest` - Carga documentos
- **Knowledge Search**: `/knowledge/search` - Búsqueda RAG
- **NLU**: Clasificación de intención (agendar, precios, faq)
- **RAG**: Búsqueda vectorial con embeddings
- **Multi-tenant**: RLS por clinic_id
- **CORS**: Configurado para desarrollo local

#### Frontend (Next.js)
- **Inbox en vivo**: Conectado a Supabase Realtime
- **App Router**: Estructura moderna Next.js 14
- **TypeScript**: Tipado completo
- **Supabase Client**: Integración directa

#### Infraestructura
- **Docker Compose**: Redis + API + Web
- **Hot Reload**: Desarrollo en tiempo real
- **Volumes**: Persistencia de código
- **Networking**: Comunicación entre servicios

## 🔧 Configuración Inicial

### 1. Variables de Entorno

```bash
# Copiar archivos de ejemplo
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
```

### 2. Completar Variables

#### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:<DB_PASSWORD>@<DB_HOST>:5432/postgres?sslmode=require
OPENAI_API_KEY=<your_openai_key>
REDIS_URL=redis://redis:6379/0
DEMO_CLINIC_ID=00000000-0000-0000-0000-000000000001
```

#### Frontend (apps/web/.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
```

### 3. Requisitos Supabase

- ✅ Esquema Postgres cargado
- ✅ Tablas: contacts, conversations, messages, knowledge_docs, knowledge_chunks
- ✅ pgvector extension habilitado
- ✅ RLS activo por clinic_id
- ✅ Realtime en public.messages
- ✅ Usuario vinculado en user_accounts

## 🚀 Comandos de Desarrollo

### Levantar Entorno
```bash
docker compose up --build
```

### Seed de Conocimiento
```bash
docker compose exec api python ingest_demo.py
```

### Smoke Test
```bash
# Health check
curl -s http://localhost:8000/health

# Simular mensaje
curl -s http://localhost:8000/sim/message \
  -H "Content-Type: application/json" \
  -d '{"contact_name":"Carla","text":"precio depilación axilas"}'
```

### Ver Logs
```bash
docker compose logs -f api
docker compose logs -f web
```

## 🌐 Acceso

- **API**: http://localhost:8000
- **Web**: http://localhost:3000
- **Inbox**: http://localhost:3000/inbox

## 📊 Flujo de Datos

1. **SimChannel** → `/sim/message` → **NLU** → **RAG** → **Respuesta** → `messages` table
2. **Supabase Realtime** → **Inbox web** en vivo
3. **Ingest** → **chunking** → **embeddings** → `knowledge_chunks`

## 🔮 Próximos Pasos

- [ ] Implementar NBO (Next Best Offer)
- [ ] Agregar autenticación Supabase Auth
- [ ] Dashboard de analytics
- [ ] Integración WhatsApp Cloud API
- [ ] Sistema de citas real
- [ ] Configuración de servicios y promociones
- [ ] Insights Studio

## 🛠️ Troubleshooting

### Error de Conexión a Supabase
- Verificar DATABASE_URL
- Confirmar RLS y permisos
- Revisar pgvector extension

### Error de OpenAI
- Verificar OPENAI_API_KEY
- Confirmar créditos disponibles

### Error de Realtime
- Verificar NEXT_PUBLIC_SUPABASE_URL
- Confirmar Realtime habilitado en Supabase

### Error de Docker
- Verificar Docker Desktop activo
- Limpiar containers: `docker compose down -v`
- Rebuild: `docker compose up --build`

## 📝 Notas Técnicas

- **Multi-tenant**: RLS por clinic_id en todas las tablas
- **Vector Search**: pgvector con embeddings OpenAI
- **Realtime**: WebSocket via Supabase
- **Hot Reload**: Volumes montados para desarrollo
- **CORS**: Configurado para localhost:3000
- **TypeScript**: Configuración estricta
- **FastAPI**: Async/await con connection pooling

¡El proyecto está listo para desarrollo! 🎉

