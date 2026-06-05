import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  // Verificar contraseña para operaciones de pago
  if (!body.password) return NextResponse.json({ error: 'Se requiere contraseña para modificar pagos' }, { status: 403 })

  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM admin_usuarios WHERE id = $1 AND activo = true',
    [user.id]
  )
  if (!row) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const ok = await bcrypt.compare(body.password, row.password_hash)
  if (!ok) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 403 })

  const sets: string[] = []
  const vals: unknown[] = []
  let i = 1

  if (body.estado      !== undefined) { sets.push(`estado = $${i++}`);       vals.push(body.estado) }
  if (body.fecha_pago  !== undefined) { sets.push(`fecha_pago = $${i++}`);   vals.push(body.fecha_pago || null) }
  if (body.metodo_pago !== undefined) { sets.push(`metodo_pago = $${i++}`);  vals.push(body.metodo_pago || null) }
  if (body.monto       !== undefined) { sets.push(`monto = $${i++}`);        vals.push(body.monto) }
  if (body.concepto    !== undefined) { sets.push(`concepto = $${i++}`);     vals.push(body.concepto) }
  if (body.periodo     !== undefined) { sets.push(`periodo = $${i++}`);      vals.push(body.periodo) }
  if (body.fecha_limite!== undefined) { sets.push(`fecha_limite = $${i++}`); vals.push(body.fecha_limite || null) }
  if (body.notas       !== undefined) { sets.push(`notas = $${i++}`);        vals.push(body.notas || null) }

  if (sets.length === 0) return NextResponse.json({ error: 'Sin campos para actualizar' }, { status: 400 })

  // Coherencia: si estado=pagado y no hay fecha_pago, poner hoy
  if (body.estado === 'pagado' && !body.fecha_pago) {
    sets.push(`fecha_pago = $${i++}`)
    vals.push(new Date().toISOString().split('T')[0])
  }
  // Si estado=pendiente o atrasado, limpiar fecha_pago
  if (body.estado === 'pendiente' || body.estado === 'atrasado') {
    sets.push(`fecha_pago = $${i++}`)
    vals.push(null)
  }

  vals.push(id)
  const pago = await queryOne(
    `UPDATE pagos_liceo SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${i} RETURNING *`,
    vals
  )

  if (!pago) return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 })

  // Sincronizar adeudo en alumnos_liceo
  await queryOne(`
    UPDATE alumnos_liceo SET adeudo = (
      SELECT COALESCE(SUM(monto), 0) FROM pagos_liceo
      WHERE alumno_id = (SELECT alumno_id FROM pagos_liceo WHERE id = $1)
      AND estado IN ('pendiente','atrasado')
    )
    WHERE id = (SELECT alumno_id FROM pagos_liceo WHERE id = $1)
  `, [id])

  return NextResponse.json({ ok: true, pago })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // POST a /api/pagos/[alumno_id] para crear un pago nuevo
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id: alumno_id } = await params
  const b = await request.json()

  if (!b.password) return NextResponse.json({ error: 'Se requiere contraseña' }, { status: 403 })
  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM admin_usuarios WHERE id = $1 AND activo = true', [user.id]
  )
  const ok = await bcrypt.compare(b.password, row!.password_hash)
  if (!ok) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 403 })

  const pago = await queryOne(`
    INSERT INTO pagos_liceo (alumno_id, concepto, periodo, monto, fecha_limite, estado, metodo_pago, notas)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
  `, [alumno_id, b.concepto, b.periodo, b.monto, b.fecha_limite || null, b.estado ?? 'pendiente', b.metodo_pago || null, b.notas || null])

  return NextResponse.json({ ok: true, pago }, { status: 201 })
}
