import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * GET  /api/pagos/recordatorio
 * Llamado por n8n (cron de recordatorios).
 * Devuelve todos los pagos con estado atrasado o pendiente
 * que tengan número de WhatsApp registrado.
 *
 * Protegido con header:  x-api-secret: <N8N_WEBHOOK_SECRET>
 *
 * Query params opcionales:
 *   ?estado=atrasado          → solo atrasados (default si no se pasa nada)
 *   ?estado=atrasado,pendiente → ambos
 */

const API_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ''

export async function GET(request: NextRequest) {
  // ── Validar secret ──────────────────────────────────────────
  const authHeader = request.headers.get('x-api-secret')
  if (API_SECRET && authHeader !== API_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  // ── Leer parámetros ─────────────────────────────────────────
  const { searchParams } = new URL(request.url)
  const estadoParam = searchParams.get('estado') ?? 'atrasado,pendiente'
  const estados = estadoParam.split(',').map((s) => s.trim()).filter(Boolean)

  // ── Consultar Supabase ──────────────────────────────────────
  let admin
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json(
      { error: 'Servidor no configurado: falta SUPABASE_SERVICE_ROLE_KEY en variables de entorno de Vercel' },
      { status: 503 }
    )
  }

  const { data, error } = await admin
    .from('v_pagos_detalle')
    .select(
      'id, alumno_nombre, nivel, grado, grupo, padre_nombre, padre_email, ' +
      'telefono, whatsapp, concepto, periodo, monto, fecha_limite, estado, notas'
    )
    .in('estado', estados)
    .not('whatsapp', 'is', null)      // solo padres con WA registrado
    .order('padre_nombre')
    .order('periodo')

  if (error) {
    console.error('[/api/pagos/recordatorio] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    total: (data ?? []).length,
    estados_filtrados: estados,
    pagos: data ?? [],
  })
}
