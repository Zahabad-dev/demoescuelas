import { Quote } from 'lucide-react'

const testimonios = [
  {
    name: 'Adriana Morales',
    role: 'Madre de familia · 3 hijos en el Instituto',
    text: 'Desde que mis hijos están en San Ángel noto la diferencia en su forma de pensar y resolver problemas. Los maestros realmente se preocupan por cada alumno.',
    avatar: 'AM',
    color: 'bg-blue-600',
  },
  {
    name: 'Carlos Reyes',
    role: 'Egresado Preparatoria · Hoy estudia Ingeniería en la UNAM',
    text: 'El programa de ciencias me dio una base que me puso por delante en la universidad. Entré con una preparación que muchos compañeros no tenían.',
    avatar: 'CR',
    color: 'bg-violet-600',
  },
  {
    name: 'Patricia López',
    role: 'Directora de Primaria · 12 años en la institución',
    text: 'Ver crecer a los niños año con año y saber que tenemos un impacto real en su vida es la mayor recompensa. Aquí trabajamos con vocación y amor.',
    avatar: 'PL',
    color: 'bg-emerald-600',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            Lo que dice nuestra comunidad
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonios.map(({ name, role, text, avatar, color }) => (
            <div
              key={name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 hover:shadow-md transition-shadow"
            >
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${color} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}
                >
                  {avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-xs text-gray-400">{role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
