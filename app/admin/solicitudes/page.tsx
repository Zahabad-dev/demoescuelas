import { query } from '@/lib/db'
import { MessageSquare } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'
import SolicitudesClient from './SolicitudesClient'

export const dynamic = 'force-dynamic'

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

async function getSolicitudes() {
  try {
    const solicitudes = await query<Solicitud>(`
      SELECT id, numero_whatsapp, nombre_contacto, origen AS canal,
             tipo_persona, area_destino, descripcion,
             estado, prioridad, orientador, fecha_hora, bot_bloqueado
      FROM solicitudes_liceo
      ORDER BY
        CASE prioridad WHEN 'ALTA' THEN 1 WHEN 'MEDIA' THEN 2 ELSE 3 END,
        fecha_hora DESC
    `)
    return { solicitudes, isDemo: false }
  } catch {
    return { solicitudes: [], isDemo: true }
  }
}

export default async function SolicitudesPage() {
  const { solicitudes, isDemo } = await getSolicitudes()

  const escaladas = solicitudes.filter(s => s.estado === 'Escalado').length
  const nuevas    = solicitudes.filter(s => s.estado === 'Nuevo').length
  const resueltas = solicitudes.filter(s => s.estado === 'Resuelto').length
  const bloqueados = solicitudes.filter(s => s.bot_bloqueado).length

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Solicitudes del Bot</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Conversaciones registradas desde WhatsApp y otros canales
            {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
          </p>
        </div>
        <DownloadButton href="/api/reportes/solicitudes" label="Descargar Excel" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',        value: solicitudes.length, color: 'bg-blue-50   text-blue-700'   },
          { label: 'Nuevas',       value: nuevas,             color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Escaladas',    value: escaladas,          color: 'bg-red-50    text-red-700'    },
          { label: 'Con humano',   value: bloqueados,         color: 'bg-amber-50  text-amber-700'  },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 border border-current/10 ${color}`}>
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <SolicitudesClient initialSolicitudes={solicitudes} />
    </div>
  )
}
