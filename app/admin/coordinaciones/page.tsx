import { query } from '@/lib/db'
import { Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Coordinacion = {
  id: number
  codigo: string
  nombre: string
  tipo: string
  coordinador: string
  email: string
  whatsapp: string
  horario: string
  descripcion: string
  activo: boolean
}

async function getCoordinaciones() {
  try {
    const data = await query<Coordinacion>(`
      SELECT id, codigo, nombre, tipo, coordinador, email, whatsapp, horario, descripcion, activo
      FROM coordinaciones_liceo
      ORDER BY tipo, nombre
    `)
    return { data, isDemo: false }
  } catch {
    return { data: [], isDemo: true }
  }
}

const tipoColor: Record<string, string> = {
  academica:      'bg-blue-100 text-blue-700',
  administrativa: 'bg-violet-100 text-violet-700',
}

export default async function CoordinacionesPage() {
  const { data, isDemo } = await getCoordinaciones()

  const academicas      = data.filter((c) => c.tipo === 'academica')
  const administrativas = data.filter((c) => c.tipo === 'administrativa')

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Coordinaciones</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {data.length} áreas registradas
          {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
        </p>
      </div>

      {/* Académicas */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Coordinaciones Académicas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {academicas.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.codigo}</span>
                <h3 className="font-bold text-gray-900 text-sm mt-1">{c.nombre}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tipoColor[c.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                {c.tipo}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{c.descripcion}</p>
            <div className="space-y-1 text-xs text-gray-500">
              {c.coordinador && <div><span className="font-medium text-gray-700">Coordinador:</span> {c.coordinador}</div>}
              {c.email       && <div><span className="font-medium text-gray-700">Email:</span> {c.email}</div>}
              {c.horario     && <div><span className="font-medium text-gray-700">Horario:</span> {c.horario}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Administrativas */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Áreas Administrativas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {administrativas.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.codigo}</span>
                <h3 className="font-bold text-gray-900 text-sm mt-1">{c.nombre}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tipoColor[c.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                {c.tipo}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{c.descripcion}</p>
            <div className="space-y-1 text-xs text-gray-500">
              {c.coordinador && <div><span className="font-medium text-gray-700">Responsable:</span> {c.coordinador}</div>}
              {c.email       && <div><span className="font-medium text-gray-700">Email:</span> {c.email}</div>}
              {c.horario     && <div><span className="font-medium text-gray-700">Horario:</span> {c.horario}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
