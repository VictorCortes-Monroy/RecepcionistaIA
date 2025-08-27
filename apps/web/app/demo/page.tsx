"use client";

import ChatWidget from '@/components/ChatWidget';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Clínica Estética AURA</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Demo del Chat Widget</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenidos a AURA
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Centro especializado en tratamientos estéticos y depilación láser. 
            Ofrecemos servicios de alta calidad con tecnología de vanguardia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Agendar Cita
            </button>
            <button className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Servicios
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💅</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Depilación Láser</h3>
            <p className="text-gray-600 mb-4">
              Tratamientos efectivos y seguros para eliminar el vello no deseado 
              de forma permanente.
            </p>
            <div className="text-2xl font-bold text-purple-600">Desde $29.990</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tratamientos Faciales</h3>
            <p className="text-gray-600 mb-4">
              Limpiezas profundas, hidratación y tratamientos anti-edad 
              para una piel radiante.
            </p>
            <div className="text-2xl font-bold text-blue-600">Desde $45.000</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Consulta Gratuita</h3>
            <p className="text-gray-600 mb-4">
              Evaluación personalizada sin costo para determinar el mejor 
              tratamiento para ti.
            </p>
            <div className="text-2xl font-bold text-green-600">Gratis</div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir AURA?
              </h2>
              <p className="text-gray-600 mb-6">
                En AURA nos especializamos en tratamientos estéticos de alta calidad. 
                Nuestro equipo de profesionales certificados utiliza la tecnología más 
                avanzada para garantizar resultados excepcionales.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Equipo médico certificado</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Tecnología de vanguardia</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Resultados garantizados</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Atención personalizada</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Prueba nuestro Chat!
              </h3>
              <p className="text-gray-600 mb-6">
                Haz clic en el botón de chat en la esquina inferior derecha 
                para obtener información personalizada sobre nuestros servicios.
              </p>
              <div className="text-4xl mb-4">💬</div>
              <p className="text-sm text-gray-500">
                Nuestro asistente virtual está disponible 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-lg font-semibold text-purple-600">M</span>
              </div>
              <div>
                <h4 className="font-semibold">María González</h4>
                <p className="text-sm text-gray-500">Depilación Láser</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Excelente atención y resultados increíbles. El chat me ayudó a resolver 
              todas mis dudas antes de agendar mi cita."
            </p>
            <div className="flex text-yellow-400 mt-3">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-lg font-semibold text-blue-600">C</span>
              </div>
              <div>
                <h4 className="font-semibold">Carlos López</h4>
                <p className="text-sm text-gray-500">Tratamiento Facial</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Muy profesional y el servicio es de primera calidad. El asistente virtual 
              me dio información muy útil sobre los tratamientos."
            </p>
            <div className="flex text-yellow-400 mt-3">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Ubicación</h3>
              <p className="text-gray-600">Av. Providencia 1234<br />Santiago, Chile</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-600">+56 2 2345 6789</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">contacto@clinicaaura.cl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget 
        clinicId="demo-clinic-001"
        position="bottom-right"
        primaryColor="#8B5CF6"
        title="¡Hola! ¿En qué te puedo ayudar?"
        welcomeMessage="¡Bienvenido a AURA! Soy tu asistente virtual. ¿Te gustaría conocer nuestros servicios de depilación láser, tratamientos faciales o agendar una consulta gratuita?"
      />
    </div>
  );
}
