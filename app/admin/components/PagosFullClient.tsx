'use client'

import { useState, useMemo } from 'react'
import {
  Search, Filter, CheckCircle, AlertTriangle, Clock,
  Phone, ChevronDown, RefreshCw, Download, ChevronUp,
} from 'lucide-react'

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

const badge = {
  pagado:   { label: 'Pagado',   cls: 'bg-green-100 text-green-700',  Icon: CheckCircle   },
  atrasado: { label: 'Atrasado', cls: 'bg-red-100 text-red-700',      Icon: AlertTriangle },
  pendiente:{ label: 'Pendiente',cls: 'bg-amber-100 text-amber-700',  Icon: Clock         },
}
const nivelCls: Record<string, string> = {
  primaria:     'bg-green-100 text-green-700',
  secundaria:   'bg-blue-100 text-blue-700',
  preparatoria: 'bg-violet-100 text-violet-700',
}

type SortKey = 'alumno_nombre' | 'nivel' | 'periodo' | 'monto' | 'fecha_limite' | 'estado'

export default function PagosFullClient({ pagos: initial, isDemo }: { pagos: Pago[]; isDemo: boolean }) {
  const [pagos, setPagos]           = useState(initial)
  const [search, setSearch]         = useState('')
  const [filterNivel, setNivel]     = useState('todos')
  const [filterEstado, setEstado]   = useState('todos')
  const [filterPeriodo, setPeriodo] = useState('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [sortKey, setSortKey]       = useState<SortKey>('fecha_limite')
  const [sortAsc, setSortAsc]       = useState(false)

  // Períodos únicos
  const periodos = useMemo(() => {
    const set = new Set(pagos.map((p) => p.periodo))
    return ['todos', ...Array.from(set).sort((a, b) => b.localeCompare(a))]
  }, [pagos])

  const filtered = useMemo(() => {
    let list = pagos.filter((p) => {
      const q = search.toLowerCase()
      return (
        (!q || p.alumno_nombre.toLowerCase().includes(q) || p.padre_nombre.toLowerCase().includes(q)) &&
        (filterNivel   === 'todos' || p.nivel   === filterNivel) &&
        (filterEstado  === 'todos' || p.estado  === filterEstado) &&
        (filterPeriodo === 'todos' || p.periodo === filterPeriodo)
      )
    })
    list = [...list].sort((a, b) => {
      const va = a[sortKey] ?? ''
      const vb = b[sortKey] ?? ''
      return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
    return list
  }, [pagos, search, filterNivel, filterEstado, filterPeriodo, sortKey, sortAsc])

  const totals = useMemo(() => ({
    monto:    filtered.reduce((s, p) => s + Number(p.monto), 0),
    pagado:   filtered.filter((p) => p.estado === 'pagado').reduce((s, p) => s + Number(p.monto), 0),
    atrasado: filtered.filter((p) => p.estado === 'atrasado').reduce((s, p) => s + Number(p.monto), 0),
  }), [filtered])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k
      ? sortAsc ? <ChevronUp className="w-3 h-3 ml-1 inline" /> : <ChevronDown className="w-3 h-3 ml-1 inline" />
      : <ChevronDown className="w-3 h-3 ml-1 inline opacity-20" />

  async function marcarPagado(id: string) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/pagos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'pagado', fecha_pago: new Date().toISOString().slice(0, 10), metodo_pago: 'efectivo' }),
      })
      if (res.ok) {
        setPagos((prev) => prev.map((p) =>
          p.id === id ? { ...p, estado: 'pagado', fecha_pago: new Date().toISOString().slice(0, 10) } : p
        ))
      }
    } finally { setUpdatingId(null) }
  }

  function exportCSV() {
    const headers = ['Alumno','Nivel','Grado','Padre','Teléfono','Email','Período','Monto','F.Límite','F.Pago','Estado','Método']
    const rows = filtered.map((p) => [
      p.alumno_nombre, p.nivel, `${p.grado}${p.grupo ?? ''}`,
      p.padre_nombre, p.telefono ?? '', p.padre_email,
      p.periodo, p.monto, p.fecha_limite, p.fecha_pago ?? '',
      p.estado, p.metodo_pago ?? '',
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = `pagos-${filterPeriodo === 'todos' ? 'todos' : filterPeriodo}.csv`
    a.click()
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pl-12 lg:pl-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pagos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Supervisión completa de colegiaturas
            {isDemo && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                Modo demo
              </span>
            )}
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Quick-filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: 'Todos',     val: 'todos',    cls: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
          { label: 'Atrasados', val: 'atrasado', cls: 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' },
          { label: 'Pagados',   val: 'pagado',   cls: 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' },
          { label: 'Pendientes',val: 'pendiente',cls: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200' },
        ].map(({ label, val, cls }) => (
          <button
            key={val}
            onClick={() => setEstado(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cls} ${filterEstado === val ? 'ring-2 ring-offset-1 ring-current' : ''}`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-60">
              ({val === 'todos' ? pagos.length : pagos.filter((p) => p.estado === val).length})
            </span>
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Total filtrado',  val: `$${totals.monto.toLocaleString('es-MX')}`,    cls: 'text-gray-700' },
          { label: 'Cobrado',         val: `$${totals.pagado.toLocaleString('es-MX')}`,   cls: 'text-green-700' },
          { label: 'Por cobrar',      val: `$${totals.atrasado.toLocaleString('es-MX')}`, cls: 'text-red-700' },
        ].map(({ label, val, cls }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className={`text-lg font-black ${cls}`}>{val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
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
          <div className="flex flex-wrap gap-2">
            {/* Período */}
            <div className="relative">
              <select
                value={filterPeriodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                {periodos.map((p) => (
                  <option key={p} value={p}>{p === 'todos' ? 'Todos los períodos' : p}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
            {/* Nivel */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <select
                value={filterNivel}
                onChange={(e) => setNivel(e.target.value)}
                className="pl-8 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="todos">Todos los niveles</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="preparatoria">Preparatoria</option>
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
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('alumno_nombre')}>
                  Alumno <SortIcon k="alumno_nombre" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('nivel')}>
                  Nivel <SortIcon k="nivel" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre / Contacto</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('periodo')}>
                  Período <SortIcon k="periodo" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('monto')}>
                  Monto <SortIcon k="monto" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('fecha_limite')}>
                  Vencimiento <SortIcon k="fecha_limite" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => toggleSort('estado')}>
                  Estado <SortIcon k="estado" />
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center text-gray-400">
                    No hay registros con los filtros actuales
                  </td>
                </tr>
              ) : filtered.map((pago) => {
                const b = badge[pago.estado]
                const isUpd = updatingId === pago.id
                return (
                  <tr key={pago.id} className="hover:bg-gray-50/70 transition-colors group">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{pago.alumno_nombre}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${nivelCls[pago.nivel] ?? 'bg-gray-100 text-gray-600'}`}>
                        {pago.nivel}
                      </span>
                      <span className="text-gray-400 text-xs ml-1.5">{pago.grado}{pago.grupo}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-700 text-sm">{pago.padre_nombre}</div>
                      <a
                        href={`https://wa.me/${(pago.whatsapp ?? pago.telefono ?? '').replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-green-600 hover:underline mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        {pago.telefono ?? pago.whatsapp ?? '—'}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{pago.periodo}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">${Number(pago.monto).toLocaleString('es-MX')}</td>
                    <td className="px-5 py-3.5 text-sm">
                      {pago.fecha_pago
                        ? <span className="text-green-600">Pagado {pago.fecha_pago}</span>
                        : <span className={pago.estado === 'atrasado' ? 'text-red-600 font-medium' : 'text-gray-500'}>{pago.fecha_limite}</span>
                      }
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${b.cls}`}>
                        <b.Icon className="w-3 h-3" />
                        {b.label}
                      </span>
                      {pago.notas && (
                        <div className="text-xs text-gray-400 mt-1 italic">{pago.notas}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {pago.estado !== 'pagado' && (
                        <button
                          onClick={() => marcarPagado(pago.id)}
                          disabled={isUpd}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isUpd ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Marcar pagado
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {filtered.length} registro{filtered.length !== 1 ? 's' : ''} · {pagos.length} en total
        </div>
      </div>
    </div>
  )
}
