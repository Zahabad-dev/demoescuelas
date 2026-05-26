'use client'

import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

const info = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Av. Insurgentes Sur 1234, Col. San Ángel, CDMX',
    color: 'text-rose-500',
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: '(55) 1234-5678 / (55) 8765-4321',
    color: 'text-green-500',
  },
  {
    icon: Mail,
    label: 'Correo',
    value: 'admisiones@institutosanangel.edu.mx',
    color: 'text-blue-500',
  },
  {
    icon: Clock,
    label: 'Horario de oficina',
    value: 'Lunes a Viernes 7:30 – 16:00 hrs.',
    color: 'text-amber-500',
  },
]

export default function Contacto() {
  return (
    <section id="contacto" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
              Contáctanos
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              Empieza el proceso de{' '}
              <span className="text-amber-500">inscripción</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Agenda una visita guiada sin costo y conoce nuestras instalaciones. Nuestro
              equipo de admisiones te asesorará para encontrar el nivel y modalidad
              que mejor se adapte a las necesidades de tu hijo.
            </p>

            <div className="space-y-5">
              {info.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                      {label}
                    </div>
                    <div className="text-gray-700 text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Solicita información</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    placeholder="Tus apellidos"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="(55) 0000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nivel de interés
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                  <option value="">Selecciona un nivel</option>
                  <option value="primaria">Primaria (1° – 6° grado)</option>
                  <option value="secundaria">Secundaria (1° – 3° grado)</option>
                  <option value="preparatoria">Preparatoria (1° – 3° año)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mensaje (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="¿Tienes alguna pregunta o comentario?"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow-md"
              >
                <Send className="w-4 h-4" />
                Enviar solicitud
              </button>
              <p className="text-xs text-gray-400 text-center">
                Nos comunicaremos contigo en menos de 24 horas hábiles.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
