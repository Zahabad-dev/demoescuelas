import { pool } from '@/lib/db'
import PagosClient from './components/PagosClient'
import { Users, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Stats = {
  total_alumnos: number
  pagados: number
  atrasados: number
  pendientes: number
  recaudado_mes: number
}

type Pago = {
  id: string
  alumno_nombre: string
  nivel: string
  grado: string
  padre_nombre: string
  telefono: string
  email: string
  concepto: string
  periodo: string
  monto: number
  fecha_limite: string
  fecha_pago: string | null
  estado: 'pagado' | 'pendiente' | 'atrasado'
  metodo_pago: string | null
}

// Mock data shown when DB is not configured
const mockPagos: Pago[] = [
  { id: '1', alumno_nombre: 'Sofía Ramírez Torres', nivel: 'primaria', grado: '3A', padre_nombre: 'Carlos Ramírez', telefono: '(55) 1111-2222', email: 'c.ramirez@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-08', estado: 'pagado', metodo_pago: 'transferencia' },
  { id: '2', alumno_nombre: 'Diego Morales Vega', nivel: 'secundaria', grado: '2B', padre_nombre: 'Ana Morales', telefono: '(55) 3333-4444', email: 'ana.morales@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null, estado: 'atrasado', metodo_pago: null },
  { id: '3', alumno_nombre: 'Valentina Cruz López', nivel: 'preparatoria', grado: '1C', padre_nombre: 'Roberto Cruz', telefono: '(55) 5555-6666', email: 'r.cruz@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: null, estado: 'pendiente', metodo_pago: null },
  { id: '4', alumno_nombre: 'Mateo Herrera Santos', nivel: 'primaria', grado: '5A', padre_nombre: 'Laura Herrera', telefono: '(55) 7777-8888', email: 'l.herrera@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-05', estado: 'pagado', metodo_pago: 'efectivo' },
  { id: '5', alumno_nombre: 'Isabella Jiménez Ruiz', nivel: 'secundaria', grado: '3A', padre_nombre: 'Miguel Jiménez', telefono: '(55) 9999-0000', email: 'm.jimenez@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null, estado: 'atrasado', metodo_pago: null },
  { id: '6', alumno_nombre: 'Emilio Castillo Pérez', nivel: 'preparatoria', grado: '2B', padre_nombre: 'Patricia Castillo', telefono: '(55) 1212-3434', email: 'p.castillo@mail.com', concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: '2026-05-09', estado: 'pagado', metodo_pago: 'tarjeta' },
]

const mockStats: Stats = {
  total_alumnos: 6,
  pagados: 3,
  atrasados: 2,
  pendientes: 1,
  recaudado_mes: 12800,
}

async function getData(): Promise<{ stats: Stats; pagos: Pago[]; isDemo: boolean }> {
  if (!process.env.DATABASE_URL) {
    return { stats: mockStats, pagos: mockPagos, isDemo: true }
  }

  try {
    const periodoActual = new Date().toISOString().slice(0, 7) // YYYY-MM

    const [statsRes, pagosRes] = await Promise.all([
      pool.query<Stats>(
        `SELECT
          COUNT(DISTINCT a.id)::int AS total_alumnos,
          COUNT(*) FILTER (WHERE p.estado = 'pagado')::int AS pagados,
          COUNT(*) FILTER (WHERE p.estado = 'atrasado')::int AS atrasados,
          COUNT(*) FILTER (WHERE p.estado = 'pendiente')::int AS pendientes,
          COALESCE(SUM(p.monto) FILTER (WHERE p.estado = 'pagado'), 0)::numeric AS recaudado_mes
        FROM alumnos a
        LEFT JOIN pagos p ON p.alumno_id = a.id AND p.periodo = $1`,
        [periodoActual]
      ),
      pool.query<Pago>(
        `SELECT
          p.id, p.concepto, p.periodo,
          p.monto::numeric AS monto,
          TO_CHAR(p.fecha_limite, 'YYYY-MM-DD') AS fecha_limite,
          TO_CHAR(p.fecha_pago, 'YYYY-MM-DD') AS fecha_pago,
          p.estado, p.metodo_pago,
          a.nombre || ' ' || a.apellidos AS alumno_nombre,
          a.nivel, a.grado,
          pad.nombre || ' ' || pad.apellidos AS padre_nombre,
          pad.telefono, pad.email
        FROM pagos p
        JOIN alumnos a ON a.id = p.alumno_id
        JOIN padres pad ON pad.id = p.padre_id
        WHERE p.periodo = $1
        ORDER BY
          CASE p.estado WHEN 'atrasado' THEN 0 WHEN 'pendiente' THEN 1 ELSE 2 END,
          p.fecha_limite ASC`,
        [periodoActual]
      ),
    ])

    return { stats: statsRes.rows[0], pagos: pagosRes.rows, isDemo: false }
  } catch {
    return { stats: mockStats, pagos: mockPagos, isDemo: true }
  }
}

export default async function AdminPage() {
  const { stats, pagos, isDemo } = await getData()
  const periodo = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  const statCards = [
    { label: 'Total alumnos', value: stats.total_alumnos, icon: Users, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Pagos al corriente', value: stats.pagados, icon: CheckCircle, color: 'bg-green-50 text-green-700', iconBg: 'bg-green-100' },
    { label: 'Pagos atrasados', value: stats.atrasados, icon: AlertTriangle, color: 'bg-red-50 text-red-700', iconBg: 'bg-red-100' },
    { label: 'Por pagar', value: stats.pendientes, icon: Clock, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
    {
      label: 'Recaudado este mes',
      value: `$${Number(stats.recaudado_mes).toLocaleString('es-MX')}`,
      icon: DollarSign,
      color: 'bg-violet-50 text-violet-700',
      iconBg: 'bg-violet-100',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Dashboard de Pagos</h1>
        <p className="text-gray-500 text-sm mt-1 capitalize">
          Período: {periodo}
          {isDemo && (
            <span className="ml-3 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Modo demo — configura DATABASE_URL para datos reales
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, iconBg }) => (
          <div key={label} className={`rounded-2xl p-5 ${color} border border-current/10`}>
            <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs font-medium opacity-70 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Payments table */}
      <PagosClient pagos={pagos} />
    </div>
  )
}
