import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Instituto San Ángel | Educación de Excelencia',
  description:
    'Instituto San Ángel — Formando líderes desde preescolar hasta preparatoria. Educación integral con valores, tecnología y excelencia académica.',
  keywords: 'escuela, primaria, secundaria, preparatoria, instituto, educación, México',
  openGraph: {
    title: 'Instituto San Ángel | Educación de Excelencia',
    description: 'Formando líderes del mañana con educación integral de calidad.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  )
}
