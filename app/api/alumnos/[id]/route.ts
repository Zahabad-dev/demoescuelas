import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const b = await request.json()

  const campos = [
    'nombre_completo','matricula','carrera','semestre','turno','estado_academico',
    'adeudo','numero_whatsapp','correo','fecha_ingreso','nombre_padre','nombre_madre','whatsapp_tutor'
  ]

  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1

  for (const campo of campos) {
    if (b[campo] !== undefined) {
      sets.push(`${campo} = $${i++}`)
      vals.push(b[campo] === '' ? null : b[campo])
    }
  }

  if (sets.length === 0) return NextResponse.json({ error: 'Sin campos' }, { status: 400 })

  vals.push(id)
  const alumno = await queryOne(
    `UPDATE alumnos_liceo SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    vals
  )

  if (!alumno) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true, alumno })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  // Verificar que no tenga pagos pendientes o atrasados antes de eliminar
  const pagosActivos = await queryOne<{ count: string }>(
    `SELECT COUNT(*) as count FROM pagos_liceo WHERE alumno_id = $1 AND estado IN ('pendiente','atrasado')`,
    [id]
  )
  if (Number(pagosActivos?.count) > 0) {
    return NextResponse.json({ error: 'El alumno tiene pagos pendientes o atrasados. Regularice antes de eliminar.' }, { status: 409 })
  }

  await queryOne(`DELETE FROM pagos_liceo WHERE alumno_id = $1`, [id])
  await queryOne(`DELETE FROM solicitudes_liceo WHERE numero_whatsapp = (SELECT numero_whatsapp FROM alumnos_liceo WHERE id = $1)`, [id])
  const deleted = await queryOne(`DELETE FROM alumnos_liceo WHERE id = $1 RETURNING id`, [id])

  if (!deleted) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
