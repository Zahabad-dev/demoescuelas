'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, CheckCircle, AlertTriangle, Clock, Phone, ChevronDown, RefreshCw } from 'lucide-react'

type Pago = {
  id: string
  alumno_nombre: string
  nivel: string
  grado: string
  grupo: string | null
  padre_nombre: string
  telefono: string | null
  whatsapp: string | null
  padre_email: string
  concepto: string
  periodo: string
  monto: number
  fecha_limite: string
  fecha_pago: string | null
  estado: 'pagado' | 'pendiente' | 'atrasado'
  metodo_pago: string | null
  notas: string | null
}

const estadoBadge = {
  pagado: {
    label: 'Pagado',
    classes: 'bg-green-100 text-green-700',
    icon: CheckCircle,
  },
  atrasado: {
    label: 'Atrasado',
    classes: 'bg-red-100 text-red-700',
    icon: AlertTriangle,
  },
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-amber-100 text-amber-700',
    icon: Clock,
  },
}

const nivelColor: Record<string, string> = {
  primaria: 'bg-green-100 text-green-700',
  secundaria: 'bg-blue-100 text-blue-700',
  preparatoria: 'bg-violet-100 text-violet-700',
}

export default function PagosClient({ pagos: initialPagos }: { pagos: Pago[] }) {
  const [pagos, setPagos] = useState(initialPagos)
  const [search, setSearch] = useState('')
  const [filterNivel, setFilterNivel] = useState('todos')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return pagos.filter((p) => {
      const matchSearch =
        !search ||
        p.alumno_nombre.toLowerCase().includes(search.toLowerCase()) ||
        p.padre_nombre.toLowerCase().includes(search.toLowerCase())
      const matchNivel = filterNivel === 'todos' || p.nivel === filterNivel
      const matchEstado = filterEstado === 'todos' || p.estado === filterEstado
      return matchSearch && matchNivel && matchEstado
    })
  }, [pagos, search, filterNivel, filterEstado])

  async function marcarPagado(id: string) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/pagos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: 'pagado',
          fecha_pago: new Date().toISOString().slice(0, 10),
          metodo_pago: 'efectivo',
        }),
      })
      if (res.ok) {
        setPagos((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, estado: 'pagado', fecha_pago: new Date().toISOString().slice(0, 10) }
              : p
          )
        )
      }
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar alumno o padre…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <select
              value={filterNivel}
              onChange={(e) => setFilterNivel(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="todos">Todos los niveles</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
              <option value="preparatoria">Preparatoria</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              <option value="todos">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="atrasado">Atrasado</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre/Tutor</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimiento</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              filtered.map((pago) => {
                const badge = estadoBadge[pago.estado]
                const BadgeIcon = badge.icon
                const isUpdating = updatingId === pago.id

                return (
                  <tr key={pago.id} className="hover:bg-gray-50 transition-colors">
                    {/* Alumno */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{pago.alumno_nombre}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${nivelColor[pago.nivel] ?? 'bg-gray-100 text-gray-600'}`}>
                          {pago.nivel}
                        </span>
                        <span className="text-gray-400 text-xs">{pago.grado}</span>
                      </div>
                    </td>

                    {/* Padre */}
                    <td className="px-5 py-4">
                      <div className="text-gray-700">{pago.padre_nombre}</div>
                      <a
                        href={`https://wa.me/${(pago.whatsapp ?? pago.telefono ?? '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        {pago.telefono ?? pago.whatsapp ?? '—'}
                      </a>
                    </td>

                    {/* Período */}
                    <td className="px-5 py-4 text-gray-600">{pago.periodo}</td>

                    {/* Monto */}
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      ${Number(pago.monto).toLocaleString('es-MX')}
                    </td>

                    {/* Vencimiento */}
                    <td className="px-5 py-4 text-gray-600">
                      {pago.fecha_pago
                        ? <span className="text-green-600">Pagado {pago.fecha_pago}</span>
                        : pago.fecha_limite}
                    </td>

                    {/* Estado */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.classes}`}>
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>

                    {/* Acción */}
                    <td className="px-5 py-4">
                      {pago.estado !== 'pagado' && (
                        <button
                          onClick={() => marcarPagado(pago.id)}
                          disabled={isUpdating}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          Marcar pagado
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
        Mostrando {filtered.length} de {pagos.length} registros
      </div>
    </div>
  )
}
