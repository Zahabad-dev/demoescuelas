import { createAdminClient } from '@/lib/supabase/admin'
import PagosFullClient from '../components/PagosFullClient'

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

const mockPagos: Pago[] = [
  { id: '1',  alumno_nombre: 'Sofía Ramírez Torres',   nivel: 'primaria',     grado: '3', grupo: 'A', padre_nombre: 'Carlos Ramírez',   telefono: '(55) 1111-2222', whatsapp: '+525511112222', padre_email: 'c.ramirez@mail.com',  concepto: 'Colegiatura', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-08', estado: 'pagado',   metodo_pago: 'transferencia', notas: null },
  { id: '2',  alumno_nombre: 'Diego Morales Vega',     nivel: 'secundaria',   grado: '2', grupo: 'B', padre_nombre: 'Ana Morales',       telefono: '(55) 3333-4444', whatsapp: '+525533334444', padre_email: 'ana@mail.com',        concepto: 'Colegiatura', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: null },
  { id: '3',  alumno_nombre: 'Valentina Cruz López',   nivel: 'preparatoria', grado: '1', grupo: 'C', padre_nombre: 'Roberto Cruz',      telefono: '(55) 5555-6666', whatsapp: '+525555556666', padre_email: 'r.cruz@mail.com',     concepto: 'Colegiatura', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'pendiente',metodo_pago: null,            notas: null },
  { id: '4',  alumno_nombre: 'Mateo Herrera Santos',   nivel: 'primaria',     grado: '5', grupo: 'A', padre_nombre: 'Laura Herrera',     telefono: '(55) 7777-8888', whatsapp: '+525577778888', padre_email: 'l.herrera@mail.com',  concepto: 'Colegiatura', periodo: '2026-05', monto: 3500, fecha_limite: '2026-05-10', fecha_pago: '2026-05-05', estado: 'pagado',   metodo_pago: 'efectivo',      notas: null },
  { id: '5',  alumno_nombre: 'Isabella Jiménez Ruiz',  nivel: 'secundaria',   grado: '3', grupo: 'A', padre_nombre: 'Miguel Jiménez',    telefono: '(55) 9999-0000', whatsapp: '+525599990000', padre_email: 'm.jimenez@mail.com',  concepto: 'Colegiatura', periodo: '2026-05', monto: 4200, fecha_limite: '2026-05-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: null },
  { id: '6',  alumno_nombre: 'Emilio Castillo Pérez',  nivel: 'preparatoria', grado: '2', grupo: 'B', padre_nombre: 'Patricia Castillo', telefono: '(55) 1212-3434', whatsapp: '+525512123434', padre_email: 'p.castillo@mail.com', concepto: 'Colegiatura', periodo: '2026-05', monto: 5800, fecha_limite: '2026-05-10', fecha_pago: '2026-05-09', estado: 'pagado',   metodo_pago: 'tarjeta',       notas: null },
  { id: '7',  alumno_nombre: 'Sofía Ramírez Torres',   nivel: 'primaria',     grado: '3', grupo: 'A', padre_nombre: 'Carlos Ramírez',   telefono: '(55) 1111-2222', whatsapp: '+525511112222', padre_email: 'c.ramirez@mail.com',  concepto: 'Colegiatura', periodo: '2026-04', monto: 3500, fecha_limite: '2026-04-10', fecha_pago: '2026-04-09', estado: 'pagado',   metodo_pago: 'transferencia', notas: null },
  { id: '8',  alumno_nombre: 'Diego Morales Vega',     nivel: 'secundaria',   grado: '2', grupo: 'B', padre_nombre: 'Ana Morales',       telefono: '(55) 3333-4444', whatsapp: '+525533334444', padre_email: 'ana@mail.com',        concepto: 'Colegiatura', periodo: '2026-04', monto: 4200, fecha_limite: '2026-04-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: null },
  { id: '9',  alumno_nombre: 'Valentina Cruz López',   nivel: 'preparatoria', grado: '1', grupo: 'C', padre_nombre: 'Roberto Cruz',      telefono: '(55) 5555-6666', whatsapp: '+525555556666', padre_email: 'r.cruz@mail.com',     concepto: 'Colegiatura', periodo: '2026-04', monto: 5800, fecha_limite: '2026-04-10', fecha_pago: '2026-04-07', estado: 'pagado',   metodo_pago: 'efectivo',      notas: null },
  { id: '10', alumno_nombre: 'Mateo Herrera Santos',   nivel: 'primaria',     grado: '5', grupo: 'A', padre_nombre: 'Laura Herrera',     telefono: '(55) 7777-8888', whatsapp: '+525577778888', padre_email: 'l.herrera@mail.com',  concepto: 'Colegiatura', periodo: '2026-04', monto: 3500, fecha_limite: '2026-04-10', fecha_pago: null,         estado: 'atrasado', metodo_pago: null,            notas: 'Promete pagar el 15' },
]

async function getData(): Promise<{ pagos: Pago[]; isDemo: boolean }> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return { pagos: mockPagos, isDemo: true }
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('v_pagos_detalle')
      .select('*')
      .order('periodo', { ascending: false })
      .order('estado')
    if (error) throw error
    return { pagos: (data as Pago[]) ?? [], isDemo: false }
  } catch {
    return { pagos: mockPagos, isDemo: true }
  }
}

export default async function PagosPage() {
  const { pagos, isDemo } = await getData()
  return <PagosFullClient pagos={pagos} isDemo={isDemo} />
}
