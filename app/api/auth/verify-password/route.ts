import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { queryOne } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { password } = await request.json()
  if (!password) return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })

  const row = await queryOne<{ password_hash: string }>(
    'SELECT password_hash FROM admin_usuarios WHERE id = $1 AND activo = true',
    [user.id]
  )
  if (!row) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  const ok = await bcrypt.compare(password, row.password_hash)
  if (!ok) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 403 })

  return NextResponse.json({ ok: true })
}
