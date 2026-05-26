import { Rocket, University, BarChart3, Microscope, Cpu, BookOpen, ArrowRight } from 'lucide-react'

const bachilleratos = [
  {
    icon: Microscope,
    title: 'Ciencias Naturales y Salud',
    desc: 'Enfoque en biología, química y física para acceder a carreras de medicina, ingeniería y ciencias.',
    tag: 'STEM',
    tagColor: 'bg-green-100 text-green-700',
  },
  {
    icon: BarChart3,
    title: 'Económico-Administrativo',
    desc: 'Matemáticas financieras, economía y administración para negocios, contaduría y derecho.',
    tag: 'Negocios',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Cpu,
    title: 'Tecnología e Informática',
    desc: 'Programación avanzada, redes, inteligencia artificial y desarrollo de software.',
    tag: 'Tech',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    icon: BookOpen,
    title: 'Humanidades y Comunicación',
    desc: 'Filosofía, sociología, literatura y comunicación para periodismo, diseño y artes.',
    tag: 'Humanidades',
    tagColor: 'bg-amber-100 text-amber-700',
  },
]

const universidades = [
  'UNAM', 'IPN', 'UAM', 'Tec de Monterrey',
  'Iberoamericana', 'UIA', 'ITAM', 'Anahuac',
]

export default function Preparatoria() {
  return (
    <section id="preparatoria" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full mb-4">
              Nivel Medio Superior · 1° a 3° año
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
              Preparatoria{' '}
              <span className="text-violet-700">— Tu despegue universitario</span>
            </h2>
          </div>
          <p className="text-gray-500 lg:max-w-xs leading-relaxed">
            Edad: 15 a 18 años. Sistema escolarizado SEP-UNAM incorporado. 95% de
            nuestros egresados ingresan a universidades de su primera opción.
          </p>
        </div>

        {/* Bachilleratos */}
        <div className="grid sm:grid-cols-2 gap-5 mb-14">
          {bachilleratos.map(({ icon: Icon, title, desc, tag, tagColor }) => (
            <div
              key={title}
              className="group bg-gray-50 hover:bg-violet-600 rounded-2xl p-7 transition-all duration-300 border border-gray-100 hover:border-violet-600 hover:shadow-lg hover:shadow-violet-200"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-8 h-8 text-violet-600 group-hover:text-violet-200 transition-colors" />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${tagColor} group-hover:bg-white/20 group-hover:text-white`}
                >
                  {tag}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-white text-lg mb-2 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 group-hover:text-violet-100 leading-relaxed transition-colors">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Universidad ingreso */}
          <div className="lg:col-span-2 bg-gradient-to-br from-violet-900 to-indigo-900 rounded-3xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <University className="w-6 h-6 text-violet-300" />
              <h3 className="text-xl font-bold">Egresados en las mejores universidades</h3>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              {universidades.map((u) => (
                <span
                  key={u}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors cursor-default"
                >
                  {u}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              {[
                { value: '95%', label: 'Admitidos en 1ª opción' },
                { value: '4.2', label: 'Promedio de egreso' },
                { value: '15+', label: 'Convenios universitarios' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-black text-amber-400">{value}</div>
                  <div className="text-xs text-violet-300 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Extra */}
          <div className="space-y-5">
            <div className="bg-violet-50 rounded-2xl p-6">
              <Rocket className="w-6 h-6 text-violet-600 mb-3" />
              <h4 className="font-bold text-gray-900 mb-2">Programa de examen de admisión</h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                Cursos intensivos de COMIPEMS/EXANI-I incluidos en la colegiatura,
                con simulacros mensuales desde 2° año.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h4 className="font-bold text-gray-900 mb-4">Servicios adicionales</h4>
              <ul className="space-y-2">
                {[
                  'Servicio de psicología escolar',
                  'Intercambios internacionales',
                  'Bolsa de trabajo y prácticas',
                  'Plataforma e-learning 24/7',
                  'Titulación por promedio',
                ].map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                    <ArrowRight className="w-4 h-4 text-violet-500 shrink-0" />
                    {s}
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
