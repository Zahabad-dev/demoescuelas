'use client'
import { useState } from 'react'
import { Phone, Mail, Pencil, Trash2, Plus, Save, X } from 'lucide-react'
import Modal from '../components/Modal'

type Alumno = {
  id: number; nombre_completo: string; matricula: string; carrera: string
  semestre: number; turno: string; estado_academico: string; adeudo: number
  numero_whatsapp: string; correo: string; nombre_padre: string
  nombre_madre: string; whatsapp_tutor: string
}

const CARRERAS = ['Medicina General','Enfermería','Nutrición','Fisioterapia','Odontología','Laboratorio Clínico','Acupuntura']
const ESTADOS  = ['activo','baja','suspendido','egresado']
const TURNOS   = ['Matutino','Vespertino','Mixto']

const carreraColor: Record<string, string> = {
  'Medicina General':    'bg-red-100 text-red-700',
  'Enfermería':          'bg-blue-100 text-blue-700',
  'Nutrición':           'bg-green-100 text-green-700',
  'Fisioterapia':        'bg-amber-100 text-amber-700',
  'Odontología':         'bg-violet-100 text-violet-700',
  'Laboratorio Clínico': 'bg-cyan-100 text-cyan-700',
}

const EMPTY: Omit<Alumno, 'id'> = {
  nombre_completo:'', matricula:'', carrera:'Medicina General', semestre:1, turno:'Matutino',
  estado_academico:'activo', adeudo:0, numero_whatsapp:'', correo:'',
  nombre_padre:'', nombre_madre:'', whatsapp_tutor:''
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}

const input = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
const select = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"

export default function AlumnosClient({ initialAlumnos }: { initialAlumnos: Alumno[] }) {
  const [alumnos, setAlumnos]   = useState(initialAlumnos)
  const [modal, setModal]       = useState<'crear' | 'editar' | null>(null)
  const [selected, setSelected] = useState<Alumno | null>(null)
  const [form, setForm]         = useState<Omit<Alumno, 'id'>>(EMPTY)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  const filtered = alumnos.filter(a =>
    a.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
    a.matricula.toLowerCase().includes(search.toLowerCase()) ||
    a.carrera.toLowerCase().includes(search.toLowerCase())
  )

  function abrirCrear() {
    setForm(EMPTY); setError(''); setModal('crear')
  }

  function abrirEditar(a: Alumno) {
    setSelected(a)
    setForm({ nombre_completo: a.nombre_completo, matricula: a.matricula, carrera: a.carrera,
      semestre: a.semestre, turno: a.turno, estado_academico: a.estado_academico,
      adeudo: a.adeudo, numero_whatsapp: a.numero_whatsapp || '',
      correo: a.correo || '', nombre_padre: a.nombre_padre || '',
      nombre_madre: a.nombre_madre || '', whatsapp_tutor: a.whatsapp_tutor || '' })
    setError(''); setModal('editar')
  }

  function cerrar() { setModal(null); setSelected(null); setError('') }

  function set(k: string, v: unknown) { setForm(f => ({ ...f, [k]: v })) }

  async function guardar() {
    setLoading(true); setError('')
    try {
      const url    = modal === 'crear' ? '/api/alumnos' : `/api/alumnos/${selected!.id}`
      const method = modal === 'crear' ? 'POST' : 'PUT'
      const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data   = await res.json()
      if (!res.ok) { setError(data.error || 'Error'); return }

      if (modal === 'crear') {
        setAlumnos(a => [...a, data.alumno])
      } else {
        setAlumnos(a => a.map(x => x.id === selected!.id ? data.alumno : x))
      }
      cerrar()
    } finally { setLoading(false) }
  }

  async function eliminar(a: Alumno) {
    if (!confirm(`¿Eliminar a ${a.nombre_completo}? Esta acción no se puede deshacer.`)) return
    const res  = await fetch(`/api/alumnos/${a.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { alert(data.error); return }
    setAlumnos(x => x.filter(al => al.id !== a.id))
  }

  const FormularioAlumno = (
    <div className="space-y-4">
      {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Campo label="Nombre completo *">
            <input className={input} value={form.nombre_completo} onChange={e => set('nombre_completo', e.target.value)} placeholder="Nombre completo" />
          </Campo>
        </div>
        <Campo label="Matrícula *">
          <input className={input} value={form.matricula} onChange={e => set('matricula', e.target.value)} placeholder="2024-001" />
        </Campo>
        <Campo label="Semestre *">
          <input className={input} type="number" min={1} max={12} value={form.semestre} onChange={e => set('semestre', Number(e.target.value))} />
        </Campo>
        <Campo label="Carrera *">
          <select className={select} value={form.carrera} onChange={e => set('carrera', e.target.value)}>
            {CARRERAS.map(c => <option key={c}>{c}</option>)}
          </select>
        </Campo>
        <Campo label="Turno *">
          <select className={select} value={form.turno} onChange={e => set('turno', e.target.value)}>
            {TURNOS.map(t => <option key={t}>{t}</option>)}
          </select>
        </Campo>
        <Campo label="Estado académico *">
          <select className={select} value={form.estado_academico} onChange={e => set('estado_academico', e.target.value)}>
            {ESTADOS.map(e => <option key={e}>{e}</option>)}
          </select>
        </Campo>
        <Campo label="Adeudo ($)">
          <input className={input} type="number" min={0} step={0.01} value={form.adeudo} onChange={e => set('adeudo', Number(e.target.value))} />
        </Campo>
        <Campo label="WhatsApp alumno">
          <input className={input} value={form.numero_whatsapp} onChange={e => set('numero_whatsapp', e.target.value)} placeholder="527751000000" />
        </Campo>
        <div className="col-span-2">
          <Campo label="Correo">
            <input className={input} type="email" value={form.correo} onChange={e => set('correo', e.target.value)} placeholder="alumno@email.com" />
          </Campo>
        </div>
        <Campo label="Nombre padre">
          <input className={input} value={form.nombre_padre} onChange={e => set('nombre_padre', e.target.value)} />
        </Campo>
        <Campo label="Nombre madre">
          <input className={input} value={form.nombre_madre} onChange={e => set('nombre_madre', e.target.value)} />
        </Campo>
        <div className="col-span-2">
          <Campo label="WhatsApp tutor (para recordatorios)">
            <input className={input} value={form.whatsapp_tutor} onChange={e => set('whatsapp_tutor', e.target.value)} placeholder="527751000000" />
          </Campo>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={cerrar} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
          <X className="w-4 h-4" /> Cancelar
        </button>
        <button onClick={guardar} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Barra búsqueda + botón crear */}
      <div className="flex gap-3 mb-5">
        <input
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por nombre, matrícula o carrera…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <button onClick={abrirCrear} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Nuevo alumno
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sem.</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adeudo</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tutor</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-sm">Sin resultados</td></tr>
              )}
              {filtered.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/70">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <div>{a.nombre_completo}</div>
                    <div className="text-xs text-gray-400 font-mono">{a.matricula}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${carreraColor[a.carrera] ?? 'bg-gray-100 text-gray-600'}`}>{a.carrera}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{a.semestre}°</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.estado_academico === 'activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {a.estado_academico}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {Number(a.adeudo) > 0
                      ? <span className="text-red-600 font-semibold text-xs">${Number(a.adeudo).toLocaleString('es-MX')}</span>
                      : <span className="text-green-600 text-xs">Al corriente</span>}
                  </td>
                  <td className="px-4 py-3">
                    {a.numero_whatsapp
                      ? <a href={`https://wa.me/${a.numero_whatsapp}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                          <Phone className="w-3 h-3" />{a.numero_whatsapp}
                        </a>
                      : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {a.correo
                      ? <span className="inline-flex items-center gap-1 text-xs text-gray-500"><Mail className="w-3 h-3" />{a.correo}</span>
                      : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {a.whatsapp_tutor
                      ? <a href={`https://wa.me/${a.whatsapp_tutor}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                          <Phone className="w-3 h-3" />{a.whatsapp_tutor}
                        </a>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => abrirEditar(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-700" title="Editar">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminar(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{filtered.length} de {alumnos.length} registros</div>
      </div>

      <Modal open={modal === 'crear'} onClose={cerrar} title="Nuevo alumno" size="lg">{FormularioAlumno}</Modal>
      <Modal open={modal === 'editar'} onClose={cerrar} title={`Editar — ${selected?.nombre_completo}`} size="lg">{FormularioAlumno}</Modal>
    </>
  )
}
