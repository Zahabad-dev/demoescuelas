import { query } from '@/lib/db'
import { MessageSquare } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'

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

  const escaladas = solicitudes.filter((s) => s.estado === 'Escalado').length
  const nuevas    = solicitudes.filter((s) => s.estado === 'Nuevo').length
  const resueltas = solicitudes.filter((s) => s.estado === 'Resuelto').length

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
          { label: 'Total',     value: solicitudes.length, color: 'bg-blue-50   text-blue-700'   },
          { label: 'Nuevas',    value: nuevas,             color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Escaladas', value: escaladas,          color: 'bg-red-50    text-red-700'    },
          { label: 'Resueltas', value: resueltas,          color: 'bg-green-50  text-green-700'  },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 border border-current/10 ${color}`}>
            <div className="text-3xl font-black">{value}</div>
            <div className="text-sm font-medium opacity-80 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Todas las solicitudes</span>
        </div>

        {solicitudes.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No hay solicitudes registradas aún.<br />
            <span className="text-xs">Se crean automáticamente cuando alguien escribe al bot.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bot</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orientador</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {solicitudes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 font-medium text-gray-900 text-xs">{s.nombre_contacto || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize">{s.tipo_persona || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.area_destino || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[s.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadColor[s.prioridad] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.prioridad}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${s.bot_bloqueado ? 'text-red-500' : 'text-green-600'}`}>
                        {s.bot_bloqueado ? 'Humano' : 'Bot activo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.orientador || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {s.fecha_hora ? new Date(s.fecha_hora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {s.numero_whatsapp && (
                        <a href={`https://wa.me/${s.numero_whatsapp}`} target="_blank" rel="noreferrer"
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full hover:bg-green-200 transition-colors">
                          Abrir
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{solicitudes.length} registros</div>
      </div>
    </div>
  )
}
