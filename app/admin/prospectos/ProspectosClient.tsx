'use client'
import { useState } from 'react'
import { Pencil, Trash2, Save, X } from 'lucide-react'
import Modal from '../components/Modal'

type Prospecto = {
  id: number; nombre_completo: string; numero_whatsapp: string; correo: string
  carrera_interes: string; turno_preferido: string; como_nos_conocio: string
  estado_prospecto: string; fecha_contacto: string; orientador: string; notas: string
}

const ESTADOS   = ['Nuevo','Contactado','Interesado','En proceso','Inscrito','Descartado']
const CARRERAS  = ['Medicina General','Enfermería','Nutrición','Fisioterapia','Odontología','Laboratorio Clínico','Acupuntura','No definida']
const TURNOS    = ['Matutino','Vespertino','Mixto','No definido']
const estadoColor: Record<string,string> = {
  Nuevo:'bg-blue-100 text-blue-700', Contactado:'bg-amber-100 text-amber-700',
  Interesado:'bg-violet-100 text-violet-700', 'En proceso':'bg-orange-100 text-orange-700',
  Inscrito:'bg-green-100 text-green-700', Descartado:'bg-gray-100 text-gray-500',
}

const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
const sel = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>{children}</div>
}

export default function ProspectosClient({ initialProspectos }: { initialProspectos: Prospecto[] }) {
  const [prospectos, setProspectos] = useState(initialProspectos)
  const [modal, setModal]           = useState(false)
  const [selected, setSelected]     = useState<Prospecto | null>(null)
  const [form, setForm]             = useState<Partial<Prospecto>>({})
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [search, setSearch]         = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  const filtered = prospectos.filter(p => {
    const matchSearch = (p.nombre_completo || '').toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'todos' || p.estado_prospecto === filtroEstado
    return matchSearch && matchEstado
  })

  function abrir(p: Prospecto) {
    setSelected(p); setForm({ ...p }); setError(''); setModal(true)
  }
  function cerrar() { setModal(false); setSelected(null); setError('') }
  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function guardar() {
    setLoading(true); setError('')
    try {
      const res  = await fetch(`/api/prospectos/${selected!.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Error'); return }
      setProspectos(p => p.map(x => x.id === selected!.id ? { ...x, ...data.prospecto } : x))
      cerrar()
    } finally { setLoading(false) }
  }

  async function eliminar(p: Prospecto) {
    if (!confirm(`¿Eliminar a ${p.nombre_completo}?`)) return
    const res = await fetch(`/api/prospectos/${p.id}`, { method: 'DELETE' })
    if (!res.ok) { const d = await res.json(); alert(d.error); return }
    setProspectos(x => x.filter(pr => pr.id !== p.id))
  }

  return (
    <>
      <div className="flex gap-3 mb-5 flex-wrap">
        <input className="flex-1 min-w-48 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar prospecto…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">Todos</option>
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['Nombre','WhatsApp','Carrera interés','Estado','Orientador','Fecha','Acciones'].map(h =>
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400 text-sm">Sin resultados</td></tr>}
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{p.nombre_completo || '—'}</td>
                  <td className="px-5 py-3.5">
                    {p.numero_whatsapp
                      ? <a href={`https://wa.me/${p.numero_whatsapp}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-xs font-mono">{p.numero_whatsapp}</a>
                      : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.carrera_interes || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado_prospecto] ?? 'bg-gray-100 text-gray-600'}`}>{p.estado_prospecto}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{p.orientador || '—'}</td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{p.fecha_contacto ? new Date(p.fecha_contacto).toLocaleDateString('es-MX') : '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <button onClick={() => abrir(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => eliminar(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} de {prospectos.length} registros</div>
      </div>

      <Modal open={modal} onClose={cerrar} title={`Editar — ${selected?.nombre_completo || 'Prospecto'}`} size="lg">
        <div className="space-y-4">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Campo label="Nombre completo"><input className={inp} value={form.nombre_completo ?? ''} onChange={e => set('nombre_completo', e.target.value)} /></Campo></div>
            <Campo label="WhatsApp"><input className={inp} value={form.numero_whatsapp ?? ''} onChange={e => set('numero_whatsapp', e.target.value)} /></Campo>
            <Campo label="Correo"><input className={inp} type="email" value={form.correo ?? ''} onChange={e => set('correo', e.target.value)} /></Campo>
            <Campo label="Carrera de interés">
              <select className={sel} value={form.carrera_interes ?? ''} onChange={e => set('carrera_interes', e.target.value)}>
                {CARRERAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Campo>
            <Campo label="Turno preferido">
              <select className={sel} value={form.turno_preferido ?? ''} onChange={e => set('turno_preferido', e.target.value)}>
                {TURNOS.map(t => <option key={t}>{t}</option>)}
              </select>
            </Campo>
            <Campo label="Estado *">
              <select className={sel} value={form.estado_prospecto ?? ''} onChange={e => set('estado_prospecto', e.target.value)}>
                {ESTADOS.map(e => <option key={e}>{e}</option>)}
              </select>
            </Campo>
            <Campo label="Orientador"><input className={inp} value={form.orientador ?? ''} onChange={e => set('orientador', e.target.value)} /></Campo>
            <Campo label="Cómo nos conoció"><input className={inp} value={form.como_nos_conocio ?? ''} onChange={e => set('como_nos_conocio', e.target.value)} /></Campo>
            <div className="col-span-2"><Campo label="Notas"><textarea className={inp} rows={2} value={form.notas ?? ''} onChange={e => set('notas', e.target.value)} /></Campo></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={cerrar} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"><X className="w-4 h-4" />Cancelar</button>
            <button onClick={guardar} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"><Save className="w-4 h-4" />{loading ? 'Guardando…' : 'Guardar'}</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
