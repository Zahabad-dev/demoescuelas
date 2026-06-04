import { Settings, Database, Key, Bot, Workflow } from 'lucide-react'

export default function ConfiguracionPage() {
  const dbUrl = process.env.DATABASE_URL ?? ''
  const dbHost = dbUrl ? dbUrl.replace(/postgresql:\/\/[^@]+@/, '').split('/')[0] : 'No configurado'

  const items = [
    {
      icon: Database,
      title: 'Base de datos PostgreSQL',
      desc: 'Conexión directa a PostgreSQL en Easypanel. Tablas: alumnos_liceo, prospectos_liceo, solicitudes_liceo, coordinaciones_liceo, faq_liceo.',
      detail: process.env.DATABASE_URL
        ? `✓ Conectado — Host: ${dbHost}`
        : '⚠ DATABASE_URL no configurada en variables de entorno',
    },
    {
      icon: Key,
      title: 'Autenticación JWT',
      desc: 'Auth propia con JWT firmado. Usuarios en tabla admin_usuarios (PostgreSQL). Sesión en cookie httpOnly 8h.',
      detail: process.env.JWT_SECRET
        ? '✓ JWT_SECRET configurado correctamente'
        : '⚠ JWT_SECRET no configurado — agrega la variable de entorno',
    },
    {
      icon: Bot,
      title: 'Endpoint del bot (n8n)',
      desc: 'API pública con información del Liceo. Consultada por el bot de WhatsApp en cada conversación.',
      detail: '/api/bot/escuela — GET público, sin autenticación requerida',
    },
    {
      icon: Workflow,
      title: 'Integración n8n',
      desc: 'Credencial Postgres en n8n apunta a la misma BD. Webhook path: liceo-wa. Los tickets se registran en solicitudes_liceo.',
      detail: `DB: blacksheep | Credential ID: g0aAN8LJUmI85MMw`,
    },
    {
      icon: Settings,
      title: 'Variables de entorno necesarias',
      desc: 'Configura estas variables en Vercel → Settings → Environment Variables.',
      detail: 'DATABASE_URL · JWT_SECRET · N8N_WEBHOOK_SECRET',
    },
  ]

  return (
    <div>
      <div className="mb-8 pl-12 lg:pl-0">
        <h1 className="text-2xl font-black text-gray-900">Configuración</h1>
        <p className="text-gray-500 text-sm mt-0.5">Estado del sistema — Liceo de Ciencias de la Salud</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {items.map(({ icon: Icon, title, desc, detail }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">{desc}</p>
            <div className="bg-gray-50 rounded-xl px-4 py-2.5 text-xs text-gray-600 font-mono break-all">{detail}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
