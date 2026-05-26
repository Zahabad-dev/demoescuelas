import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * POST  /api/tickets
 * Llamado por n8n (EduBot) para registrar / actualizar tickets en Supabase.
 * Protegido con el header  x-api-secret: <N8N_WEBHOOK_SECRET>
 *
 * Body JSON esperado:
 * {
 *   numero_whatsapp: string   ← requerido, sin "+" inicial
 *   nombre_padre?:   string
 *   nombre_alumno?:  string
 *   correo?:         string
 *   nivel_escolar?:  string   ← "primaria" | "secundaria" | "preparatoria"
 *   descripcion?:    string
 *   estado?:         string   ← "Nuevo" | "Atendido" | "Escalado" | "Pago enviado" | "Cerrado"
 *   tipo?:           string   ← "Pago" | "Información" | "Administrativo" | "Académico" | "Soporte"
 *   prioridad?:      string   ← "BAJA" | "MEDIA" | "ALTA"
 *   numero_negocio?: string
 *   notas?:          string
 * }
 */

const API_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ''

export async function POST(request: NextRequest) {
  // ── Validar secret ──────────────────────────────────────────
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

  // ── Upsert en Supabase ──────────────────────────────────────
  let admin
  try {
    admin = createAdminClient()
  } catch {
    return NextResponse.json(
      { error: 'Servidor no configurado: falta SUPABASE_SERVICE_ROLE_KEY en Vercel' },
      { status: 503 }
    )
  }

  const { data, error } = await admin
    .from('tickets')
    .upsert(
      {
        numero_whatsapp: wa,
        nombre_padre:    (body.nombre_padre    as string) ?? null,
        nombre_alumno:   (body.nombre_alumno   as string) ?? null,
        correo:          (body.correo          as string) ?? null,
        nivel_escolar:   (body.nivel_escolar   as string) ?? null,
        descripcion:     (body.descripcion     as string) ?? null,
        estado:          (body.estado          as string) ?? 'Nuevo',
        tipo:            (body.tipo            as string) ?? null,
        prioridad:       (body.prioridad       as string) ?? 'MEDIA',
        numero_negocio:  (body.numero_negocio  as string) ?? null,
        notas:           (body.notas           as string) ?? null,
        updated_at:      new Date().toISOString(),
      },
      { onConflict: 'numero_whatsapp' }
    )
    .select()
    .single()

  if (error) {
    console.error('[/api/tickets] Supabase error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, ticket: data })
}
