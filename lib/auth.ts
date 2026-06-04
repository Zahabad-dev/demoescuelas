import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'liceo_token'
const EXPIRY      = '8h'

function getSecret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET no configurado')
  return new TextEncoder().encode(s)
}

export interface AdminUser {
  id: number
  email: string
  nombre: string
  rol: string
}

export async function signToken(user: AdminUser): Promise<string> {
  return await new SignJWT({ ...(user as unknown as JWTPayload) })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as AdminUser
  } catch {
    return null
  }
}

export async function getSessionUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

export { COOKIE_NAME }
