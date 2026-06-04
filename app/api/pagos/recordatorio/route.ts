import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * GET  /api/pagos/recordatorio
 * n8n consulta este endpoint para enviar recordatorios de pago por WhatsApp.
 * Protegido con header x-api-secret
 */

const API_SECRET = process.env.N8N_WEBHOOK_SECRET ?? ''

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('x-api-secret')
  if (API_SECRET && authHeader !== API_SECRET) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const estadoParam = searchParams.get('estado') ?? 'atrasado,pendiente'
  const estados = estadoParam.split(',').map((s) => s.trim()).filter(Boolean)

  try {
    const placeholders = estados.map((_, i) => `$${i + 1}`).join(',')
    const pagos = await query(`
      SELECT
        p.id,
        a.nombre_completo AS alumno_nombre,
        a.carrera,
        a.semestre,
        a.numero_whatsapp AS whatsapp,
        p.concepto,
        p.periodo,
        p.monto,
        p.fecha_limite,
        p.estado,
        p.notas
      FROM pagos_liceo p
      JOIN alumnos_liceo a ON p.alumno_id = a.id
      WHERE p.estado IN (${placeholders})
        AND a.numero_whatsapp IS NOT NULL
      ORDER BY a.nombre_completo, p.periodo
    `, estados)

    return NextResponse.json({
      ok: true,
      total: pagos.length,
      estados_filtrados: estados,
      pagos,
    })
  } catch (err) {
    console.error('[/api/pagos/recordatorio]', err)
    return NextResponse.json({ error: 'Error de base de datos' }, { status: 500 })
  }
}
