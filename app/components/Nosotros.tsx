import { Shield, Heart, Lightbulb, Globe } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Integridad',
    desc: 'Fomentamos la honestidad y la responsabilidad en cada acción de nuestra comunidad.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Heart,
    title: 'Respeto',
    desc: 'Cultivamos un ambiente de inclusión donde cada persona es valorada y escuchada.',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    desc: 'Integramos tecnología de punta y metodologías activas en el proceso de aprendizaje.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Globe,
    title: 'Visión global',
    desc: 'Preparamos ciudadanos del mundo con dominio del inglés y conciencia internacional.',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

export default function Nosotros() {
  return (
    <section id="nosotros" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
              ¿Quiénes somos?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6">
              Una institución con{' '}
              <span className="text-blue-700">propósito y tradición</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Fundado en 1993, el Instituto San Ángel ha acompañado a miles de familias en
              el desarrollo académico y humano de sus hijos. Nuestro modelo educativo
              combina la solidez pedagógica con la innovación tecnológica.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Contamos con tres niveles educativos en un campus moderno de 4 hectáreas,
              laboratorios equipados, biblioteca digital, canchas deportivas y espacios
              artísticos que enriquecen la experiencia escolar.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="text-center sm:text-left">
                <div className="text-4xl font-black text-blue-700">120+</div>
                <div className="text-sm text-gray-500 mt-1">Docentes certificados</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div className="text-center sm:text-left">
                <div className="text-4xl font-black text-blue-700">SEP</div>
                <div className="text-sm text-gray-500 mt-1">Incorporada y reconocida</div>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div className="text-center sm:text-left">
                <div className="text-4xl font-black text-blue-700">Bilingüe</div>
                <div className="text-sm text-gray-500 mt-1">Programa de inglés intensivo</div>
              </div>
            </div>
          </div>

          {/* Values grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
