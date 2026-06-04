import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1

  if (body.estado     !== undefined) { sets.push(`estado = $${i++}`);     vals.push(body.estado) }
  if (body.fecha_pago !== undefined) { sets.push(`fecha_pago = $${i++}`); vals.push(body.fecha_pago) }
  if (body.metodo_pago!== undefined) { sets.push(`metodo_pago = $${i++}`);vals.push(body.metodo_pago) }
  if (body.notas      !== undefined) { sets.push(`notas = $${i++}`);      vals.push(body.notas) }

  if (sets.length === 0) {
    return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 })
  }

  vals.push(id)
  const pago = await queryOne(
    `UPDATE pagos_liceo SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    vals
  )

  if (!pago) return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true, pago })
}
