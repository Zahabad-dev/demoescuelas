import { createAdminClient } from '@/lib/supabase/admin'
import { MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Ticket = {
  id: string
  numero_whatsapp: string
  nombre_padre: string | null
  nombre_alumno: string | null
  correo: string | null
  nivel_escolar: string | null
  descripcion: string | null
  estado: string
  tipo: string | null
  prioridad: string
  numero_negocio: string | null
  notas: string | null
  updated_at: string
}

const estadoCls: Record<string, string> = {
  'Nuevo':         'bg-blue-100 text-blue-700',
  'Atendido':      'bg-green-100 text-green-700',
  'Escalado':      'bg-red-100 text-red-700',
  'Pago enviado':  'bg-purple-100 text-purple-700',
  'Cerrado':       'bg-gray-100 text-gray-500',
}

const prioridadCls: Record<string, string> = {
  'ALTA':  'bg-red-100 text-red-700',
  'MEDIA': 'bg-amber-100 text-amber-700',
  'BAJA':  'bg-green-100 text-green-700',
}

const mockTickets: Ticket[] = [
  {
    id: '1', numero_whatsapp: '525511112222', nombre_padre: 'Carlos Ramírez', nombre_alumno: 'Sofía Ramírez',
    correo: 'c.ramirez@mail.com', nivel_escolar: 'primaria', descripcion: 'Consulta sobre pago de colegiatura mayo',
    estado: 'Atendido', tipo: 'Pago', prioridad: 'MEDIA', numero_negocio: '7752012770', notas: null,
    updated_at: new Date().toISOString(),
  },
  {
    id: '2', numero_whatsapp: '525533334444', nombre_padre: 'Ana Morales', nombre_alumno: 'Diego Morales',
    correo: null, nivel_escolar: 'secundaria', descripcion: 'Solicita convenio de pago por adeudo',
    estado: 'Escalado', tipo: 'Pago', prioridad: 'ALTA', numero_negocio: '7752012770', notas: 'Promete pagar el 15',
    updated_at: new Date().toISOString(),
  },
  {
    id: '3', numero_whatsapp: '525555556666', nombre_padre: 'Roberto Cruz', nombre_alumno: null,
    correo: null, nivel_escolar: 'preparatoria', descripcion: 'Información sobre proceso de admisión',
    estado: 'Nuevo', tipo: 'Información', prioridad: 'BAJA', numero_negocio: '7752012770', notas: null,
    updated_at: new Date().toISOString(),
  },
]

async function getTickets(): Promise<{ tickets: Ticket[]; isDemo: boolean }> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
  ) {
    return { tickets: mockTickets, isDemo: true }
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw error
    return { tickets: (data as Ticket[]) ?? [], isDemo: false }
  } catch {
    return { tickets: mockTickets, isDemo: true }
  }
}

export default async function TicketsPage() {
  const { tickets, isDemo } = await getTickets()

  const counts = {
    Nuevo:        tickets.filter((t) => t.estado === 'Nuevo').length,
    Escalado:     tickets.filter((t) => t.estado === 'Escalado').length,
    Atendido:     tickets.filter((t) => t.estado === 'Atendido').length,
    'Pago enviado': tickets.filter((t) => t.estado === 'Pago enviado').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Tickets WhatsApp</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {tickets.length} conversaciones registradas por EduBot
          {isDemo && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              Modo demo
            </span>
          )}
        </p>
      </div>

      {/* Stats chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(Object.entries(counts) as [string, number][]).map(([label, count]) => (
          <div
            key={label}
            className={`rounded-2xl p-4 border border-current/10 ${estadoCls[label] ?? 'bg-gray-100 text-gray-600'}`}
          >
            <div className="text-2xl font-black">{count}</div>
            <div className="text-xs font-medium opacity-80 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Registro de tickets bot</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre / Alumno</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioridad</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400 text-sm">
                    No hay tickets registrados todavía. El bot creará uno por cada conversación.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/70">
                    {/* Padre / Alumno */}
                    <td className="px-4 py-3.5 font-medium text-gray-900">
                      {t.nombre_padre || '—'}
                      {t.nombre_alumno && (
                        <span className="block text-xs text-gray-400 font-normal">{t.nombre_alumno}</span>
                      )}
                    </td>
                    {/* WhatsApp */}
                    <td className="px-4 py-3.5 text-gray-500 font-mono text-xs">{t.numero_whatsapp}</td>
                    {/* Nivel */}
                    <td className="px-4 py-3.5 text-gray-500 capitalize">{t.nivel_escolar || '—'}</td>
                    {/* Tipo */}
                    <td className="px-4 py-3.5 text-gray-500">{t.tipo || '—'}</td>
                    {/* Estado */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          estadoCls[t.estado] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {t.estado}
                      </span>
                    </td>
                    {/* Prioridad */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          prioridadCls[t.prioridad] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {t.prioridad}
                      </span>
                    </td>
                    {/* Descripción */}
                    <td className="px-4 py-3.5 text-gray-500 max-w-xs">
                      <span className="line-clamp-2">{t.descripcion || '—'}</span>
                      {t.notas && (
                        <span className="block text-xs text-amber-600 mt-0.5">📌 {t.notas}</span>
                      )}
                    </td>
                    {/* Fecha */}
                    <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                      {t.updated_at
                        ? new Date(t.updated_at).toLocaleString('es-MX', {
                            timeZone: 'America/Mexico_City',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
          {tickets.length} registros · sincronizados desde n8n EduBot
        </div>
      </div>
    </div>
  )
}
