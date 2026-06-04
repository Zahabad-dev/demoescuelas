import { query } from '@/lib/db'
import { Users, UserSearch, MessageSquare, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [alumnos, prospectos, solicitudes] = await Promise.all([
      query<{ total: string; activos: string }>(`
        SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE estado_academico = 'Activo')::text AS activos
        FROM alumnos_liceo
      `),
      query<{ total: string; nuevos: string; convertidos: string }>(`
        SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE estado_prospecto = 'Nuevo')::text AS nuevos,
          COUNT(*) FILTER (WHERE estado_prospecto = 'Inscrito')::text AS convertidos
        FROM prospectos_liceo
      `),
      query<{ total: string; nuevas: string; escaladas: string; resueltas: string }>(`
        SELECT
          COUNT(*)::text AS total,
          COUNT(*) FILTER (WHERE estado = 'Nuevo')::text AS nuevas,
          COUNT(*) FILTER (WHERE estado = 'Escalado')::text AS escaladas,
          COUNT(*) FILTER (WHERE estado = 'Resuelto')::text AS resueltas
        FROM solicitudes_liceo
      `),
    ])

    return {
      alumnos:     alumnos[0]    ?? { total: '0', activos: '0' },
      prospectos:  prospectos[0] ?? { total: '0', nuevos: '0', convertidos: '0' },
      solicitudes: solicitudes[0] ?? { total: '0', nuevas: '0', escaladas: '0', resueltas: '0' },
      isDemo: false,
    }
  } catch {
    return {
      alumnos:     { total: '—', activos: '—' },
      prospectos:  { total: '—', nuevos: '—', convertidos: '—' },
      solicitudes: { total: '—', nuevas: '—', escaladas: '—', resueltas: '—' },
      isDemo: true,
    }
  }
}

async function getUltimasSolicitudes() {
  try {
    return await query<{
      id: number; nombre_contacto: string; tipo_persona: string;
      area_destino: string; estado: string; prioridad: string; fecha_hora: string; canal: string
    }>(`
      SELECT id, nombre_contacto, tipo_persona, area_destino, estado, prioridad, fecha_hora, origen AS canal
      FROM solicitudes_liceo
      ORDER BY fecha_hora DESC
      LIMIT 8
    `)
  } catch { return [] }
}

const estadoColor: Record<string, string> = {
  Nuevo:      'bg-blue-100 text-blue-700',
  'En Proceso':'bg-amber-100 text-amber-700',
  Escalado:   'bg-red-100 text-red-700',
  Resuelto:   'bg-green-100 text-green-700',
}

const prioridadColor: Record<string, string> = {
  ALTA:  'bg-red-100 text-red-700',
  MEDIA: 'bg-amber-100 text-amber-700',
  BAJA:  'bg-gray-100 text-gray-600',
}

export default async function AdminPage() {
  const [{ alumnos, prospectos, solicitudes, isDemo }, ultimas] = await Promise.all([
    getStats(),
    getUltimasSolicitudes(),
  ])

  const cards = [
    { label: 'Alumnos activos',    value: alumnos.activos,       icon: Users,         color: 'bg-blue-50   text-blue-700',   iconBg: 'bg-blue-100'   },
    { label: 'Prospectos totales', value: prospectos.total,       icon: UserSearch,    color: 'bg-violet-50 text-violet-700', iconBg: 'bg-violet-100' },
    { label: 'Prospectos nuevos',  value: prospectos.nuevos,      icon: Clock,         color: 'bg-amber-50  text-amber-700',  iconBg: 'bg-amber-100'  },
    { label: 'Solicitudes nuevas', value: solicitudes.nuevas,     icon: MessageSquare, color: 'bg-indigo-50 text-indigo-700', iconBg: 'bg-indigo-100' },
    { label: 'Escaladas',          value: solicitudes.escaladas,  icon: AlertTriangle, color: 'bg-red-50    text-red-700',    iconBg: 'bg-red-100'    },
    { label: 'Resueltas',          value: solicitudes.resueltas,  icon: CheckCircle,   color: 'bg-green-50  text-green-700',  iconBg: 'bg-green-100'  },
  ]

  return (
    <div>
      <div className="mb-8 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Liceo de Ciencias de la Salud — Vista general
          {isDemo && (
            <span className="ml-3 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Sin conexión a BD
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, iconBg }) => (
          <div key={label} className={`rounded-2xl p-5 border border-current/10 ${color}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Últimas solicitudes del bot</span>
        </div>
        {ultimas.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-400 text-sm">Sin solicitudes registradas aún</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ultimas.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{s.nombre_contacto || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize">{s.tipo_persona || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-500">{s.area_destino || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[s.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${prioridadColor[s.prioridad] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.prioridad}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {s.fecha_hora ? new Date(s.fecha_hora).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
