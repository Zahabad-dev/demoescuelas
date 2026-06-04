import { query } from '@/lib/db'
import { UserSearch, TrendingUp } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'

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

const estadoColor: Record<string, string> = {
  Nuevo:       'bg-blue-100 text-blue-700',
  Contactado:  'bg-amber-100 text-amber-700',
  Interesado:  'bg-violet-100 text-violet-700',
  'En proceso':'bg-orange-100 text-orange-700',
  Inscrito:    'bg-green-100 text-green-700',
  Descartado:  'bg-gray-100 text-gray-500',
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

  const inscritos  = byEstado['Inscrito']  ?? 0
  const tasa       = prospectos.length > 0 ? Math.round((inscritos / prospectos.length) * 100) : 0

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

      {/* Stats por estado */}
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

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <UserSearch className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Lista de prospectos</span>
        </div>

        {prospectos.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No hay prospectos registrados aún.<br />
            <span className="text-xs">Se registran automáticamente cuando alguien contacta por WhatsApp.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera interés</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orientador</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prospectos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.nombre_completo || '—'}</td>
                    <td className="px-5 py-3.5">
                      {p.numero_whatsapp ? (
                        <a href={`https://wa.me/${p.numero_whatsapp}`} target="_blank" rel="noreferrer"
                          className="text-green-600 hover:underline text-xs font-mono">
                          {p.numero_whatsapp}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.carrera_interes || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado_prospecto] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.estado_prospecto}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{p.orientador || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {p.fecha_contacto ? new Date(p.fecha_contacto).toLocaleDateString('es-MX') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{prospectos.length} registros</div>
      </div>
    </div>
  )
}
