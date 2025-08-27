"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, User, Bot, X, Minimize2, Maximize2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  sender: 'visitor' | 'bot';
  timestamp: string;
}

interface ChatWidgetProps {
  clinicId: string;
  position?: 'bottom-right' | 'bottom-left' | 'center';
  primaryColor?: string;
  title?: string;
  welcomeMessage?: string;
  className?: string;
}

export default function ChatWidget({
  clinicId,
  position = 'bottom-right',
  primaryColor = '#8B5CF6',
  title = '¡Hola! ¿En qué te puedo ayudar?',
  welcomeMessage = 'Bienvenido a AURA. Soy tu asistente virtual, ¿te puedo ayudar con información sobre nuestros servicios?',
  className = ''
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
          clinic_id: clinicId,
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
        const welcomeMsg: ChatMessage = {
          id: 'welcome',
          session_id: data.session.id,
          message: welcomeMessage,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMsg]);
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

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'center':
        return 'bottom-1/2 left-1/2 transform translate-x-1/2 translate-y-1/2';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 shadow-2xl border-0">
          <CardHeader 
            className="text-white p-4 pb-2"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {title}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {sessionId && (
              <Badge variant="secondary" className="text-xs mt-1">
                Sesión: {sessionId.slice(-8)}
              </Badge>
            )}
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              {!isSessionStarted ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center w-full">
                    <h3 className="text-sm font-semibold mb-2">Iniciar Conversación</h3>
                    <p className="text-xs text-gray-600 mb-3">
                      Completa tus datos para comenzar
                    </p>
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Tu nombre"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="h-8 text-sm"
                      />
                      <Input
                        placeholder="Email (opcional)"
                        type="email"
                        value={visitorEmail}
                        onChange={(e) => setVisitorEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="h-8 text-sm"
                      />
                      <Button 
                        onClick={startSession} 
                        disabled={isLoading || !visitorName.trim()}
                        className="w-full h-8 text-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {isLoading ? 'Iniciando...' : 'Comenzar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-3">
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-2 text-sm ${
                              message.sender === 'visitor'
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                            style={message.sender === 'visitor' ? { backgroundColor: primaryColor } : {}}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              {message.sender === 'visitor' ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                              <span className="text-xs opacity-70">
                                {message.sender === 'visitor' ? 'Tú' : 'AURA'}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-xs">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-lg p-2">
                            <div className="flex items-center gap-1">
                              <Bot className="h-3 w-3" />
                              <span className="text-xs opacity-70">AURA está escribiendo...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                  
                  <div className="border-t p-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Escribe tu mensaje..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="h-8 text-sm"
                      />
                      <Button 
                        onClick={sendMessage} 
                        disabled={isLoading || !inputMessage.trim()}
                        size="sm"
                        className="h-8 w-8 p-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
