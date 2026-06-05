import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const b = await request.json()

  const campos = ['estado', 'prioridad', 'orientador', 'bot_bloqueado', 'descripcion', 'area_destino', 'tipo_persona']
  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1

  for (const campo of campos) {
    if (b[campo] !== undefined) {
      sets.push(`${campo} = $${i++}`)
      vals.push(b[campo])
    }
  }

  if (sets.length === 0) return NextResponse.json({ error: 'Sin campos' }, { status: 400 })

  vals.push(id)
  const solicitud = await queryOne(
    `UPDATE solicitudes_liceo SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    vals
  )

  if (!solicitud) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true, solicitud })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  if (!body.password) return NextResponse.json({ error: 'Se requiere contraseña' }, { status: 403 })

  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM admin_usuarios WHERE id = $1 AND activo = true',
    [user.id]
  )
  if (!row) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const ok = await bcrypt.compare(body.password, row.password_hash)
  if (!ok) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 403 })

  const deleted = await queryOne(
    'DELETE FROM solicitudes_liceo WHERE id = $1 RETURNING id',
    [id]
  )
  if (!deleted) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
