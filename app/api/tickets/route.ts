import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'

/**
 * GET  /api/tickets  — Solicitudes activas para n8n
 * POST /api/tickets  — Crea/actualiza solicitud por numero_whatsapp
 * Protegido con header x-api-secret
 */

const API_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ''

function checkAuth(request: NextRequest) {
  if (API_SECRET && request.headers.get('x-api-secret') !== API_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return null
}

// ── GET ──────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const modo = searchParams.get('modo')

    let sql = `SELECT * FROM solicitudes_liceo WHERE numero_whatsapp IS NOT NULL`
    if (modo === 'seguimiento') {
      sql += ` AND seguimiento_enviado = 'No' AND estado NOT IN ('Cerrado','Escalado','Resuelto')`
    }
    sql += ` ORDER BY fecha_hora ASC`

    const tickets = await query(sql)
    return NextResponse.json({ ok: true, total: tickets.length, tickets })
  } catch (err) {
    console.error('[GET /api/tickets]', err)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }
}

// ── POST ─────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authError = checkAuth(request)
  if (authError) return authError

  let body: Record<string, unknown>
  try { body = await request.json() }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  if (!body.numero_whatsapp) {
    return NextResponse.json({ error: 'numero_whatsapp es requerido' }, { status: 400 })
  }

  const wa = String(body.numero_whatsapp).replace(/^\+/, '').trim()

  try {
    await query(`
      INSERT INTO solicitudes_liceo
        (numero_whatsapp, fecha_hora, nombre_contacto, descripcion, estado, tipo_servicio, prioridad, orientador, origen, numero_negocio, seguimiento_enviado)
      VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (numero_whatsapp) DO UPDATE SET
        fecha_hora          = NOW(),
        nombre_contacto     = COALESCE(EXCLUDED.nombre_contacto, solicitudes_liceo.nombre_contacto),
        descripcion         = COALESCE(EXCLUDED.descripcion,     solicitudes_liceo.descripcion),
        estado              = COALESCE(EXCLUDED.estado,          solicitudes_liceo.estado),
        tipo_servicio       = COALESCE(EXCLUDED.tipo_servicio,   solicitudes_liceo.tipo_servicio),
        prioridad           = COALESCE(EXCLUDED.prioridad,       solicitudes_liceo.prioridad),
        orientador          = COALESCE(EXCLUDED.orientador,      solicitudes_liceo.orientador),
        seguimiento_enviado = COALESCE(EXCLUDED.seguimiento_enviado, solicitudes_liceo.seguimiento_enviado)
    `, [
      wa,
      body.nombre_contacto  ?? body.nombre_padre ?? null,
      body.descripcion      ?? null,
      body.estado           ?? 'Nuevo',
      body.tipo_servicio    ?? body.tipo ?? null,
      body.prioridad        ?? 'MEDIA',
      body.orientador       ?? null,
      body.origen           ?? 'WhatsApp',
      body.numero_negocio   ?? null,
      body.seguimiento_enviado ?? 'No',
    ])

    const ticket = await queryOne(`SELECT * FROM solicitudes_liceo WHERE numero_whatsapp = $1`, [wa])
    return NextResponse.json({ ok: true, ticket })
  } catch (err) {
    console.error('[POST /api/tickets]', err)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }
}
