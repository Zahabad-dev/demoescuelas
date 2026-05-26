import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get('auth_token')?.value
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  try {
    await verifyToken(token)
    const { id } = await params
    const body = await request.json()
    const { estado, fecha_pago, metodo_pago, notas } = body

    const { rows } = await pool.query(
      `UPDATE pagos
       SET estado = COALESCE($1, estado),
           fecha_pago = COALESCE($2, fecha_pago),
           metodo_pago = COALESCE($3, metodo_pago),
           notas = COALESCE($4, notas),
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [estado, fecha_pago, metodo_pago, notas, id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, pago: rows[0] })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
