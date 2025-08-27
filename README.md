# 🏥 AURA Receptionist - IA Conversacional para Clínicas Estéticas

## 🎯 **Descripción**

AURA Receptionist es una plataforma SaaS completa que convierte mensajes en reservas, ventas e insights accionables usando IA conversacional. Diseñada específicamente para clínicas estéticas, ofrece un sistema de recepción inteligente 24/7.

## ✨ **Características Principales**

### 🤖 **IA Conversacional**
- **NLU Avanzado**: Clasificación automática de intenciones (agendar, precios, FAQ)
- **RAG (Retrieval-Augmented Generation)**: Respuestas basadas en conocimiento específico de la clínica
- **Next-Best-Offer (NBO)**: Recomendaciones inteligentes en tiempo real
- **Procesamiento Multilingüe**: Soporte completo en español

### 📱 **Integración WhatsApp**
- **WhatsApp Business API**: Integración completa con Meta
- **Webhook Automático**: Recepción y procesamiento de mensajes en tiempo real
- **Respuestas Automáticas**: IA que responde automáticamente a consultas
- **Mensajes Interactivos**: Botones y plantillas personalizadas

### 🎨 **Frontend Moderno**
- **Dashboard en Tiempo Real**: Métricas y conversaciones en vivo
- **Chat Widget Integrable**: Widget para sitios web externos
- **Panel de Administración**: Gestión completa de servicios y usuarios
- **Interfaz Responsive**: Diseño moderno con Tailwind CSS

### 🔧 **Backend Robusto**
- **FastAPI**: API RESTful de alto rendimiento
- **Multi-tenancy**: Soporte para múltiples clínicas
- **Row-Level Security (RLS)**: Seguridad a nivel de fila
- **Base de Datos Vectorial**: pgvector para búsquedas semánticas

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Docker y Docker Compose
- Node.js 18+
- Python 3.9+
- Cuenta de Meta for Developers (para WhatsApp)

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/VictorCortes-Monroy/RecepcionistaIA.git
cd RecepcionistaIA
```

### **2. Configurar Variables de Entorno**
Crear archivo `.env` en la raíz:
```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/aura_receptionist

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Demo Configuration
DEMO_CLINIC_ID=00000000-0000-0000-0000-000000000001

# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-verify-token
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

### **3. Iniciar Servicios**
```bash
docker-compose up -d
```

### **4. Acceder a la Aplicación**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs

## 📱 **Configuración de WhatsApp**

### **1. Crear Aplicación en Meta for Developers**
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una nueva aplicación tipo "Business"
3. Agrega el producto "WhatsApp"

### **2. Obtener Credenciales**
- **Phone Number ID**: Desde WhatsApp → Getting Started
- **Access Token**: Desde WhatsApp → Configuration
- **Verify Token**: Crea un token personalizado

### **3. Configurar Webhook**
- **URL**: `https://tu-dominio.com/whatsapp/webhook`
- **Verify Token**: El token que configuraste
- **Fields**: Selecciona `messages`

### **4. Configurar Variables de Entorno**
Actualiza tu archivo `.env` con las credenciales reales.

## 🎯 **Endpoints Principales**

### **API Core**
- `GET /health` - Estado de la API
- `POST /sim/message` - Simular mensaje
- `POST /knowledge/ingest` - Ingresar conocimiento
- `POST /knowledge/search` - Buscar conocimiento

### **WhatsApp Integration**
- `GET /whatsapp/status` - Estado de WhatsApp
- `POST /whatsapp/send` - Enviar mensaje
- `GET /whatsapp/webhook` - Verificación de webhook
- `POST /whatsapp/webhook` - Recibir mensajes

### **NBO (Next-Best-Offer)**
- `POST /nbo/recommend` - Obtener recomendación
- `POST /nbo/feedback` - Enviar feedback

### **Analytics**
- `GET /analytics/dashboard` - Dashboard principal
- `GET /analytics/conversations` - Métricas de conversaciones
- `GET /analytics/nbo-performance` - Rendimiento NBO

### **Admin Panel**
- `GET /admin/services` - Gestionar servicios
- `GET /admin/promotions` - Gestionar promociones
- `GET /admin/users` - Gestionar usuarios
- `GET /admin/settings` - Configuración de clínica

## 🎨 **Frontend Pages**

### **Páginas Principales**
- `/` - Página de inicio con navegación
- `/simulate` - Simulador de mensajes
- `/nbo` - Pruebas de Next-Best-Offer
- `/chat-widget` - Demo del chat widget
- `/dashboard` - Dashboard principal
- `/whatsapp` - Configuración de WhatsApp
- `/demo` - Demo de clínica estética

### **Componentes**
- `ChatWidget` - Widget integrable para sitios web
- `Providers` - Proveedores de React Query
- `UI Components` - Componentes de Tailwind + shadcn/ui

## 🔧 **Arquitectura**

### **Stack Tecnológico**
- **Backend**: FastAPI, PostgreSQL, Redis, pgvector
- **Frontend**: Next.js 14, React, TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Lucide React
- **IA**: OpenAI GPT-4, LangChain, Embeddings
- **Base de Datos**: PostgreSQL con pgvector
- **Cache**: Redis
- **WhatsApp**: Meta WhatsApp Business API
- **Deployment**: Docker, Docker Compose

### **Estructura del Proyecto**
```
RecepcionistaIA/
├── apps/
│   ├── api/                 # Backend FastAPI
│   │   ├── main.py         # API principal
│   │   ├── requirements.txt # Dependencias Python
│   │   └── Dockerfile      # Container del backend
│   └── web/                # Frontend Next.js
│       ├── app/            # App Router
│       ├── components/     # Componentes React
│       ├── package.json    # Dependencias Node.js
│       └── Dockerfile      # Container del frontend
├── docker-compose.yml      # Orquestación de servicios
├── .env.example           # Variables de entorno de ejemplo
├── WHATSAPP_SETUP.md      # Guía de configuración WhatsApp
└── README.md              # Este archivo
```

## 🚀 **Desarrollo**

### **Iniciar en Modo Desarrollo**
```bash
# Backend
cd apps/api
uvicorn main:APP --reload --host 0.0.0.0 --port 8000

# Frontend
cd apps/web
npm run dev
```

### **Docker Development**
```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f api
docker-compose logs -f web

# Detener servicios
docker-compose down
```

## 📊 **Métricas y Analytics**

### **Métricas Disponibles**
- **Conversaciones**: Total, activas, completadas
- **Intenciones**: Distribución por tipo (agendar, precios, FAQ)
- **NBO Performance**: Tasa de conversión, recomendaciones
- **Revenue**: Ingresos generados por conversaciones
- **Tiempo de Respuesta**: Latencia promedio de IA

### **Dashboard en Tiempo Real**
- Métricas actualizadas en tiempo real
- Gráficos interactivos
- Filtros por fecha y clínica
- Exportación de datos

## 🔒 **Seguridad**

### **Autenticación y Autorización**
- **JWT Tokens**: Autenticación segura
- **Multi-tenancy**: Aislamiento por clínica
- **Row-Level Security**: Seguridad a nivel de base de datos
- **CORS**: Configuración segura para frontend

### **WhatsApp Security**
- **Webhook Verification**: Verificación de Meta
- **Token Validation**: Validación de tokens de acceso
- **Rate Limiting**: Límites de API respetados

## 🐛 **Solución de Problemas**

### **Problemas Comunes**

#### **Docker Issues**
```bash
# Limpiar contenedores
docker-compose down -v
docker system prune -f

# Reconstruir imágenes
docker-compose build --no-cache
```

#### **WhatsApp Webhook Issues**
- Verificar que la URL sea accesible públicamente
- Confirmar que el verify token coincida
- Revisar logs de la API para errores

#### **Frontend Issues**
```bash
# Limpiar cache de Next.js
cd apps/web
rm -rf .next
npm run dev
```

## 📈 **Roadmap**

### **Próximas Características**
- [ ] **Integración con Calendarios**: Google Calendar, Outlook
- [ ] **Sistema de Pagos**: Stripe, PayPal
- [ ] **Analytics Avanzados**: Machine Learning para optimización
- [ ] **Multi-idioma**: Soporte para inglés y otros idiomas
- [ ] **Mobile App**: Aplicación móvil nativa
- [ ] **Integración CRM**: Salesforce, HubSpot

### **Mejoras Técnicas**
- [ ] **Microservicios**: Arquitectura distribuida
- [ ] **Kubernetes**: Orquestación en producción
- [ ] **CI/CD**: Pipeline de deployment automático
- [ ] **Monitoring**: APM y alertas

## 🤝 **Contribución**

### **Cómo Contribuir**
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### **Estándares de Código**
- **Python**: PEP 8, type hints
- **TypeScript**: ESLint, Prettier
- **Commits**: Conventional Commits
- **Documentación**: Docstrings, README actualizado

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 **Soporte**

### **Contacto**
- **Email**: soporte@aura-receptionist.com
- **Documentación**: [docs.aura-receptionist.com](https://docs.aura-receptionist.com)
- **Issues**: [GitHub Issues](https://github.com/VictorCortes-Monroy/RecepcionistaIA/issues)

### **Comunidad**
- **Discord**: [AURA Community](https://discord.gg/aura-receptionist)
- **Twitter**: [@AURAReceptionist](https://twitter.com/AURAReceptionist)

---

**¡Gracias por usar AURA Receptionist! 🎉**

*Transformando la atención al cliente en clínicas estéticas con IA conversacional.*

