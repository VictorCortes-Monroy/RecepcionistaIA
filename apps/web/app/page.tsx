import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  BarChart3, 
  Users, 
  Settings, 
  Zap, 
  Shield,
  Bot,
  TrendingUp,
  Smartphone,
  Globe,
  MessageSquare
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AURA Receptionist</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                v1.0.0
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AURA Receptionist
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma SaaS de IA para clínicas estéticas. Convierte mensajes en reservas, 
            ventas e insights accionables con agentes de IA inteligentes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat-widget">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <MessageCircle className="mr-2 h-5 w-5" />
                Probar Chat Widget
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                <BarChart3 className="mr-2 h-5 w-5" />
                Ver Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>IA Conversacional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Agentes de IA que entienden contexto, aprenden de datos históricos y 
                adaptan ofertas en tiempo real.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Next-Best-Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Recomendaciones inteligentes en tiempo real con RAG, 
                maximizando conversiones y ventas.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Multi-Tenancy Seguro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Aislamiento completo por clínica con Row-Level Security, 
                auditoría completa y cumplimiento GDPR.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Chat Widget Integrable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Widget web personalizable, integración WhatsApp Cloud API 
                y chat en tiempo real con Supabase.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Analytics Avanzado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Dashboard completo con métricas de conversión, 
                análisis de intenciones y predicciones de ventas.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>Entrenamiento Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Carga de documentos y entrenamiento de IA en minutos, 
                no en días. Conocimiento específico de tu clínica.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Acceso Rápido a Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/chat-widget">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Chat Widget</h3>
                  <p className="text-sm text-gray-600">Interfaz de chat en tiempo real</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Dashboard</h3>
                  <p className="text-sm text-gray-600">Métricas y analytics completos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/simulate">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Bot className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Simulador</h3>
                  <p className="text-sm text-gray-600">Prueba el sistema de IA</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/nbo">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">NBO</h3>
                  <p className="text-sm text-gray-600">Next-Best-Offer</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/demo">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Demo</h3>
                  <p className="text-sm text-gray-600">Chat Widget Integrado</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/whatsapp">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">WhatsApp</h3>
                  <p className="text-sm text-gray-600">Integración Business API</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1,247</div>
            <div className="text-gray-600">Conversaciones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">89</div>
            <div className="text-gray-600">Reservas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">$2.45M</div>
            <div className="text-gray-600">Ingresos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">7.1%</div>
            <div className="text-gray-600">Conversión</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 AURA Receptionist. Plataforma de IA para clínicas estéticas.
          </p>
        </div>
      </div>
    </div>
  );
}

