'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Target, TrendingUp, Star, DollarSign } from 'lucide-react'

type NBORecommendation = {
  service_id: string
  service_name: string
  price: number
  description: string
  confidence: number
  reason: string
}

type NBOContext = {
  intent: string
  conversation_id: string
  message_count: number
}

type NBOResponse = {
  recommendations: NBORecommendation[]
  context: NBOContext
  latency_ms: number
}

export default function NBOPage() {
  const [contactName, setContactName] = useState('')
  const [currentIntent, setCurrentIntent] = useState('')
  const [conversationId, setConversationId] = useState('')
  const [nboResponse, setNboResponse] = useState<NBOResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handleGetRecommendations = async () => {
    if (!contactName.trim() || !currentIntent.trim() || !conversationId.trim()) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/nbo/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          contact_name: contactName,
          current_intent: currentIntent,
          message_history: []
        }),
      })

      const data = await response.json()
      setNboResponse(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedback = async (serviceId: string, action: string) => {
    if (!nboResponse) return

    try {
      await fetch('http://localhost:8000/nbo/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendation_id: serviceId,
          conversation_id: nboResponse.context.conversation_id,
          action: action,
          feedback_score: action === 'booked' ? 5 : action === 'clicked' ? 3 : 1
        }),
      })
      
      console.log(`Feedback registrado: ${action} para ${serviceId}`)
    } catch (error) {
      console.error('Error sending feedback:', error)
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-blue-600'
    if (confidence >= 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Next-Best-Offer (NBO)</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistema de recomendaciones inteligentes que sugiere servicios y promociones basándose en el contexto de la conversación.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de NBO */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Solicitar Recomendaciones
                </CardTitle>
                <CardDescription>
                  Simula una conversación y obtén recomendaciones personalizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Ej: Carla, María, Ana..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID de Conversación
                    </label>
                    <input
                      type="text"
                      value={conversationId}
                      onChange={(e) => setConversationId(e.target.value)}
                      placeholder="Ej: conv-001, demo-123..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intención Actual
                    </label>
                    <select
                      value={currentIntent}
                      onChange={(e) => setCurrentIntent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Seleccionar intención...</option>
                      <option value="precios">Precios</option>
                      <option value="agendar">Agendar</option>
                      <option value="faq">FAQ</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleGetRecommendations} 
                    disabled={loading || !contactName.trim() || !currentIntent.trim() || !conversationId.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Obteniendo Recomendaciones...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Obtener Recomendaciones
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contexto */}
            {nboResponse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Contexto de la Conversación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Intención:</span>
                      <Badge className={getIntentColor(nboResponse.context.intent)}>
                        {nboResponse.context.intent}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Conversación ID:</span>
                      <span className="text-sm text-gray-900">{nboResponse.context.conversation_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Mensajes:</span>
                      <span className="text-sm text-gray-900">{nboResponse.context.message_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Latencia:</span>
                      <span className="text-sm text-gray-900">{nboResponse.latency_ms}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recomendaciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recomendaciones</h2>
              {nboResponse && (
                <Badge variant="outline">{nboResponse.recommendations.length} servicios</Badge>
              )}
            </div>

            {!nboResponse ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recomendaciones</h3>
                  <p className="text-gray-600">
                    Completa el formulario y solicita recomendaciones para ver los resultados.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {nboResponse.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Star className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-semibold">
                              {rec.service_name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                ${rec.price.toLocaleString()}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                                {Math.round(rec.confidence * 100)}% confianza
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">{rec.description}</p>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Razón:</span> {rec.reason}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleFeedback(rec.service_id, 'clicked')}
                            className="flex-1"
                          >
                            Ver Detalles
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleFeedback(rec.service_id, 'booked')}
                            className="flex-1"
                          >
                            Agendar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleFeedback(rec.service_id, 'rejected')}
                          >
                            No Interesa
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        {nboResponse && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Análisis de Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{nboResponse.recommendations.length}</div>
                  <div className="text-sm text-gray-600">Total Recomendaciones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${Math.round(nboResponse.recommendations.reduce((acc, r) => acc + r.price, 0) / nboResponse.recommendations.length).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Precio Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(nboResponse.recommendations.reduce((acc, r) => acc + r.confidence, 0) / nboResponse.recommendations.length * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Confianza Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{nboResponse.latency_ms}ms</div>
                  <div className="text-sm text-gray-600">Tiempo de Respuesta</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
