'use client'
import { useState } from 'react'
import { Trash2, Lock, Eye, EyeOff, Bot, User, Phone } from 'lucide-react'
import Modal from '../components/Modal'

type Solicitud = {
  id: number
  numero_whatsapp: string
  nombre_contacto: string
  canal: string
  tipo_persona: string
  area_destino: string
  descripcion: string
  estado: string
  prioridad: string
  orientador: string
  fecha_hora: string
  bot_bloqueado: boolean
}

const estadoColor: Record<string, string> = {
  Nuevo:       'bg-blue-100 text-blue-700',
  'En Proceso':'bg-amber-100 text-amber-700',
  Escalado:    'bg-red-100 text-red-700',
  Resuelto:    'bg-green-100 text-green-700',
}
const prioridadColor: Record<string, string> = {
  ALTA:  'bg-red-100 text-red-700',
  MEDIA: 'bg-amber-100 text-amber-700',
  BAJA:  'bg-gray-100 text-gray-600',
}

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

export default function SolicitudesClient({ initialSolicitudes }: { initialSolicitudes: Solicitud[] }) {
  const [solicitudes, setSolicitudes] = useState(initialSolicitudes)
  const [modal, setModal]             = useState(false)
  const [selected, setSelected]       = useState<Solicitud | null>(null)
  const [password, setPassword]       = useState('')
  const [showPwd, setShowPwd]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [search, setSearch]           = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtered = solicitudes.filter(s => {
    const matchSearch = (s.nombre_contacto || '').toLowerCase().includes(search.toLowerCase()) ||
                        (s.numero_whatsapp || '').includes(search)
    const matchEstado = filtroEstado === 'todos' || s.estado === filtroEstado
    return matchSearch && matchEstado
  })

  function abrirEliminar(s: Solicitud) {
    setSelected(s); setPassword(''); setError(''); setModal(true)
  }
  function cerrar() { setModal(false); setSelected(null); setError('') }

  async function desbloquear(s: Solicitud) {
    const res = await fetch(`/api/solicitudes/${s.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bot_bloqueado: false, estado: 'Nuevo' })
    })
    if (res.ok) {
      setSolicitudes(x => x.map(sol => sol.id === s.id ? { ...sol, bot_bloqueado: false, estado: 'Nuevo' } : sol))
    }
  }

  async function eliminar() {
    if (!password) { setError('Ingresa tu contraseña'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/solicitudes/${selected!.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error al eliminar'); return }
      setSolicitudes(x => x.filter(s => s.id !== selected!.id))
      cerrar()
    } finally { setLoading(false) }
  }

  return (
    <>
      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input
          className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por nombre o número…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          {['Nuevo','En Proceso','Escalado','Resuelto'].map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Contacto','Tipo','Área','Estado','Prioridad','Bot','Orientador','Fecha','WA','Acciones'].map(h =>
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="text-center py-10 text-gray-400 text-sm">Sin resultados</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-medium text-gray-900 text-xs">{s.nombre_contacto || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs capitalize">{s.tipo_persona || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.area_destino || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[s.estado] ?? 'bg-gray-100 text-gray-600'}`}>{s.estado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadColor[s.prioridad] ?? 'bg-gray-100 text-gray-600'}`}>{s.prioridad}</span>
                  </td>
                  <td className="px-4 py-3">
                    {s.bot_bloqueado ? (
                      <button onClick={() => desbloquear(s)} title="Click para reactivar bot"
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded-full transition-colors">
                        <User className="w-3 h-3" /> Humano
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                        <Bot className="w-3 h-3" /> Bot activo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.orientador || '—'}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {s.fecha_hora ? new Date(s.fecha_hora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {s.numero_whatsapp && (
                      <a href={`https://wa.me/${s.numero_whatsapp}`} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition-colors">
                        <Phone className="w-3 h-3" /> Abrir
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => abrirEliminar(s)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Eliminar solicitud">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} de {solicitudes.length} registros</div>
      </div>

      {/* Modal eliminar con contraseña */}
      <Modal open={modal} onClose={cerrar} title="Eliminar solicitud" size="sm">
        <div className="space-y-4">
          {selected && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <div className="font-semibold text-gray-800">{selected.nombre_contacto || 'Sin nombre'}</div>
              <div className="text-gray-500 text-xs mt-0.5">{selected.numero_whatsapp} · {selected.tipo_persona} · {selected.estado}</div>
            </div>
          )}
          <p className="text-sm text-gray-600">Esta acción eliminará permanentemente la solicitud del bot. No se puede deshacer.</p>

          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">Confirma tu contraseña para eliminar</span>
            </div>
            <div className="relative">
              <input
                className={inp + ' pr-10'}
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && eliminar()}
                placeholder="Tu contraseña de acceso"
                autoFocus
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={cerrar}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={eliminar} disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              {loading ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
