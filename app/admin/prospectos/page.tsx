import { query } from '@/lib/db'
import { UserSearch, TrendingUp } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'
import ProspectosClient from './ProspectosClient'

export const dynamic = 'force-dynamic'

type Prospecto = {
  id: number
  nombre_completo: string
  numero_whatsapp: string
  correo: string
  carrera_interes: string
  turno_preferido: string
  como_nos_conocio: string
  estado_prospecto: string
  fecha_contacto: string
  orientador: string
  notas: string
}

async function getProspectos() {
  try {
    const prospectos = await query<Prospecto>(`
      SELECT id, nombre_completo, numero_whatsapp, correo,
             carrera_interes, turno_preferido, como_nos_conocio,
             estado_prospecto, fecha_contacto, orientador, notas
      FROM prospectos_liceo
      ORDER BY fecha_contacto DESC
    `)
    return { prospectos, isDemo: false }
  } catch {
    return { prospectos: [], isDemo: true }
  }
}

export default async function ProspectosPage() {
  const { prospectos, isDemo } = await getProspectos()

  const byEstado: Record<string, number> = {}
  for (const p of prospectos) {
    byEstado[p.estado_prospecto] = (byEstado[p.estado_prospecto] ?? 0) + 1
  }

  const inscritos = byEstado['Inscrito'] ?? 0
  const tasa = prospectos.length > 0 ? Math.round((inscritos / prospectos.length) * 100) : 0

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Prospectos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {prospectos.length} prospectos — tasa de conversión: {tasa}%
            {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
          </p>
        </div>
        <DownloadButton href="/api/reportes/prospectos" label="Descargar Excel" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 text-blue-700 rounded-2xl p-5 border border-blue-100">
          <UserSearch className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{prospectos.length}</div>
          <div className="text-sm font-medium opacity-80">Total prospectos</div>
        </div>
        <div className="bg-green-50 text-green-700 rounded-2xl p-5 border border-green-100">
          <TrendingUp className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{inscritos}</div>
          <div className="text-sm font-medium opacity-80">Inscritos</div>
        </div>
        <div className="bg-amber-50 text-amber-700 rounded-2xl p-5 border border-amber-100 col-span-2 lg:col-span-1">
          <TrendingUp className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{tasa}%</div>
          <div className="text-sm font-medium opacity-80">Tasa conversión</div>
        </div>
      </div>

      <ProspectosClient initialProspectos={prospectos} />
    </div>
  )
}
