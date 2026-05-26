import { SignJWT, jwtVerify } from 'jose'

const secret = () =>
  new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-production-min32chars!')

export interface TokenPayload {
  userId: string
  email: string
  nombre: string
  rol: string
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, secret())
  return payload as unknown as TokenPayload
}
