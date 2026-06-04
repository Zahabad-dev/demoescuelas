import ExcelJS from 'exceljs'
import { query } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { addHeader, styleHeaderRow, styleDataRow, addTotalRow, buildResponse } from '@/lib/excel'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const adeudos = await query<{
    nombre_completo: string; matricula: string; carrera: string
    semestre: number; turno: string; numero_whatsapp: string
    adeudo: number; estado_academico: string
  }>(`
    SELECT nombre_completo, matricula, carrera, semestre, turno,
           numero_whatsapp, adeudo, estado_academico
    FROM alumnos_liceo
    WHERE adeudo > 0
    ORDER BY adeudo DESC, carrera, nombre_completo
  `)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'LICEO México Americano Bilingüe'
  wb.created = new Date()

  const ws = wb.addWorksheet('Adeudos', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  const COLS = 8
  const dataStart = await addHeader(ws, wb, 'REPORTE DE ADEUDOS — ALUMNOS CON SALDO PENDIENTE', COLS)

  ws.columns = [
    { key: 'nombre',   width: 32 },
    { key: 'mat',      width: 14 },
    { key: 'carrera',  width: 28 },
    { key: 'sem',      width: 10 },
    { key: 'turno',    width: 12 },
    { key: 'wa',       width: 18 },
    { key: 'adeudo',   width: 16 },
    { key: 'estado',   width: 14 },
  ]

  ws.getRow(dataStart).values = [
    'Nombre Completo', 'Matrícula', 'Carrera', 'Semestre',
    'Turno', 'WhatsApp', 'Adeudo Total', 'Estado',
  ]
  styleHeaderRow(ws, dataStart)

  let sumaTotal = 0

  adeudos.forEach((a, i) => {
    const monto = Number(a.adeudo)
    sumaTotal += monto
    const rowNum = dataStart + 1 + i
    const row = ws.getRow(rowNum)
    row.values = [
      a.nombre_completo,
      a.matricula,
      a.carrera,
      a.semestre ? `${a.semestre}°` : '—',
      a.turno ?? '—',
      a.numero_whatsapp ?? '—',
      monto,
      a.estado_academico ?? '—',
    ]
    styleDataRow(ws, rowNum, i % 2 === 0)

    // Formato moneda en columna adeudo
    const adeudoCell = ws.getCell(rowNum, 7)
    adeudoCell.numFmt = '"$"#,##0.00'
    adeudoCell.font   = { name: 'Arial', size: 10, color: { argb: '8B1A1A' }, bold: true }
    adeudoCell.alignment = { horizontal: 'right' }
  })

  // Fila de total con suma
  const totalRowNum = dataStart + 1 + adeudos.length
  ws.mergeCells(totalRowNum, 1, totalRowNum, 6)
  const labelCell = ws.getCell(totalRowNum, 1)
  labelCell.value     = `Total adeudos: ${adeudos.length} alumnos`
  labelCell.font      = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFF' } }
  labelCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8B1A1A' } }
  labelCell.alignment = { horizontal: 'right', vertical: 'middle' }

  const sumaCell = ws.getCell(totalRowNum, 7)
  sumaCell.value     = sumaTotal
  sumaCell.numFmt    = '"$"#,##0.00'
  sumaCell.font      = { name: 'Arial', bold: true, size: 11, color: { argb: 'FFFFFF' } }
  sumaCell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8B1A1A' } }
  sumaCell.alignment = { horizontal: 'right', vertical: 'middle' }

  ws.getCell(totalRowNum, 8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '8B1A1A' } }
  ws.getRow(totalRowNum).height = 22

  return buildResponse(wb, `Adeudos_LMAB_${new Date().toISOString().slice(0,10)}.xlsx`)
}
