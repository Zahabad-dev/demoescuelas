'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowDownUp, Phone, Mail, User } from 'lucide-react'

type Pago = {
  id: number
  alumno_id: number
  alumno_nombre: string
  carrera: string
  semestre: number
  whatsapp_alumno: string
  correo: string
  nombre_padre: string
  nombre_madre: string
  whatsapp_tutor: string
  concepto: string
  periodo: string
  monto: number
  fecha_limite: string
  fecha_pago: string | null
  estado: string
  metodo_pago: string | null
  notas: string | null
}

const estadoColor: Record<string, string> = {
  pagado:    'bg-green-100 text-green-700',
  pendiente: 'bg-amber-100 text-amber-700',
  atrasado:  'bg-red-100 text-red-700',
}

export default function PagosFiltros({ pagos }: { pagos: Pago[] }) {
  const [busqueda, setBusqueda]     = useState('')
  const [orden, setOrden]           = useState<'default' | 'mayor' | 'menor'>('default')
  const [contactoAbierto, setContactoAbierto] = useState<number | null>(null)

  const pagosFiltrados = useMemo(() => {
    let lista = [...pagos]

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(p =>
        p.alumno_nombre?.toLowerCase().includes(q) ||
        p.carrera?.toLowerCase().includes(q) ||
        p.periodo?.includes(q)
      )
    }

    if (orden === 'mayor') lista.sort((a, b) => Number(b.monto) - Number(a.monto))
    if (orden === 'menor') lista.sort((a, b) => Number(a.monto) - Number(b.monto))

    return lista
  }, [pagos, busqueda, orden])

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alumno, carrera o período..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownUp className="w-4 h-4 text-gray-400" />
          <select
            value={orden}
            onChange={e => setOrden(e.target.value as 'default' | 'mayor' | 'menor')}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="default">Orden original</option>
            <option value="mayor">Mayor adeudo primero</option>
            <option value="menor">Menor adeudo primero</option>
          </select>
        </div>
        <span className="text-xs text-gray-400">{pagosFiltrados.length} registros</span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vence</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pagosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No se encontraron registros
                  </td>
                </tr>
              ) : pagosFiltrados.map((p) => (
                <>
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.alumno_nombre}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{p.carrera}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.periodo}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">${Number(p.monto).toLocaleString('es-MX')}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {p.fecha_limite ? new Date(p.fecha_limite).toLocaleDateString('es-MX') : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize">{p.metodo_pago || '—'}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setContactoAbierto(contactoAbierto === p.id ? null : p.id)}
                        className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors font-medium"
                      >
                        <User className="w-3 h-3" />
                        Ver contacto
                      </button>
                    </td>
                  </tr>

                  {/* Panel de contacto expandible */}
                  {contactoAbierto === p.id && (
                    <tr key={`contacto-${p.id}`} className="bg-blue-50/50">
                      <td colSpan={8} className="px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Alumno */}
                          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Alumno</div>
                            <div className="font-semibold text-gray-900 text-sm mb-1">{p.alumno_nombre}</div>
                            <div className="text-xs text-gray-500 mb-2">{p.carrera} — Sem. {p.semestre}</div>
                            {p.whatsapp_alumno && (
                              <a href={`https://wa.me/${p.whatsapp_alumno}`} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <Phone className="w-3 h-3" /> {p.whatsapp_alumno}
                              </a>
                            )}
                            {p.correo && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Mail className="w-3 h-3" /> {p.correo}
                              </div>
                            )}
                          </div>

                          {/* Padre */}
                          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Padre / Tutor</div>
                            <div className="font-semibold text-gray-900 text-sm mb-1">{p.nombre_padre || '—'}</div>
                            {p.whatsapp_tutor && (
                              <a href={`https://wa.me/${p.whatsapp_tutor}`} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                                <Phone className="w-3 h-3" /> {p.whatsapp_tutor}
                              </a>
                            )}
                          </div>

                          {/* Madre */}
                          <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                            <div className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Madre</div>
                            <div className="font-semibold text-gray-900 text-sm mb-1">{p.nombre_madre || '—'}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {pagosFiltrados.length} de {pagos.length} registros
        </div>
      </div>
    </>
  )
}
