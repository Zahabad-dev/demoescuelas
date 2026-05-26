'use client'

import { useState, useEffect } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Primaria', href: '#primaria' },
  { label: 'Secundaria', href: '#secundaria' },
  { label: 'Preparatoria', href: '#preparatoria' },
  { label: 'Instalaciones', href: '#instalaciones' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span
                className={`font-bold text-lg leading-none block transition-colors ${
                  scrolled ? 'text-blue-900' : 'text-white'
                }`}
              >
                Instituto San Ángel
              </span>
              <span
                className={`text-xs leading-none transition-colors ${
                  scrolled ? 'text-blue-500' : 'text-blue-200'
                }`}
              >
                Educación de Excelencia
              </span>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-blue-600 hover:bg-blue-50 ${
                    scrolled ? 'text-gray-700' : 'text-white hover:text-white hover:bg-white/20'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contacto"
                className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                Inscríbete
              </a>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/20'
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <ul className="px-4 py-3 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="block text-center px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Inscríbete
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
