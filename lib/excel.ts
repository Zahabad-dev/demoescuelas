import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'

// Colores institucionales
const AZUL_MARINO  = '1B2A6B'   // azul del escudo
const GUINDA       = '8B1A1A'   // rojo guinda del escudo
const ORO          = 'FFC107'   // dorado del escudo
const BLANCO       = 'FFFFFF'
const GRIS_CLARO   = 'F5F5F5'
const GRIS_BORDE   = 'CCCCCC'

export const SCHOOL = {
  nombre:   'LICEO México Americano Bilingüe',
  cct:      'CCT: [Agregar clave]',
  lema:     'Amor · Conocimiento · Lealtad',
}

// Agrega encabezado institucional a una hoja
export async function addHeader(
  ws: ExcelJS.Worksheet,
  wb: ExcelJS.Workbook,
  titulo: string,
  columnas: number
) {
  // ── Intentar cargar el logo ────────────────────────────────────
  const logoPath = path.join(process.cwd(), 'public', 'logo-liceo.png')
  let logoId: number | null = null

  if (fs.existsSync(logoPath)) {
    logoId = wb.addImage({
      filename: logoPath,
      extension: 'png',
    })
  }

  // ── Fila 1 — Nombre de la escuela ─────────────────────────────
  ws.mergeCells(1, 1, 1, columnas)
  const celdaNombre = ws.getCell('A1')
  celdaNombre.value        = SCHOOL.nombre
  celdaNombre.font         = { name: 'Arial', bold: true, size: 16, color: { argb: BLANCO } }
  celdaNombre.alignment    = { vertical: 'middle', horizontal: 'center' }
  celdaNombre.fill         = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL_MARINO } }
  ws.getRow(1).height      = 36

  // ── Fila 2 — CCT + lema ───────────────────────────────────────
  ws.mergeCells(2, 1, 2, columnas)
  const celdaCCT = ws.getCell('A2')
  celdaCCT.value        = `${SCHOOL.cct}     |     ${SCHOOL.lema}`
  celdaCCT.font         = { name: 'Arial', italic: true, size: 10, color: { argb: BLANCO } }
  celdaCCT.alignment    = { vertical: 'middle', horizontal: 'center' }
  celdaCCT.fill         = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA } }
  ws.getRow(2).height   = 20

  // ── Fila 3 — Título del reporte ───────────────────────────────
  ws.mergeCells(3, 1, 3, columnas)
  const celdaTitulo = ws.getCell('A3')
  const fecha = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
  celdaTitulo.value      = `${titulo}     —     Generado el ${fecha}`
  celdaTitulo.font       = { name: 'Arial', bold: true, size: 12, color: { argb: AZUL_MARINO } }
  celdaTitulo.alignment  = { vertical: 'middle', horizontal: 'center' }
  celdaTitulo.fill       = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEF2FF' } }
  ws.getRow(3).height    = 24

  // ── Fila 4 — Separador ────────────────────────────────────────
  ws.mergeCells(4, 1, 4, columnas)
  ws.getRow(4).height = 6
  ws.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ORO } }

  // ── Logo (si existe) ──────────────────────────────────────────
  if (logoId !== null) {
    ws.addImage(logoId, {
      tl: { col: 0, row: 0, nativeCol: 0, nativeColOff: 0, nativeRow: 0, nativeRowOff: 0 },
      ext: { width: 80, height: 80 },
      editAs: 'oneCell',
    })
  }

  return 5 // primera fila de datos (después del header)
}

// Estilo de cabecera de columnas
export function styleHeaderRow(ws: ExcelJS.Worksheet, rowNum: number) {
  const row = ws.getRow(rowNum)
  row.height = 22
  row.eachCell((cell) => {
    cell.font      = { name: 'Arial', bold: true, size: 10, color: { argb: BLANCO } }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: GUINDA } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border    = {
      top:    { style: 'thin', color: { argb: GRIS_BORDE } },
      bottom: { style: 'thin', color: { argb: GRIS_BORDE } },
      left:   { style: 'thin', color: { argb: GRIS_BORDE } },
      right:  { style: 'thin', color: { argb: GRIS_BORDE } },
    }
  })
}

// Estilo de fila de datos (alterna colores)
export function styleDataRow(ws: ExcelJS.Worksheet, rowNum: number, isEven: boolean) {
  const row = ws.getRow(rowNum)
  row.height = 18
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font      = { name: 'Arial', size: 10 }
    cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: isEven ? GRIS_CLARO : BLANCO } }
    cell.alignment = { vertical: 'middle', wrapText: false }
    cell.border    = {
      top:    { style: 'hair', color: { argb: GRIS_BORDE } },
      bottom: { style: 'hair', color: { argb: GRIS_BORDE } },
      left:   { style: 'thin', color: { argb: GRIS_BORDE } },
      right:  { style: 'thin', color: { argb: GRIS_BORDE } },
    }
  })
}

// Agrega fila de totales al final
export function addTotalRow(ws: ExcelJS.Worksheet, rowNum: number, columnas: number, texto: string) {
  ws.mergeCells(rowNum, 1, rowNum, columnas)
  const cell = ws.getCell(rowNum, 1)
  cell.value     = texto
  cell.font      = { name: 'Arial', bold: true, size: 10, color: { argb: AZUL_MARINO } }
  cell.fill      = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEF2FF' } }
  cell.alignment = { horizontal: 'right', vertical: 'middle' }
  ws.getRow(rowNum).height = 18
}

// Genera el buffer del workbook
export async function buildResponse(wb: ExcelJS.Workbook, filename: string) {
  const buffer = await wb.xlsx.writeBuffer()
  return new Response(buffer, {
    headers: {
      'Content-Type':        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control':       'no-cache',
    },
  })
}
