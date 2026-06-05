import { query } from '@/lib/db'
import { Users, GraduationCap } from 'lucide-react'
import DownloadButton from '../components/DownloadButton'
import AlumnosClient from './AlumnosClient'

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

      <AlumnosClient initialAlumnos={alumnos} />
    </div>
  )
}
