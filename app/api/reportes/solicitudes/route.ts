import ExcelJS from 'exceljs'
import { query } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { addHeader, styleHeaderRow, styleDataRow, addTotalRow, buildResponse } from '@/lib/excel'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const solicitudes = await query<{
    numero_whatsapp: string; nombre_contacto: string; origen: string
    tipo_persona: string; area_destino: string; descripcion: string
    estado: string; prioridad: string; orientador: string; fecha_hora: string
  }>(`
    SELECT numero_whatsapp, nombre_contacto, origen, tipo_persona,
           area_destino, descripcion, estado, prioridad, orientador, fecha_hora
    FROM solicitudes_liceo
    ORDER BY fecha_hora DESC
  `)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'LICEO México Americano Bilingüe'
  wb.created = new Date()

  const ws = wb.addWorksheet('Solicitudes Bot', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  const COLS = 10
  const dataStart = await addHeader(ws, wb, 'REPORTE DE SOLICITUDES — BOT WHATSAPP', COLS)

  ws.columns = [
    { key: 'wa',        width: 18 },
    { key: 'nombre',    width: 28 },
    { key: 'canal',     width: 14 },
    { key: 'tipo',      width: 16 },
    { key: 'area',      width: 14 },
    { key: 'desc',      width: 35 },
    { key: 'estado',    width: 14 },
    { key: 'prioridad', width: 12 },
    { key: 'orientador',width: 18 },
    { key: 'fecha',     width: 18 },
  ]

  ws.getRow(dataStart).values = [
    'WhatsApp', 'Nombre Contacto', 'Canal', 'Tipo Persona',
    'Área', 'Descripción', 'Estado', 'Prioridad', 'Orientador', 'Fecha y Hora',
  ]
  styleHeaderRow(ws, dataStart)

  const prioridadColor: Record<string, string> = {
    ALTA:  'CC0000',
    MEDIA: 'CC7700',
    BAJA:  '888888',
  }

  solicitudes.forEach((s, i) => {
    const rowNum = dataStart + 1 + i
    const row = ws.getRow(rowNum)
    row.values = [
      s.numero_whatsapp ?? '—',
      s.nombre_contacto ?? '—',
      s.origen ?? '—',
      s.tipo_persona ?? '—',
      s.area_destino ?? '—',
      s.descripcion ?? '—',
      s.estado ?? '—',
      s.prioridad ?? '—',
      s.orientador ?? '—',
      s.fecha_hora ? new Date(s.fecha_hora).toLocaleString('es-MX') : '—',
    ]
    styleDataRow(ws, rowNum, i % 2 === 0)

    const color = prioridadColor[s.prioridad]
    if (color) {
      ws.getCell(rowNum, 8).font = { name: 'Arial', size: 10, color: { argb: color }, bold: true }
    }
    if (s.estado === 'Escalado') {
      ws.getCell(rowNum, 7).font = { name: 'Arial', size: 10, color: { argb: 'CC0000' }, bold: true }
    }
  })

  const escaladas = solicitudes.filter(s => s.estado === 'Escalado').length
  addTotalRow(ws, dataStart + 1 + solicitudes.length, COLS,
    `Total: ${solicitudes.length} solicitudes  |  Escaladas: ${escaladas}`)

  return buildResponse(wb, `Solicitudes_LMAB_${new Date().toISOString().slice(0,10)}.xlsx`)
}
