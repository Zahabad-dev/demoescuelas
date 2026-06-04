import { query } from '@/lib/db'
import { CreditCard, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'
import PagosFiltros from './PagosFiltros'

export const dynamic = 'force-dynamic'

async function getPagos() {
  try {
    const pagos = await query<{
      id: number; alumno_id: number; alumno_nombre: string; carrera: string
      semestre: number; whatsapp_alumno: string; correo: string
      nombre_padre: string; nombre_madre: string; whatsapp_tutor: string
      concepto: string; periodo: string; monto: number
      fecha_limite: string; fecha_pago: string | null
      estado: string; metodo_pago: string | null; notas: string | null
    }>(`
      SELECT
        p.id,
        a.id          AS alumno_id,
        a.nombre_completo AS alumno_nombre,
        a.carrera,
        a.semestre,
        a.numero_whatsapp AS whatsapp_alumno,
        a.correo,
        a.nombre_padre,
        a.nombre_madre,
        a.whatsapp_tutor,
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

export default async function PagosPage() {
  const { pagos, isDemo } = await getPagos()

  const stats = {
    pagados:   pagos.filter(p => p.estado === 'pagado').length,
    atrasados: pagos.filter(p => p.estado === 'atrasado').length,
    pendientes:pagos.filter(p => p.estado === 'pendiente').length,
    recaudado: pagos.filter(p => p.estado === 'pagado').reduce((s, p) => s + Number(p.monto), 0),
  }

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pagos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagos.length} registros de colegiatura
            {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <DownloadButton href="/api/reportes/adeudos" label="Reporte Adeudos" />
          <DownloadButton href="/api/reportes/alumnos" label="Lista Completa" />
        </div>
      </div>

      {/* Stats */}
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

      {/* Tabla con filtros (client component) */}
      <PagosFiltros pagos={pagos} />
    </div>
  )
}
