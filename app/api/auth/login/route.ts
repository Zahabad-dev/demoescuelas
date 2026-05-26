import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña son requeridos' }, { status: 400 })
    }

    const { rows } = await pool.query(
      'SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE email = $1 AND activo = true',
      [email.toLowerCase().trim()]
    )

    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 })
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    })

    const response = NextResponse.json({ ok: true })
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hrs
      path: '/',
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Error al iniciar sesión. Verifica la configuración de base de datos.' }, { status: 500 })
  }
}
