'use client'
import { useState } from 'react'
import { Pencil, Save, X, Lock, Eye, EyeOff } from 'lucide-react'
import Modal from '../components/Modal'

type Pago = {
  id: number; alumno_id: number; alumno_nombre: string; carrera: string
  concepto: string; periodo: string; monto: number
  fecha_limite: string; fecha_pago: string | null
  estado: string; metodo_pago: string | null; notas: string | null
}

const ESTADOS    = ['pendiente','pagado','atrasado']
const METODOS    = ['efectivo','transferencia','tarjeta','cheque','otro']
const estadoColor: Record<string,string> = {
  pagado:   'bg-green-100 text-green-700',
  atrasado: 'bg-red-100 text-red-700',
  pendiente:'bg-amber-100 text-amber-700',
}

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
const sel = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>{children}</div>
}

export default function PagosEditClient({ pagos: initialPagos }: { pagos: Pago[] }) {
  const [pagos, setPagos]       = useState(initialPagos)
  const [modal, setModal]       = useState(false)
  const [selected, setSelected] = useState<Pago | null>(null)
  const [form, setForm]         = useState<Partial<Pago>>({})
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtered = pagos.filter(p => {
    const matchSearch = p.alumno_nombre.toLowerCase().includes(search.toLowerCase()) || p.concepto.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  function abrir(p: Pago) {
    setSelected(p)
    setForm({ estado: p.estado, metodo_pago: p.metodo_pago ?? '', fecha_pago: p.fecha_pago ?? '',
              monto: p.monto, concepto: p.concepto, periodo: p.periodo,
              fecha_limite: p.fecha_limite ?? '', notas: p.notas ?? '' })
    setPassword(''); setError(''); setModal(true)
  }

  function cerrar() { setModal(false); setSelected(null); setError('') }
  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function guardar() {
    if (!password) { setError('Debes confirmar tu contraseña para guardar cambios en pagos'); return }
    setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/pagos/${selected!.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al guardar'); return }
      setPagos(p => p.map(x => x.id === selected!.id ? { ...x, ...data.pago } : x))
      cerrar()
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar alumno o concepto…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha pago</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notas</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Editar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-sm">Sin resultados</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div>{p.alumno_nombre}</div>
                    <div className="text-xs text-gray-400">{p.carrera}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.concepto}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.periodo}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">${Number(p.monto).toLocaleString('es-MX')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>{p.estado}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.metodo_pago || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString('es-MX') : '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">{p.notas || '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => abrir(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700" title="Editar pago">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} de {pagos.length} registros</div>
      </div>

      <Modal open={modal} onClose={cerrar} title={`Editar pago — ${selected?.alumno_nombre}`} size="md">
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Campo label="Concepto">
                <input className={inp} value={form.concepto ?? ''} onChange={e => set('concepto', e.target.value)} />
              </Campo>
            </div>
            <Campo label="Período (YYYY-MM)">
              <input className={inp} value={form.periodo ?? ''} onChange={e => set('periodo', e.target.value)} placeholder="2026-06" />
            </Campo>
            <Campo label="Monto ($)">
              <input className={inp} type="number" min={0} step={0.01} value={form.monto ?? ''} onChange={e => set('monto', Number(e.target.value))} />
            </Campo>
            <Campo label="Estado *">
              <select className={sel} value={form.estado ?? ''} onChange={e => set('estado', e.target.value)}>
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </Campo>
            <Campo label="Método de pago">
              <select className={sel} value={form.metodo_pago ?? ''} onChange={e => set('metodo_pago', e.target.value)}>
                <option value="">— Sin método —</option>
                {METODOS.map(m => <option key={m}>{m}</option>)}
              </select>
            </Campo>
            <Campo label="Fecha límite">
              <input className={inp} type="date" value={form.fecha_limite ?? ''} onChange={e => set('fecha_limite', e.target.value)} />
            </Campo>
            <Campo label="Fecha de pago">
              <input className={inp} type="date" value={form.fecha_pago ?? ''} onChange={e => set('fecha_pago', e.target.value)} />
            </Campo>
            <div className="col-span-2">
              <Campo label="Notas">
                <textarea className={inp} rows={2} value={form.notas ?? ''} onChange={e => set('notas', e.target.value)} />
              </Campo>
            </div>
          </div>

          {/* Confirmación de contraseña */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">Confirma tu contraseña para guardar cambios en pagos</span>
            </div>
            <div className="relative">
              <input
                className={inp + ' pr-10'}
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu contraseña de acceso"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={cerrar} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button onClick={guardar} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> {loading ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
