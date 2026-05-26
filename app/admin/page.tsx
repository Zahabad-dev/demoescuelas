import { createClient } from '@/lib/supabase/server'
import PagosClient from './components/PagosClient'
import { Users, CheckCircle, AlertTriangle, Clock, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Pago = {
  id: string
  alumno_nombre: string
  nivel: string
  grado: string
  grupo: string | null
  padre_nombre: string
  telefono: string | null
  whatsapp: string | null
  padre_email: string
  concepto: string
  periodo: string
  monto: number
  fecha_limite: string
  fecha_pago: string | null
  estado: 'pagado' | 'pendiente' | 'atrasado'
  metodo_pago: string | null
  notas: string | null
}

// Demo data cuando Supabase no está configurado
const mockPagos: Pago[] = [
  { id: '1', alumno_nombre: 'Sofía Ramírez Torres',    nivel: 'primaria',     grado: '3', grupo: 'A', padre_nombre: 'Carlos Ramírez',   telefono: '(55) 1111-2222', whatsapp: '+525511112222', padre_email: 'c.ramirez@mail.com',   concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-08', estado: 'pagado',   metodo_pago: 'transferencia', notas: null },
  { id: '2', alumno_nombre: 'Diego Morales Vega',      nivel: 'secundaria',   grado: '2', grupo: 'B', padre_nombre: 'Ana Morales',       telefono: '(55) 3333-4444', whatsapp: '+525533334444', padre_email: 'ana@mail.com',         concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: null },
  { id: '3', alumno_nombre: 'Valentina Cruz López',    nivel: 'preparatoria', grado: '1', grupo: 'C', padre_nombre: 'Roberto Cruz',      telefono: '(55) 5555-6666', whatsapp: '+525555556666', padre_email: 'r.cruz@mail.com',      concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'pendiente',metodo_pago: null,            notas: null },
  { id: '4', alumno_nombre: 'Mateo Herrera Santos',    nivel: 'primaria',     grado: '5', grupo: 'A', padre_nombre: 'Laura Herrera',     telefono: '(55) 7777-8888', whatsapp: '+525577778888', padre_email: 'l.herrera@mail.com',   concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-05', estado: 'pagado',   metodo_pago: 'efectivo',      notas: null },
  { id: '5', alumno_nombre: 'Isabella Jiménez Ruiz',   nivel: 'secundaria',   grado: '3', grupo: 'A', padre_nombre: 'Miguel Jiménez',    telefono: '(55) 9999-0000', whatsapp: '+525599990000', padre_email: 'm.jimenez@mail.com',   concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: null },
  { id: '6', alumno_nombre: 'Emilio Castillo Pérez',   nivel: 'preparatoria', grado: '2', grupo: 'B', padre_nombre: 'Patricia Castillo', telefono: '(55) 1212-3434', whatsapp: '+525512123434', padre_email: 'p.castillo@mail.com',  concepto: 'Colegiatura mensual', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: '2026-05-09', estado: 'pagado',   metodo_pago: 'tarjeta',       notas: null },
]

async function getData(): Promise<{ pagos: Pago[]; isDemo: boolean }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return { pagos: mockPagos, isDemo: true }
  }

  try {
    const supabase = await createClient()
    const periodoActual = new Date().toISOString().slice(0, 7)

    const { data, error } = await supabase
      .from('v_pagos_detalle')
      .select('*')
      .eq('periodo', periodoActual)
      .order('estado')

    if (error) throw error
    return { pagos: (data as Pago[]) ?? [], isDemo: false }
  } catch {
    return { pagos: mockPagos, isDemo: true }
  }
}

export default async function AdminPage() {
  const { pagos, isDemo } = await getData()
  const periodo = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })

  const stats = {
    total:     pagos.length,
    pagados:   pagos.filter((p) => p.estado === 'pagado').length,
    atrasados: pagos.filter((p) => p.estado === 'atrasado').length,
    pendientes:pagos.filter((p) => p.estado === 'pendiente').length,
    recaudado: pagos.filter((p) => p.estado === 'pagado').reduce((s, p) => s + Number(p.monto), 0),
  }

  const cards = [
    { label: 'Total alumnos',     value: stats.total,                                              icon: Users,         color: 'bg-blue-50   text-blue-700',  iconBg: 'bg-blue-100'   },
    { label: 'Al corriente',      value: stats.pagados,                                            icon: CheckCircle,   color: 'bg-green-50  text-green-700', iconBg: 'bg-green-100'  },
    { label: 'Atrasados',         value: stats.atrasados,                                          icon: AlertTriangle, color: 'bg-red-50    text-red-700',   iconBg: 'bg-red-100'    },
    { label: 'Por pagar',         value: stats.pendientes,                                         icon: Clock,         color: 'bg-amber-50  text-amber-700', iconBg: 'bg-amber-100'  },
    { label: 'Recaudado mes',     value: `$${stats.recaudado.toLocaleString('es-MX')}`,            icon: DollarSign,    color: 'bg-violet-50 text-violet-700',iconBg: 'bg-violet-100' },
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
              Modo demo — configura Supabase para datos reales
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

      <PagosClient pagos={pagos} />
    </div>
  )
}
