import ExcelJS from 'exceljs'
import { query } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { addHeader, styleHeaderRow, styleDataRow, addTotalRow, buildResponse } from '@/lib/excel'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const prospectos = await query<{
    nombre_completo: string; numero_whatsapp: string; correo: string
    carrera_interes: string; turno_preferido: string; como_nos_conocio: string
    estado_prospecto: string; fecha_contacto: string; orientador: string; notas: string
  }>(`
    SELECT nombre_completo, numero_whatsapp, correo, carrera_interes,
           turno_preferido, como_nos_conocio, estado_prospecto,
           fecha_contacto, orientador, notas
    FROM prospectos_liceo ORDER BY fecha_contacto DESC
  `)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'LICEO México Americano Bilingüe'
  wb.created = new Date()

  const ws = wb.addWorksheet('Prospectos', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  const COLS = 10
  const dataStart = await addHeader(ws, wb, 'REPORTE DE PROSPECTOS — EMBUDO DE ADMISIONES', COLS)

  ws.columns = [
    { key: 'nombre',   width: 30 },
    { key: 'wa',       width: 18 },
    { key: 'correo',   width: 28 },
    { key: 'carrera',  width: 26 },
    { key: 'turno',    width: 12 },
    { key: 'canal',    width: 18 },
    { key: 'estado',   width: 16 },
    { key: 'fecha',    width: 14 },
    { key: 'orientador', width: 18 },
    { key: 'notas',    width: 30 },
  ]

  ws.getRow(dataStart).values = [
    'Nombre Completo', 'WhatsApp', 'Correo', 'Carrera de Interés',
    'Turno', 'Cómo nos conoció', 'Estado', 'Fecha Contacto', 'Orientador', 'Notas',
  ]
  styleHeaderRow(ws, dataStart)

  const estadoColor: Record<string, string> = {
    Inscrito:    '1B6B1B',
    Interesado:  '1B2A6B',
    Contactado:  '7B5800',
    Descartado:  '999999',
  }

  prospectos.forEach((p, i) => {
    const rowNum = dataStart + 1 + i
    const row = ws.getRow(rowNum)
    row.values = [
      p.nombre_completo ?? '—',
      p.numero_whatsapp ?? '—',
      p.correo ?? '—',
      p.carrera_interes ?? '—',
      p.turno_preferido ?? '—',
      p.como_nos_conocio ?? '—',
      p.estado_prospecto ?? '—',
      p.fecha_contacto ? new Date(p.fecha_contacto).toLocaleDateString('es-MX') : '—',
      p.orientador ?? '—',
      p.notas ?? '—',
    ]
    styleDataRow(ws, rowNum, i % 2 === 0)

    const color = estadoColor[p.estado_prospecto]
    if (color) {
      ws.getCell(rowNum, 7).font = { name: 'Arial', size: 10, color: { argb: color }, bold: true }
    }
  })

  const inscritos = prospectos.filter(p => p.estado_prospecto === 'Inscrito').length
  addTotalRow(ws, dataStart + 1 + prospectos.length, COLS,
    `Total: ${prospectos.length} prospectos  |  Inscritos: ${inscritos}  |  Conversión: ${prospectos.length > 0 ? Math.round(inscritos / prospectos.length * 100) : 0}%`)

  return buildResponse(wb, `Prospectos_LMAB_${new Date().toISOString().slice(0,10)}.xlsx`)
}
