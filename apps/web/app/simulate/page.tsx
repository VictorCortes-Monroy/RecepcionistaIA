'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, Bot, User, Clock, Zap } from 'lucide-react'

type SimulationResult = {
  conversation_id: string
  intent: string
  response: string
  latency_ms: number
  error?: string
}

export default function SimulatePage() {
  const [contactName, setContactName] = useState('')
  const [message, setMessage] = useState('')
  const [results, setResults] = useState<SimulationResult[]>([])
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim() || !message.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/sim/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contact_name: contactName,
          text: message,
        }),
      })

      const result = await response.json()
      setResults(prev => [result, ...prev])
      setMessage('') // Limpiar solo el mensaje, mantener el nombre
    } catch (error) {
      console.error('Error:', error)
      setResults(prev => [{
        conversation_id: 'error',
        intent: 'error',
        response: 'Error al enviar mensaje',
        latency_ms: 0,
        error: 'Connection failed'
      }, ...prev])
    } finally {
      setLoading(false)
    }
  }

  const runDemo = async () => {
    setDemoLoading(true)
    try {
      const response = await fetch('http://localhost:8000/simulate')
      const data = await response.json()
      setResults(prev => [...data.results, ...prev])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setDemoLoading(false)
    }
  }

  const getIntentColor = (intent: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Simulador de Mensajes</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Prueba el sistema de IA conversacional de AURA Receptionist. Envía mensajes y ve cómo el bot responde en tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Simulación */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Mensaje
                </CardTitle>
                <CardDescription>
                  Simula un mensaje de un cliente y ve la respuesta del bot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ej: Carla, María, Ana..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ej: ¿Cuánto cuesta la depilación de axilas?"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={loading || !contactName.trim() || !message.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Demo Rápido */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Demo Rápido
                </CardTitle>
                <CardDescription>
                  Ejecuta una simulación completa con múltiples mensajes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={runDemo} 
                  disabled={demoLoading}
                  variant="outline"
                  className="w-full"
                >
                  {demoLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Ejecutando Demo...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Ejecutar Demo Completo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Resultados</h2>
              <Badge variant="outline">{results.length} mensajes</Badge>
            </div>

            {results.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados</h3>
                  <p className="text-gray-600">
                    Envía un mensaje o ejecuta el demo para ver los resultados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bot className="h-5 w-5 text-green-600" />
                          <div>
                            <CardTitle className="text-sm font-medium">
                              Respuesta del Bot
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {result.latency_ms}ms
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.intent && (
                            <Badge className={getIntentColor(result.intent)}>
                              {result.intent}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {result.conversation_id.slice(-8)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 whitespace-pre-wrap">
                          {result.response}
                        </p>
                        {result.error && (
                          <p className="text-red-600 text-sm mt-2">
                            ⚠️ {result.error}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        {results.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estadísticas de la Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                  <div className="text-sm text-gray-600">Total Mensajes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.filter(r => r.intent === 'agendar').length}
                  </div>
                  <div className="text-sm text-gray-600">Agendamientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.filter(r => r.intent === 'precios').length}
                  </div>
                  <div className="text-sm text-gray-600">Consultas de Precios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(results.reduce((acc, r) => acc + r.latency_ms, 0) / results.length)}ms
                  </div>
                  <div className="text-sm text-gray-600">Latencia Promedio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
