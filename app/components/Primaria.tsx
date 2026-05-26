import { BookOpen, Music, Palette, Dumbbell, Globe2, Brain, CheckCircle2 } from 'lucide-react'

const materias = [
  'Español y Lectura',
  'Matemáticas',
  'Ciencias Naturales',
  'Historia y Geografía',
  'Inglés intensivo',
  'Educación Física',
  'Arte y Música',
  'Tecnología e Informática',
]

const actividades = [
  { icon: Music, label: 'Coro y banda', color: 'text-purple-600 bg-purple-50' },
  { icon: Palette, label: 'Taller de arte', color: 'text-pink-600 bg-pink-50' },
  { icon: Dumbbell, label: 'Deportes', color: 'text-green-600 bg-green-50' },
  { icon: Globe2, label: 'Club de inglés', color: 'text-blue-600 bg-blue-50' },
  { icon: Brain, label: 'Robótica', color: 'text-orange-600 bg-orange-50' },
  { icon: BookOpen, label: 'Club lector', color: 'text-teal-600 bg-teal-50' },
]

export default function Primaria() {
  return (
    <section id="primaria" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full mb-4">
              Nivel Básico · 1° a 6° grado
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Primaria{' '}
              <span className="text-green-600">
                — Bases sólidas
              </span>
            </h2>
          </div>
          <p className="text-gray-500 lg:max-w-sm leading-relaxed">
            Edad: 6 a 12 años. Horario 7:30 – 14:30 hrs. Turno matutino. Opción de
            servicio de comedor y actividades vespertinas hasta las 17:00 hrs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Nuestro enfoque pedagógico</h3>
            <p className="text-green-100 leading-relaxed mb-6">
              Aplicamos el modelo de Aprendizaje Basado en Proyectos (ABP) para que los
              niños desarrollen habilidades del siglo XXI desde temprana edad. Cada
              semestre los alumnos presentan un proyecto interdisciplinario ante la
              comunidad escolar.
            </p>
            <p className="text-green-100 leading-relaxed mb-8">
              Grupos reducidos de máximo 25 alumnos garantizan atención personalizada.
              Cada docente está acompañado por un asistente en los primeros tres grados.
            </p>
            {/* Materias */}
            <div className="grid grid-cols-2 gap-2">
              {materias.map((m) => (
                <div key={m} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-300 shrink-0" />
                  <span className="text-green-50">{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side info */}
          <div className="space-y-5">
            {/* Actividades */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Actividades extracurriculares</h4>
              <div className="grid grid-cols-2 gap-3">
                {actividades.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${color}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <h4 className="font-bold text-green-800 mb-4">Puntos destacados</h4>
              <ul className="space-y-3 text-sm text-green-700">
                {[
                  'Programa bilingüe desde 1° grado',
                  'Evaluación formativa continua',
                  'Programa contra el bullying',
                  'Viajes de estudio anuales',
                  'App de comunicación con padres',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
