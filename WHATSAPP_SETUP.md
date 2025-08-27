# 📱 Configuración de WhatsApp Business API

## 🎯 **Resumen**

Esta guía te ayudará a configurar la integración de WhatsApp Business API con AURA Receptionist para recibir y enviar mensajes automáticamente.

## 📋 **Prerrequisitos**

1. **Cuenta de Meta for Developers**
2. **Aplicación de Facebook creada**
3. **Número de teléfono verificado**
4. **Acceso a la API de WhatsApp Business**

## 🚀 **Paso a Paso**

### **1. Crear Aplicación en Meta for Developers**

1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Inicia sesión con tu cuenta de Facebook
3. Haz clic en **"Crear App"**
4. Selecciona **"Business"** como tipo de aplicación
5. Completa la información básica de tu aplicación

### **2. Configurar WhatsApp Business API**

1. En tu aplicación, ve a **"Add Product"**
2. Busca y agrega **"WhatsApp"**
3. Completa la configuración inicial:
   - **Business Account**: Selecciona tu cuenta de negocio
   - **Phone Number**: Agrega tu número de teléfono verificado

### **3. Obtener Credenciales**

#### **Phone Number ID**
1. Ve a **WhatsApp → Getting Started**
2. Copia el **Phone Number ID** (formato: `123456789012345`)

#### **Access Token**
1. Ve a **WhatsApp → Configuration**
2. En **"Access tokens"**, genera un nuevo token
3. Copia el token (formato: `EAABwzLixnjYBO...`)

#### **Verify Token**
1. Crea un token personalizado (ej: `aura_verify_token_2024`)
2. Este token se usará para verificar el webhook

### **4. Configurar Variables de Entorno**

Agrega estas variables a tu archivo `.env`:

```bash
# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=EAABwzLixnjYBO...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=1287834806143383
```

**Nota**: El `WHATSAPP_VERIFY_TOKEN` debe ser el mismo que configures en Meta for Developers.

### **5. Configurar Webhook**

1. Ve a **WhatsApp → Configuration**
2. En la sección **"Webhook"**:
   - **Webhook URL**: `https://aura-receptionist.loca.lt/whatsapp/webhook`
   - **Verify Token**: `1287834806143383`
   - **Fields**: Selecciona `messages`

3. Haz clic en **"Verify and Save"**

**Nota**: La URL del webhook es tu túnel de LocalTunnel. Para producción, usa tu dominio real.

### **6. Probar la Integración**

#### **Verificar Estado**
```bash
curl http://localhost:8000/whatsapp/status
```

#### **Enviar Mensaje de Prueba**
```bash
curl -X POST http://localhost:8000/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+56912345678",
    "message": "¡Hola! Este es un mensaje de prueba desde AURA",
    "message_type": "text"
  }'
```

## 🔧 **Endpoints Disponibles**

### **GET /whatsapp/status**
Verifica el estado de la integración.

### **GET /whatsapp/webhook**
Verificación del webhook (usado por Meta).

### **POST /whatsapp/webhook**
Recibe mensajes entrantes de WhatsApp.

### **POST /whatsapp/send**
Envía mensajes a WhatsApp.

### **POST /whatsapp/send-interactive**
Envía mensajes interactivos con botones.

## 📱 **Tipos de Mensajes Soportados**

### **Mensajes de Texto**
```json
{
  "phone_number": "+56912345678",
  "message": "¡Hola! ¿En qué puedo ayudarte?",
  "message_type": "text"
}
```

### **Mensajes de Plantilla**
```json
{
  "phone_number": "+56912345678",
  "message": "",
  "message_type": "template"
}
```

### **Mensajes Interactivos**
```json
{
  "phone_number": "+56912345678",
  "title": "Servicios Disponibles",
  "body": "¿Qué servicio te interesa?",
  "buttons": [
    {
      "type": "reply",
      "reply": {
        "id": "depilacion",
        "title": "Depilación Láser"
      }
    },
    {
      "type": "reply",
      "reply": {
        "id": "facial",
        "title": "Tratamiento Facial"
      }
    }
  ]
}
```

## 🎨 **Plantillas de Mensajes**

### **Bienvenida**
```
¡Hola! Soy el asistente virtual de AURA. 
¿Te puedo ayudar con información sobre nuestros servicios?
```

### **Información de Servicios**
```
Nuestros servicios incluyen:
• Depilación láser (desde $29.990)
• Tratamientos faciales (desde $45.000)
• Consultas gratuitas

¿Te gustaría conocer más detalles?
```

### **Agendar Cita**
```
¡Perfecto! Tengo estos horarios disponibles:

• Hoy 18:00
• Mañana 11:30
• Jueves 15:00

¿Cuál prefieres?
```

## 🔒 **Seguridad**

### **Verificación de Webhook**
- Meta verifica el webhook usando el `verify_token`
- Solo mensajes verificados son procesados

### **Validación de Números**
- Los números deben estar en formato internacional
- Solo números verificados pueden recibir mensajes

### **Rate Limiting**
- Respeta los límites de la API de WhatsApp
- Máximo 1000 mensajes por día (gratuito)

## 🐛 **Solución de Problemas**

### **Error: "Invalid phone number"**
- Verifica que el número esté en formato internacional
- Asegúrate de que el número esté verificado en WhatsApp Business

### **Error: "Access token invalid"**
- Regenera el access token en Meta for Developers
- Verifica que el token tenga permisos de WhatsApp

### **Error: "Webhook verification failed"**
- Verifica que el `verify_token` coincida
- Asegúrate de que la URL del webhook sea accesible

### **Error: "Message template not found"**
- Las plantillas deben ser aprobadas por Meta
- Usa solo plantillas pre-aprobadas o mensajes de texto

## 📊 **Monitoreo**

### **Logs del Sistema**
```bash
# Ver logs de WhatsApp
docker-compose logs api | grep whatsapp
```

### **Métricas Disponibles**
- Total de conversaciones
- Mensajes enviados/recibidos
- Tiempo promedio de respuesta
- Tasa de satisfacción

## 🔄 **Flujo de Mensajes**

1. **Cliente envía mensaje** → WhatsApp
2. **WhatsApp envía webhook** → AURA API
3. **AURA procesa con IA** → Genera respuesta
4. **AURA envía respuesta** → WhatsApp
5. **WhatsApp entrega** → Cliente

## 📞 **Soporte**

Si tienes problemas con la configuración:

1. Verifica los logs del sistema
2. Revisa la documentación de Meta for Developers
3. Contacta al equipo de soporte de AURA

## 🎉 **¡Listo!**

Una vez configurado, tu clínica podrá:
- ✅ Recibir mensajes automáticamente
- ✅ Responder con IA conversacional
- ✅ Enviar mensajes programados
- ✅ Gestionar conversaciones desde el dashboard
- ✅ Integrar con el sistema de reservas

---

**¿Necesitas ayuda?** Contacta al equipo de AURA para soporte técnico.
