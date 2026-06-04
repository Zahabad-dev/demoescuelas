import ExcelJS from 'exceljs'
import { query } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { addHeader, styleHeaderRow, styleDataRow, addTotalRow, buildResponse } from '@/lib/excel'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return new Response('No autorizado', { status: 401 })

  const alumnos = await query<{
    nombre_completo: string; matricula: string; carrera: string
    semestre: number; turno: string; estado_academico: string
    adeudo: number; numero_whatsapp: string; correo: string; fecha_ingreso: string
  }>(`
    SELECT nombre_completo, matricula, carrera, semestre, turno,
           estado_academico, adeudo, numero_whatsapp, correo, fecha_ingreso
    FROM alumnos_liceo ORDER BY carrera, nombre_completo
  `)

  const wb = new ExcelJS.Workbook()
  wb.creator = 'LICEO México Americano Bilingüe'
  wb.created = new Date()

  const ws = wb.addWorksheet('Alumnos Activos', {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  const COLS = 10
  const dataStart = await addHeader(ws, wb, 'REPORTE DE ALUMNOS', COLS)

  // Anchos de columna
  ws.columns = [
    { key: 'nombre',   width: 30 },
    { key: 'mat',      width: 14 },
    { key: 'carrera',  width: 28 },
    { key: 'sem',      width: 10 },
    { key: 'turno',    width: 12 },
    { key: 'estado',   width: 14 },
    { key: 'adeudo',   width: 14 },
    { key: 'wa',       width: 18 },
    { key: 'correo',   width: 28 },
    { key: 'ingreso',  width: 14 },
  ]

  // Encabezados de columna
  ws.getRow(dataStart).values = [
    'Nombre Completo', 'Matrícula', 'Carrera', 'Semestre',
    'Turno', 'Estado', 'Adeudo', 'WhatsApp', 'Correo', 'Fecha Ingreso',
  ]
  styleHeaderRow(ws, dataStart)

  // Datos
  alumnos.forEach((a, i) => {
    const rowNum = dataStart + 1 + i
    const row = ws.getRow(rowNum)
    row.values = [
      a.nombre_completo,
      a.matricula,
      a.carrera,
      a.semestre ? `${a.semestre}°` : '—',
      a.turno ?? '—',
      a.estado_academico ?? '—',
      Number(a.adeudo) > 0 ? Number(a.adeudo) : 0,
      a.numero_whatsapp ?? '—',
      a.correo ?? '—',
      a.fecha_ingreso ? new Date(a.fecha_ingreso).toLocaleDateString('es-MX') : '—',
    ]
    styleDataRow(ws, rowNum, i % 2 === 0)

    // Color en adeudo
    if (Number(a.adeudo) > 0) {
      ws.getCell(rowNum, 7).font = { name: 'Arial', size: 10, color: { argb: '8B1A1A' }, bold: true }
    }
    // Color en estado
    if (a.estado_academico !== 'Activo') {
      ws.getCell(rowNum, 6).font = { name: 'Arial', size: 10, color: { argb: 'CC0000' } }
    }
  })

  const totalRow = dataStart + 1 + alumnos.length
  addTotalRow(ws, totalRow, COLS, `Total: ${alumnos.length} alumnos`)

  return buildResponse(wb, `Alumnos_LMAB_${new Date().toISOString().slice(0,10)}.xlsx`)
}
