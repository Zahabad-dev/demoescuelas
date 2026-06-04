import { query } from '@/lib/db'
import { CreditCard, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Pago = {
  id: number
  alumno_nombre: string
  carrera: string
  semestre: number
  whatsapp: string
  concepto: string
  periodo: string
  monto: number
  fecha_limite: string
  fecha_pago: string | null
  estado: string
  metodo_pago: string | null
  notas: string | null
}

async function getPagos() {
  try {
    const pagos = await query<Pago>(`
      SELECT
        p.id,
        a.nombre_completo AS alumno_nombre,
        a.carrera,
        a.semestre,
        a.numero_whatsapp AS whatsapp,
        p.concepto,
        p.periodo,
        p.monto,
        p.fecha_limite,
        p.fecha_pago,
        p.estado,
        p.metodo_pago,
        p.notas
      FROM pagos_liceo p
      JOIN alumnos_liceo a ON p.alumno_id = a.id
      ORDER BY
        CASE p.estado WHEN 'atrasado' THEN 1 WHEN 'pendiente' THEN 2 ELSE 3 END,
        p.periodo DESC
    `)
    return { pagos, isDemo: false }
  } catch {
    return { pagos: [], isDemo: true }
  }
}

const estadoColor: Record<string, string> = {
  pagado:   'bg-green-100 text-green-700',
  pendiente:'bg-amber-100 text-amber-700',
  atrasado: 'bg-red-100 text-red-700',
}

export default async function PagosPage() {
  const { pagos, isDemo } = await getPagos()

  const stats = {
    total:    pagos.length,
    pagados:  pagos.filter((p) => p.estado === 'pagado').length,
    atrasados:pagos.filter((p) => p.estado === 'atrasado').length,
    pendientes:pagos.filter((p) => p.estado === 'pendiente').length,
    recaudado:pagos.filter((p) => p.estado === 'pagado').reduce((s, p) => s + Number(p.monto), 0),
  }

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Pagos</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {pagos.length} registros de colegiatura
          {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Al corriente', value: stats.pagados,   icon: CheckCircle,   color: 'bg-green-50  text-green-700',  iconBg: 'bg-green-100'  },
          { label: 'Atrasados',    value: stats.atrasados, icon: AlertTriangle, color: 'bg-red-50    text-red-700',    iconBg: 'bg-red-100'    },
          { label: 'Pendientes',   value: stats.pendientes,icon: Clock,         color: 'bg-amber-50  text-amber-700',  iconBg: 'bg-amber-100'  },
          { label: 'Recaudado',    value: `$${stats.recaudado.toLocaleString('es-MX')}`, icon: CreditCard, color: 'bg-violet-50 text-violet-700', iconBg: 'bg-violet-100' },
        ].map(({ label, value, icon: Icon, color, iconBg }) => (
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
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Registro de pagos</span>
        </div>

        {pagos.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No hay pagos registrados.<br />
            <span className="text-xs">Agrega pagos desde pgweb o ejecuta el SQL de admin_usuarios.sql para crear la tabla pagos_liceo.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Periodo</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vence</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{p.alumno_nombre}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{p.carrera}</td>
                    <td className="px-5 py-3.5 text-gray-500">{p.periodo}</td>
                    <td className="px-5 py-3.5 font-semibold text-gray-900">${Number(p.monto).toLocaleString('es-MX')}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">{p.fecha_limite ? new Date(p.fecha_limite).toLocaleDateString('es-MX') : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoColor[p.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize">{p.metodo_pago || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{pagos.length} registros</div>
      </div>
    </div>
  )
}
