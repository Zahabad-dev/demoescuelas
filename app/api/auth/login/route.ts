import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { queryOne } from '@/lib/db'
import { signToken, COOKIE_NAME, type AdminUser } from '@/lib/auth'

interface AdminUsuario {
  id: number
  email: string
  nombre: string
  rol: string
  password_hash: string
  activo: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña requeridos' }, { status: 400 })
    }

    const usuario = await queryOne<AdminUsuario>(
      'SELECT id, email, nombre, rol, password_hash, activo FROM admin_usuarios WHERE email = $1 LIMIT 1',
      [email.trim().toLowerCase()]
    )

    if (!usuario || !usuario.activo) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, usuario.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Correo o contraseña incorrectos' }, { status: 401 })
    }

    const user: AdminUser = {
      id:     usuario.id,
      email:  usuario.email,
      nombre: usuario.nombre,
      rol:    usuario.rol,
    }

    const token = await signToken(user)

    const response = NextResponse.json({ ok: true, nombre: user.nombre, rol: user.rol })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   60 * 60 * 8,
      path:     '/',
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Error de conexión con la base de datos' }, { status: 503 })
  }
}
