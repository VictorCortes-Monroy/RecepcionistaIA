'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Clock, User, Bot } from 'lucide-react'

type Message = {
  id: number
  conversation_id: string
  direction: 'in' | 'out'
  sender: 'user' | 'bot' | 'human'
  text: string | null
  intent: string | null
  created_at: string
}

export default function Inbox() {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      conversation_id: 'demo-conv-001',
      direction: 'in',
      sender: 'user',
      text: '¿Cuánto cuesta la depilación de axilas?',
      intent: 'precios',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      conversation_id: 'demo-conv-001',
      direction: 'out',
      sender: 'bot',
      text: 'La depilación de axilas cuesta $29.990.',
      intent: 'precios',
      created_at: new Date().toISOString()
    }
  ])

  const getIntentColor = (intent: string | null) => {
    switch (intent) {
      case 'agendar':
        return 'bg-green-100 text-green-800'
      case 'precios':
        return 'bg-blue-100 text-blue-800'
      case 'faq':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDirectionIcon = (direction: string, sender: string) => {
    if (direction === 'in') {
      return <User className="h-4 w-4 text-blue-600" />
    } else {
      return <Bot className="h-4 w-4 text-green-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Inbox en Vivo</h1>
          </div>
          <p className="text-gray-600">
            Mensajes en tiempo real con Supabase Realtime • {messages.length} mensajes
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
                <p className="text-gray-600">
                  Los mensajes aparecerán aquí cuando se envíen a través del simulador.
                </p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card key={message.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDirectionIcon(message.direction, message.sender)}
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {message.direction === 'in' ? 'Cliente' : 'Bot'}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString('es-ES')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.intent && (
                        <Badge className={getIntentColor(message.intent)}>
                          {message.intent}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {message.conversation_id.slice(-8)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {message.text || 'Sin contenido'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <Button asChild>
            <a href="/simulate">
              Probar Simulador
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

