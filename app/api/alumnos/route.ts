import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const alumnos = await query(`
    SELECT id, nombre_completo, matricula, carrera, semestre, turno,
           estado_academico, adeudo, numero_whatsapp, correo,
           fecha_ingreso, nombre_padre, nombre_madre, whatsapp_tutor
    FROM alumnos_liceo ORDER BY nombre_completo
  `)
  return NextResponse.json(alumnos)
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const b = await request.json()

  const required = ['nombre_completo', 'matricula', 'carrera', 'semestre', 'turno', 'estado_academico']
  for (const f of required) {
    if (!b[f]) return NextResponse.json({ error: `Campo requerido: ${f}` }, { status: 400 })
  }

  const existe = await queryOne('SELECT id FROM alumnos_liceo WHERE matricula = $1', [b.matricula])
  if (existe) return NextResponse.json({ error: 'Matrícula ya registrada' }, { status: 409 })

  const alumno = await queryOne(`
    INSERT INTO alumnos_liceo
      (nombre_completo, matricula, carrera, semestre, turno, estado_academico,
       adeudo, numero_whatsapp, correo, fecha_ingreso, nombre_padre, nombre_madre, whatsapp_tutor)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
    RETURNING *
  `, [
    b.nombre_completo, b.matricula, b.carrera, b.semestre, b.turno, b.estado_academico,
    b.adeudo ?? 0, b.numero_whatsapp ?? null, b.correo ?? null,
    b.fecha_ingreso ?? new Date().toISOString().split('T')[0],
    b.nombre_padre ?? null, b.nombre_madre ?? null, b.whatsapp_tutor ?? null
  ])

  return NextResponse.json({ ok: true, alumno }, { status: 201 })
}
