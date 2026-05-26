import { Wifi, Utensils, Bus, Camera, TreePine, Beaker } from 'lucide-react'

const instalaciones = [
  {
    icon: Beaker,
    title: 'Laboratorios',
    desc: '3 laboratorios equipados de física, química y biología con ventilación y seguridad certificada.',
    bg: 'bg-blue-600',
  },
  {
    icon: Wifi,
    title: 'Tecnología',
    desc: 'WiFi en todo el campus, 2 salas de cómputo con 40 equipos cada una y pizarrones interactivos.',
    bg: 'bg-violet-600',
  },
  {
    icon: TreePine,
    title: 'Áreas verdes',
    desc: '4 hectáreas de jardines, canchas de fútbol, básquetbol, volibol y pista atlética de 400 m.',
    bg: 'bg-green-600',
  },
  {
    icon: Utensils,
    title: 'Comedor',
    desc: 'Menú balanceado supervisado por nutriólogo. Opción vegana y alergias alimentarias atendidas.',
    bg: 'bg-amber-600',
  },
  {
    icon: Bus,
    title: 'Transporte escolar',
    desc: 'Rutas de transporte con GPS en tiempo real y vigilancia. Cubierta toda la zona metropolitana.',
    bg: 'bg-rose-600',
  },
  {
    icon: Camera,
    title: 'Seguridad',
    desc: 'CCTV en todas las instalaciones, control de acceso biométrico y protocolos de emergencia.',
    bg: 'bg-slate-600',
  },
]

export default function Instalaciones() {
  return (
    <section id="instalaciones" className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-white/10 text-gray-300 text-sm font-semibold rounded-full mb-4">
            Infraestructura
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
            Instalaciones diseñadas para{' '}
            <span className="text-amber-400">el aprendizaje</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Nuestro campus cuenta con todo lo necesario para ofrecer una experiencia
            educativa completa, segura y estimulante.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {instalaciones.map(({ icon: Icon, title, desc, bg }) => (
            <div
              key={title}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-7 transition-all duration-200"
            >
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
