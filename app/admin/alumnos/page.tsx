import { query } from '@/lib/db'
import { Users, GraduationCap } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Alumno = {
  id: number
  nombre_completo: string
  matricula: string
  carrera: string
  semestre: number
  turno: string
  estado_academico: string
  adeudo: number
  numero_whatsapp: string
}

const carreraColor: Record<string, string> = {
  'Medicina General':      'bg-red-100 text-red-700',
  'Enfermería':            'bg-blue-100 text-blue-700',
  'Nutrición':             'bg-green-100 text-green-700',
  'Fisioterapia':          'bg-amber-100 text-amber-700',
  'Odontología':           'bg-violet-100 text-violet-700',
  'Laboratorio Clínico':   'bg-cyan-100 text-cyan-700',
}

async function getAlumnos() {
  try {
    const alumnos = await query<Alumno>(`
      SELECT id, nombre_completo, matricula, carrera, semestre,
             turno, estado_academico, adeudo, numero_whatsapp
      FROM alumnos_liceo
      ORDER BY carrera, nombre_completo
    `)
    return { alumnos, isDemo: false }
  } catch {
    return { alumnos: [], isDemo: true }
  }
}

export default async function AlumnosPage() {
  const { alumnos, isDemo } = await getAlumnos()

  const byCarrera: Record<string, number> = {}
  for (const a of alumnos) {
    byCarrera[a.carrera] = (byCarrera[a.carrera] ?? 0) + 1
  }

  const conAdeudo  = alumnos.filter((a) => Number(a.adeudo) > 0).length
  const sinAdeudo  = alumnos.length - conAdeudo

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Alumnos</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {alumnos.length} alumnos registrados
          {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
        </p>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 text-blue-700 rounded-2xl p-5 border border-blue-100">
          <GraduationCap className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{alumnos.length}</div>
          <div className="text-sm font-medium opacity-80 mt-0.5">Total alumnos</div>
        </div>
        <div className="bg-green-50 text-green-700 rounded-2xl p-5 border border-green-100">
          <Users className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{sinAdeudo}</div>
          <div className="text-sm font-medium opacity-80 mt-0.5">Al corriente</div>
        </div>
        <div className="bg-red-50 text-red-700 rounded-2xl p-5 border border-red-100">
          <Users className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{conAdeudo}</div>
          <div className="text-sm font-medium opacity-80 mt-0.5">Con adeudo</div>
        </div>
        <div className="bg-violet-50 text-violet-700 rounded-2xl p-5 border border-violet-100">
          <GraduationCap className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{Object.keys(byCarrera).length}</div>
          <div className="text-sm font-medium opacity-80 mt-0.5">Carreras activas</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Lista de alumnos</span>
        </div>

        {alumnos.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No hay alumnos registrados aún.<br />
            <span className="text-xs">Agrega alumnos desde pgweb o importa desde tu sistema anterior.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Matrícula</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Semestre</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Turno</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adeudo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnos.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/70">
                    <td className="px-5 py-3.5 font-medium text-gray-900">{a.nombre_completo}</td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{a.matricula}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${carreraColor[a.carrera] ?? 'bg-gray-100 text-gray-600'}`}>
                        {a.carrera}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{a.semestre}°</td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize">{a.turno}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.estado_academico === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.estado_academico}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {Number(a.adeudo) > 0 ? (
                        <span className="text-red-600 font-semibold">${Number(a.adeudo).toLocaleString('es-MX')}</span>
                      ) : (
                        <span className="text-green-600 text-xs">Al corriente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">{alumnos.length} registros</div>
      </div>
    </div>
  )
}
