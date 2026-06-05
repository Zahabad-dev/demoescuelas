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
    'nombre_completo','numero_whatsapp','correo','carrera_interes',
    'turno_preferido','como_nos_conocio','estado_prospecto','orientador','notas'
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
  const prospecto = await queryOne(
    `UPDATE prospectos_liceo SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    vals
  )

  if (!prospecto) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true, prospecto })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const deleted = await queryOne(`DELETE FROM prospectos_liceo WHERE id = $1 RETURNING id`, [id])

  if (!deleted) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
