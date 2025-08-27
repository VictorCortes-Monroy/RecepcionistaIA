"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Bot, Settings, Users, BarChart3 } from 'lucide-react';

interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  sender: 'visitor' | 'bot';
  timestamp: string;
}

interface ChatSession {
  id: string;
  clinic_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  source_url: string | null;
  user_agent: string | null;
  status: 'active' | 'closed' | 'transferred';
  created_at: string;
  last_activity: string;
  message_count: number;
}

export default function ChatWidgetPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startSession = async () => {
    if (!visitorName.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/chat/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinic_id: 'demo-clinic-001',
          visitor_name: visitorName,
          visitor_email: visitorEmail || null,
          source_url: window.location.href,
          user_agent: navigator.userAgent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.session.id);
        setIsSessionStarted(true);
        
        // Agregar mensaje de bienvenida
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          session_id: data.session.id,
          message: '¡Hola! Soy el asistente virtual de AURA. ¿En qué puedo ayudarte?',
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: sessionId,
      message: inputMessage,
      sender: 'visitor',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: inputMessage,
          sender: 'visitor',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          session_id: sessionId,
          message: data.bot_response.message,
          sender: 'bot',
          timestamp: data.bot_response.timestamp,
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isSessionStarted) {
        sendMessage();
      } else {
        startSession();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chat Widget</h1>
          <p className="text-gray-600">Interfaz de chat en tiempo real para visitantes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat en Vivo
                  {sessionId && (
                    <Badge variant="secondary" className="ml-auto">
                      Sesión: {sessionId.slice(-8)}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {!isSessionStarted ? (
                  <div className="flex-1 flex items-center justify-center p-6">
                    <div className="text-center max-w-md">
                      <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Iniciar Conversación</h3>
                      <p className="text-gray-600 mb-4">
                        Completa tus datos para comenzar a chatear con nuestro asistente virtual
                      </p>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="Tu nombre"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Input
                          placeholder="Tu email (opcional)"
                          type="email"
                          value={visitorEmail}
                          onChange={(e) => setVisitorEmail(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                        <Button 
                          onClick={startSession} 
                          disabled={isLoading || !visitorName.trim()}
                          className="w-full"
                        >
                          {isLoading ? 'Iniciando...' : 'Comenzar Chat'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender === 'visitor'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {message.sender === 'visitor' ? (
                                  <User className="h-4 w-4" />
                                ) : (
                                  <Bot className="h-4 w-4" />
                                )}
                                <span className="text-xs opacity-70">
                                  {message.sender === 'visitor' ? 'Tú' : 'AURA'}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap">{message.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <Bot className="h-4 w-4" />
                                <span className="text-xs opacity-70">AURA está escribiendo...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Escribe tu mensaje..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={isLoading}
                        />
                        <Button 
                          onClick={sendMessage} 
                          disabled={isLoading || !inputMessage.trim()}
                          size="icon"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Estado del Widget</label>
                    <Badge className="ml-2" variant="default">Activo</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Posición</label>
                    <p className="text-sm text-gray-600">Esquina inferior derecha</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color Principal</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-6 h-6 rounded bg-purple-600"></div>
                      <span className="text-sm">#8B5CF6</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sesiones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total de sesiones</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sesiones activas</span>
                    <Badge variant="default">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transferidas</span>
                    <Badge variant="outline">8</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Métricas Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mensajes totales</span>
                    <span className="font-medium">892</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Promedio por sesión</span>
                    <span className="font-medium">5.7</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasa de transferencia</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
