import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verifica que hay una sesión válida (anon client lee la cookie)
  const sessionClient = await createClient()
  const { data: { user } } = await sessionClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const updateFields: Record<string, unknown> = {}
  if (body.estado)      updateFields.estado      = body.estado
  if (body.fecha_pago)  updateFields.fecha_pago  = body.fecha_pago
  if (body.metodo_pago) updateFields.metodo_pago = body.metodo_pago
  if (body.notas !== undefined) updateFields.notas = body.notas

  // Operación de escritura con service_role (bypasea RLS de forma segura server-side)
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('pagos')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, pago: data })
}
