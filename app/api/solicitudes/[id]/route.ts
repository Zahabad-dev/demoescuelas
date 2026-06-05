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
