"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Settings, 
  Send, 
  Phone, 
  CheckCircle, 
  AlertCircle,
  Bot,
  Users,
  BarChart3,
  Copy,
  ExternalLink
} from 'lucide-react';

interface WhatsAppConfig {
  phone_number_id: string;
  access_token: string;
  verify_token: string;
  webhook_url: string;
  is_active: boolean;
  auto_reply_enabled: boolean;
  business_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
}

interface WhatsAppStats {
  total_conversations: number;
  active_conversations: number;
  messages_sent_today: number;
  messages_received_today: number;
  response_time_avg: number;
  satisfaction_rate: number;
}

export default function WhatsAppPage() {
  const [config, setConfig] = useState<WhatsAppConfig | null>(null);
  const [stats, setStats] = useState<WhatsAppStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Simular carga de configuración
    setTimeout(() => {
      setConfig({
        phone_number_id: "123456789012345",
        access_token: "EAABwzLixnjYBO...",
        verify_token: "aura_verify_token_2024",
        webhook_url: "https://api.aura.com/whatsapp/webhook",
        is_active: true,
        auto_reply_enabled: true,
        business_hours: {
          monday: { open: "09:00", close: "19:00" },
          tuesday: { open: "09:00", close: "19:00" },
          wednesday: { open: "09:00", close: "19:00" },
          thursday: { open: "09:00", close: "19:00" },
          friday: { open: "09:00", close: "19:00" },
          saturday: { open: "09:00", close: "17:00" },
          sunday: { open: "closed", close: "closed" }
        }
      });

      setStats({
        total_conversations: 234,
        active_conversations: 18,
        messages_sent_today: 45,
        messages_received_today: 52,
        response_time_avg: 2.3,
        satisfaction_rate: 4.8
      });

      setIsLoading(false);
    }, 1000);
  }, []);

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) return;
    
    setIsSending(true);
    try {
      const response = await fetch('http://localhost:8000/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: testPhone,
          message: testMessage,
          message_type: "text"
        }),
      });

      if (response.ok) {
        alert('✅ Mensaje enviado exitosamente');
        setTestMessage('');
      } else {
        alert('❌ Error al enviar mensaje');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('✅ Copiado al portapapeles');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración de WhatsApp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Integration</h1>
          <p className="text-gray-600">Configuración y gestión de la integración con WhatsApp Business API</p>
        </div>

        {/* Status Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">WhatsApp Business API</h3>
                  <p className="text-sm text-gray-600">Conectado y funcionando correctamente</p>
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Activo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_conversations}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats?.active_conversations}</span> activas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mensajes Hoy</CardTitle>
              <Send className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.messages_sent_today}</div>
              <p className="text-xs text-muted-foreground">
                Enviados • {stats?.messages_received_today} recibidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Respuesta</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.response_time_avg}s</div>
              <p className="text-xs text-muted-foreground">
                Promedio de respuesta
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.satisfaction_rate}/5</div>
              <p className="text-xs text-muted-foreground">
                Calificación promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="config" className="space-y-6">
          <TabsList>
            <TabsTrigger value="config">Configuración</TabsTrigger>
            <TabsTrigger value="test">Pruebas</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración de API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Phone Number ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={config?.phone_number_id} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(config?.phone_number_id || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Access Token</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={config?.access_token} 
                        readOnly 
                        type="password"
                        className="font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(config?.access_token || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Verify Token</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input 
                        value={config?.verify_token} 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(config?.verify_token || '')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Horarios de Atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(config?.business_hours || {}).map(([day, hours]) => (
                      <div key={day} className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{day}</span>
                        <span className="text-sm text-gray-600">
                          {hours.open === "closed" ? "Cerrado" : `${hours.open} - ${hours.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Mensaje de Prueba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Número de Teléfono</label>
                  <Input 
                    placeholder="+56912345678"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Mensaje</label>
                  <Input 
                    placeholder="¡Hola! Este es un mensaje de prueba desde AURA"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={sendTestMessage}
                  disabled={isSending || !testPhone || !testMessage}
                  className="w-full"
                >
                  {isSending ? 'Enviando...' : 'Enviar Mensaje de Prueba'}
                </Button>

                <div className="text-sm text-gray-600">
                  <p>💡 <strong>Tip:</strong> Asegúrate de que el número esté en formato internacional (ej: +56912345678)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhook" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Configuración del Webhook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Webhook URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input 
                      value={config?.webhook_url} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(config?.webhook_url || '')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open('https://developers.facebook.com/apps', '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Configuración en Meta for Developers:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Ve a <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a></li>
                    <li>2. Selecciona tu app</li>
                    <li>3. Ve a WhatsApp → Configuration</li>
                    <li>4. En "Webhook", agrega la URL: <code className="bg-blue-100 px-1 rounded">{config?.webhook_url}</code></li>
                    <li>5. En "Verify token", usa: <code className="bg-blue-100 px-1 rounded">{config?.verify_token}</code></li>
                    <li>6. Selecciona los campos: <code className="bg-blue-100 px-1 rounded">messages</code></li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Plantillas de Mensajes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Bienvenida</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      ¡Hola! Soy el asistente virtual de AURA. ¿Te puedo ayudar con información sobre nuestros servicios?
                    </p>
                    <Badge variant="outline">hello_world</Badge>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Información de Servicios</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Nuestros servicios incluyen depilación láser, tratamientos faciales y consultas gratuitas. ¿Te gustaría conocer precios?
                    </p>
                    <Badge variant="outline">services_info</Badge>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Agendar Cita</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      ¡Perfecto! Tengo estos horarios disponibles. ¿Cuál prefieres?
                    </p>
                    <Badge variant="outline">booking_slots</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
