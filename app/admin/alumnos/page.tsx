import { query } from '@/lib/db'
import { Users, GraduationCap, Phone, Mail } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'

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
  correo: string
  nombre_padre: string
  nombre_madre: string
  whatsapp_tutor: string
}

const carreraColor: Record<string, string> = {
  'Medicina General':    'bg-red-100 text-red-700',
  'Enfermería':          'bg-blue-100 text-blue-700',
  'Nutrición':           'bg-green-100 text-green-700',
  'Fisioterapia':        'bg-amber-100 text-amber-700',
  'Odontología':         'bg-violet-100 text-violet-700',
  'Laboratorio Clínico': 'bg-cyan-100 text-cyan-700',
}

async function getAlumnos() {
  try {
    const alumnos = await query<Alumno>(`
      SELECT id, nombre_completo, matricula, carrera, semestre,
             turno, estado_academico, adeudo, numero_whatsapp,
             correo, nombre_padre, nombre_madre, whatsapp_tutor
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

  const conAdeudo = alumnos.filter(a => Number(a.adeudo) > 0).length

  return (
    <div>
      <div className="mb-6 pl-12 lg:pl-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Alumnos</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {alumnos.length} alumnos registrados
            {isDemo && <span className="ml-2 inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Sin conexión a BD</span>}
          </p>
        </div>
        <DownloadButton href="/api/reportes/alumnos" label="Descargar Excel" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 text-blue-700 rounded-2xl p-5 border border-blue-100">
          <GraduationCap className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{alumnos.length}</div>
          <div className="text-sm font-medium opacity-80">Total alumnos</div>
        </div>
        <div className="bg-green-50 text-green-700 rounded-2xl p-5 border border-green-100">
          <Users className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{alumnos.length - conAdeudo}</div>
          <div className="text-sm font-medium opacity-80">Al corriente</div>
        </div>
        <div className="bg-red-50 text-red-700 rounded-2xl p-5 border border-red-100">
          <Users className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{conAdeudo}</div>
          <div className="text-sm font-medium opacity-80">Con adeudo</div>
        </div>
        <div className="bg-violet-50 text-violet-700 rounded-2xl p-5 border border-violet-100">
          <GraduationCap className="w-6 h-6 mb-2 opacity-70" />
          <div className="text-3xl font-black">{Object.keys(byCarrera).length}</div>
          <div className="text-sm font-medium opacity-80">Carreras activas</div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-semibold text-gray-700 text-sm">Lista de alumnos con datos de contacto</span>
        </div>

        {alumnos.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No hay alumnos registrados aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Alumno</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carrera</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sem.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Adeudo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp Alumno</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Padre / Madre</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">WA Tutor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alumnos.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div>{a.nombre_completo}</div>
                      <div className="text-xs text-gray-400 font-mono">{a.matricula}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${carreraColor[a.carrera] ?? 'bg-gray-100 text-gray-600'}`}>
                        {a.carrera}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{a.semestre}°</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.estado_academico === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {a.estado_academico}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {Number(a.adeudo) > 0
                        ? <span className="text-red-600 font-semibold text-xs">${Number(a.adeudo).toLocaleString('es-MX')}</span>
                        : <span className="text-green-600 text-xs">Al corriente</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {a.numero_whatsapp
                        ? <a href={`https://wa.me/${a.numero_whatsapp}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                            <Phone className="w-3 h-3" />{a.numero_whatsapp}
                          </a>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {a.correo
                        ? <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />{a.correo}
                          </span>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      <div>{a.nombre_padre || '—'}</div>
                      {a.nombre_madre && <div className="text-gray-400">{a.nombre_madre}</div>}
                    </td>
                    <td className="px-4 py-3">
                      {a.whatsapp_tutor
                        ? <a href={`https://wa.me/${a.whatsapp_tutor}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline">
                            <Phone className="w-3 h-3" />{a.whatsapp_tutor}
                          </a>
                        : <span className="text-gray-400 text-xs">—</span>
                      }
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
