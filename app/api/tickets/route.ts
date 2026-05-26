import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET  /api/tickets
 * Devuelve tickets activos para el cron de seguimiento.
 * Protegido con header  x-api-secret: <N8N_WEBHOOK_SECRET>
 *
 * Query params opcionales:
 *   ?modo=seguimiento   → filtra seguimiento_enviado=false y excluye Cerrado/Escalado/Resuelto
 *
 * POST  /api/tickets
 * Crea / actualiza ticket por numero_whatsapp (upsert).
 * Acepta también: seguimiento_enviado (boolean)
 */

const API_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ''

function getAdmin() {
  return createAdminClient()
}

// ── GET ─────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-api-secret')
  if (API_SECRET && authHeader !== API_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let admin
  try { admin = getAdmin() } catch {
    return NextResponse.json(
      { error: 'Servidor no configurado: falta SUPABASE_SERVICE_ROLE_KEY en Vercel' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const modo = searchParams.get('modo')

  let query = admin.from('tickets').select('*').not('numero_whatsapp', 'is', null)

  if (modo === 'seguimiento') {
    // Solo tickets activos que aún no recibieron seguimiento
    query = query
      .eq('seguimiento_enviado', false)
      .not('estado', 'in', '("Cerrado","Escalado","Resuelto")')
  }

  const { data, error } = await query.order('updated_at', { ascending: true })

  if (error) {
    console.error('[GET /api/tickets] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, total: (data ?? []).length, tickets: data ?? [] })
}

// ── POST ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('x-api-secret')
  if (API_SECRET && authHeader !== API_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  if (!body.numero_whatsapp) {
    return NextResponse.json({ error: 'numero_whatsapp es requerido' }, { status: 400 })
  }

  const wa = String(body.numero_whatsapp).replace(/^\+/, '').trim()

  let admin
  try { admin = getAdmin() } catch {
    return NextResponse.json(
      { error: 'Servidor no configurado: falta SUPABASE_SERVICE_ROLE_KEY en Vercel' },
      { status: 503 }
    )
  }

  // Construir payload solo con campos que vienen en el body
  const payload: Record<string, unknown> = {
    numero_whatsapp: wa,
    updated_at: new Date().toISOString(),
  }
  if (body.nombre_padre    !== undefined) payload.nombre_padre    = body.nombre_padre
  if (body.nombre_alumno   !== undefined) payload.nombre_alumno   = body.nombre_alumno
  if (body.correo          !== undefined) payload.correo          = body.correo
  if (body.nivel_escolar   !== undefined) payload.nivel_escolar   = body.nivel_escolar
  if (body.descripcion     !== undefined) payload.descripcion     = body.descripcion
  if (body.estado          !== undefined) payload.estado          = body.estado
  if (body.tipo            !== undefined) payload.tipo            = body.tipo
  if (body.prioridad       !== undefined) payload.prioridad       = body.prioridad
  if (body.numero_negocio  !== undefined) payload.numero_negocio  = body.numero_negocio
  if (body.notas           !== undefined) payload.notas           = body.notas
  if (body.seguimiento_enviado !== undefined) payload.seguimiento_enviado = body.seguimiento_enviado

  const { data, error } = await admin
    .from('tickets')
    .upsert(payload, { onConflict: 'numero_whatsapp' })
    .select()
    .single()

  if (error) {
    console.error('[POST /api/tickets] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ticket: data })
}
