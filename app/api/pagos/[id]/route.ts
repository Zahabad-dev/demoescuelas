import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // Verifica sesión activa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const updateFields: Record<string, unknown> = {}
  if (body.estado)      updateFields.estado      = body.estado
  if (body.fecha_pago)  updateFields.fecha_pago  = body.fecha_pago
  if (body.metodo_pago) updateFields.metodo_pago = body.metodo_pago
  if (body.notas)       updateFields.notas       = body.notas

  const { data, error } = await supabase
    .from('pagos')
    .update(updateFields)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, pago: data })
}
