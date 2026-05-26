import { createAdminClient } from '@/lib/supabase/admin'
import { Users, GraduationCap } from 'lucide-react'

export const dynamic = 'force-dynamic'

const nivelCls: Record<string, string> = {
  primaria:     'bg-green-100 text-green-700',
  secundaria:   'bg-blue-100 text-blue-700',
  preparatoria: 'bg-violet-100 text-violet-700',
}

const mockAlumnos = [
  { id: '1', nombre: 'Sofía',     apellidos: 'Ramírez Torres',  nivel: 'primaria',     grado: '3', grupo: 'A', activo: true },
  { id: '2', nombre: 'Diego',     apellidos: 'Morales Vega',    nivel: 'secundaria',   grado: '2', grupo: 'B', activo: true },
  { id: '3', nombre: 'Valentina', apellidos: 'Cruz López',      nivel: 'preparatoria', grado: '1', grupo: 'C', activo: true },
  { id: '4', nombre: 'Mateo',     apellidos: 'Herrera Santos',  nivel: 'primaria',     grado: '5', grupo: 'A', activo: true },
  { id: '5', nombre: 'Isabella',  apellidos: 'Jiménez Ruiz',    nivel: 'secundaria',   grado: '3', grupo: 'A', activo: true },
  { id: '6', nombre: 'Emilio',    apellidos: 'Castillo Pérez',  nivel: 'preparatoria', grado: '2', grupo: 'B', activo: true },
]

async function getAlumnos() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return { alumnos: mockAlumnos, isDemo: true }
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('alumnos')
      .select('id, nombre, apellidos, nivel, grado, grupo, activo')
      .eq('activo', true)
      .order('nivel')
      .order('apellidos')
    if (error) throw error
    return { alumnos: data ?? [], isDemo: false }
  } catch {
    return { alumnos: mockAlumnos, isDemo: true }
  }
}

export default async function AlumnosPage() {
  const { alumnos, isDemo } = await getAlumnos()

  const byNivel = {
    primaria:     alumnos.filter((a) => a.nivel === 'primaria').length,
    secundaria:   alumnos.filter((a) => a.nivel === 'secundaria').length,
    preparatoria: alumnos.filter((a) => a.nivel === 'preparatoria').length,
  }

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Alumnos</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {alumnos.length} alumnos activos
          {isDemo && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Modo demo</span>
          )}
        </p>
      </div>

      {/* Stats por nivel */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(Object.entries(byNivel) as [string, number][]).map(([nivel, count]) => (
          <div key={nivel} className={`rounded-2xl p-5 border border-current/10 ${nivelCls[nivel]}`}>
            <GraduationCap className="w-6 h-6 mb-2 opacity-70" />
            <div className="text-3xl font-black">{count}</div>
            <div className="text-sm font-medium capitalize opacity-80 mt-0.5">{nivel}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Lista de alumnos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nivel</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Grado / Grupo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumnos.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/70">
                  <td className="px-5 py-3.5 font-medium text-gray-900">{a.nombre} {a.apellidos}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${nivelCls[a.nivel] ?? 'bg-gray-100 text-gray-600'}`}>
                      {a.nivel}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{a.grado}°{a.grupo ? ` — Grupo ${a.grupo}` : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{alumnos.length} registros</div>
      </div>
    </div>
  )
}
