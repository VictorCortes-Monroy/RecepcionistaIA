"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  MessageCircle, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Calendar,
  Activity,
  Target,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface DashboardMetrics {
  overview: {
    total_conversations: number;
    total_bookings: number;
    total_revenue: number;
    conversion_rate: number;
    avg_response_time: number;
    customer_satisfaction: number;
  };
  daily_stats: Array<{
    date: string;
    conversations: number;
    bookings: number;
    revenue: number;
  }>;
  top_services: Array<{
    name: string;
    bookings: number;
    revenue: number;
    conversion_rate: number;
  }>;
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setMetrics({
        overview: {
          total_conversations: 1247,
          total_bookings: 89,
          total_revenue: 2450000,
          conversion_rate: 7.1,
          avg_response_time: 2.3,
          customer_satisfaction: 4.8
        },
        daily_stats: [
          { date: '2024-08-20', conversations: 45, bookings: 3, revenue: 89000 },
          { date: '2024-08-21', conversations: 52, bookings: 4, revenue: 120000 },
          { date: '2024-08-22', conversations: 38, bookings: 2, revenue: 75000 },
          { date: '2024-08-23', conversations: 61, bookings: 5, revenue: 145000 },
          { date: '2024-08-24', conversations: 48, bookings: 3, revenue: 95000 },
          { date: '2024-08-25', conversations: 55, bookings: 4, revenue: 110000 },
          { date: '2024-08-26', conversations: 42, bookings: 3, revenue: 85000 }
        ],
        top_services: [
          { name: 'Depilación Láser Axilas', bookings: 25, revenue: 750000, conversion_rate: 8.2 },
          { name: 'Depilación Láser Completa', bookings: 18, revenue: 1620000, conversion_rate: 6.5 },
          { name: 'Consulta Gratuita', bookings: 32, revenue: 0, conversion_rate: 12.1 },
          { name: 'Limpieza Facial', bookings: 14, revenue: 280000, conversion_rate: 5.8 }
        ],
        recent_activity: [
          { type: 'booking', description: 'Nueva reserva: Depilación Axilas - María G.', timestamp: '2024-08-27T15:30:00Z', user: 'system' },
          { type: 'conversation', description: 'Conversación iniciada desde WhatsApp', timestamp: '2024-08-27T15:25:00Z', user: 'system' },
          { type: 'service', description: 'Servicio actualizado: Limpieza Facial', timestamp: '2024-08-27T15:20:00Z', user: 'admin@clinica.com' },
          { type: 'promotion', description: 'Promoción creada: Descuento 20%', timestamp: '2024-08-27T15:15:00Z', user: 'manager@clinica.com' }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen completo de la actividad de tu clínica</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversaciones</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.overview.total_conversations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.overview.total_bookings}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(metrics?.overview.total_revenue || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(metrics?.overview.conversion_rate || 0)}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2.1%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Métricas de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Tiempo de Respuesta Promedio</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{metrics?.overview.avg_response_time}s</span>
                        <ArrowDownRight className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Satisfacción del Cliente</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{metrics?.overview.customer_satisfaction}/5</span>
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sesiones Activas</span>
                      <Badge variant="default">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Transferencias a Humano</span>
                      <Badge variant="outline">8</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics?.recent_activity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className="w-2 h-2 rounded-full bg-purple-600 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Stats Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Actividad Diaria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics?.daily_stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{new Date(stat.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm">{stat.conversations} conv.</span>
                          <span className="text-sm">{stat.bookings} reservas</span>
                          <span className="text-sm font-medium">{formatCurrency(stat.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribución de Conversiones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">WhatsApp</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chat Widget</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">50%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Instagram</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/3 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">33%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Rendimiento por Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.top_services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-500">
                          {service.bookings} reservas • {formatPercentage(service.conversion_rate)} conversión
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(service.revenue)}</p>
                        <Badge variant={service.conversion_rate > 8 ? "default" : "secondary"}>
                          {formatPercentage(service.conversion_rate)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Historial de Actividad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === 'booking' ? 'bg-green-500' :
                        activity.type === 'conversation' ? 'bg-blue-500' :
                        activity.type === 'service' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {activity.type}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {activity.user}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
