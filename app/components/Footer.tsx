import { GraduationCap, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const nav = {
  Institución: ['Quiénes somos', 'Misión y visión', 'Directivos', 'Historia'],
  Niveles: ['Primaria', 'Secundaria', 'Preparatoria', 'Actividades'],
  Servicios: ['Transporte', 'Comedor', 'Psicología', 'Biblioteca'],
  Legal: ['Aviso de privacidad', 'Reglamento escolar', 'Términos de uso'],
}

const social = [
  { Icon: Facebook, label: 'Facebook', href: '#' },
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Youtube, label: 'YouTube', href: '#' },
  { Icon: Twitter, label: 'Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-base">Instituto San Ángel</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Educación de excelencia con valores humanos desde 1993.
              Incorporada a la SEP · RVOE clave 09PBH0001X.
            </p>
            <div className="flex gap-3">
              {social.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(nav).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-white text-sm mb-4">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Instituto San Ángel. Todos los derechos reservados.</p>
          <p className="text-gray-600">
            Diseñado por{' '}
            <span className="text-gray-500 font-medium">Black Sheep Agencia</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
