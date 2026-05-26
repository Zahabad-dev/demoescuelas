-- ============================================================
-- Instituto San Ángel — Schema Supabase (PostgreSQL)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Alumnos ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.alumnos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre     TEXT NOT NULL,
  apellidos  TEXT NOT NULL,
  nivel      TEXT NOT NULL CHECK (nivel IN ('primaria', 'secundaria', 'preparatoria')),
  grado      TEXT NOT NULL,
  grupo      TEXT,
  curp       TEXT UNIQUE,
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Padres / Tutores ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.padres (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre     TEXT NOT NULL,
  apellidos  TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  telefono   TEXT,
  whatsapp   TEXT,
  alumno_id  UUID REFERENCES public.alumnos(id) ON DELETE SET NULL,
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Pagos / Colegiaturas ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pagos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  padre_id     UUID NOT NULL REFERENCES public.padres(id),
  alumno_id    UUID NOT NULL REFERENCES public.alumnos(id),
  concepto     TEXT NOT NULL DEFAULT 'Colegiatura mensual',
  periodo      TEXT NOT NULL,         -- formato YYYY-MM  ej. 2026-05
  monto        NUMERIC(10, 2) NOT NULL,
  fecha_limite DATE NOT NULL,
  fecha_pago   DATE,
  estado       TEXT NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pagado', 'pendiente', 'atrasado')),
  metodo_pago  TEXT CHECK (metodo_pago IN ('efectivo','transferencia','tarjeta','cheque') OR metodo_pago IS NULL),
  referencia   TEXT,
  notas        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trigger updated_at ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pagos_updated_at ON public.pagos;
CREATE TRIGGER trg_pagos_updated_at
  BEFORE UPDATE ON public.pagos
  FOR EACH ROW EXECUTE FUNCTION public.fn_updated_at();

-- ── Índices ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_pagos_estado   ON public.pagos(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_periodo  ON public.pagos(periodo);
CREATE INDEX IF NOT EXISTS idx_pagos_alumno   ON public.pagos(alumno_id);
CREATE INDEX IF NOT EXISTS idx_pagos_padre    ON public.pagos(padre_id);
CREATE INDEX IF NOT EXISTS idx_padres_alumno  ON public.padres(alumno_id);

-- ── Vista para n8n y admin ───────────────────────────────────
-- n8n puede consultar esta vista directamente desde el nodo Supabase
-- o con el nodo Postgres usando la cadena de conexión del proyecto.
CREATE OR REPLACE VIEW public.v_pagos_detalle AS
SELECT
  p.id,
  p.concepto,
  p.periodo,
  p.monto,
  p.fecha_limite,
  p.fecha_pago,
  p.estado,
  p.metodo_pago,
  p.notas,
  p.updated_at,
  a.nombre || ' ' || a.apellidos  AS alumno_nombre,
  a.nivel,
  a.grado,
  a.grupo,
  pad.nombre || ' ' || pad.apellidos AS padre_nombre,
  pad.email    AS padre_email,
  pad.telefono,
  pad.whatsapp
FROM public.pagos p
JOIN public.alumnos a   ON a.id = p.alumno_id
JOIN public.padres  pad ON pad.id = p.padre_id;

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE public.alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.padres  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos   ENABLE ROW LEVEL SECURITY;

-- Solo usuarios autenticados (admins del panel) pueden operar
CREATE POLICY "auth_all_alumnos" ON public.alumnos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_padres" ON public.padres
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_all_pagos" ON public.pagos
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Permite leer la vista a usuarios autenticados
GRANT SELECT ON public.v_pagos_detalle TO authenticated;

-- ── Datos de ejemplo (seed) ───────────────────────────────────
-- NOTA: Los usuarios admin se crean en:
--   Supabase Dashboard → Authentication → Users → Add User
-- Usa el email/password que prefieras. No necesitas tabla de usuarios.

INSERT INTO public.alumnos (id, nombre, apellidos, nivel, grado, grupo) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Sofía',     'Ramírez Torres',  'primaria',     '3', 'A'),
  ('a1000000-0000-0000-0000-000000000002', 'Diego',     'Morales Vega',    'secundaria',   '2', 'B'),
  ('a1000000-0000-0000-0000-000000000003', 'Valentina', 'Cruz López',      'preparatoria', '1', 'C'),
  ('a1000000-0000-0000-0000-000000000004', 'Mateo',     'Herrera Santos',  'primaria',     '5', 'A'),
  ('a1000000-0000-0000-0000-000000000005', 'Isabella',  'Jiménez Ruiz',    'secundaria',   '3', 'A'),
  ('a1000000-0000-0000-0000-000000000006', 'Emilio',    'Castillo Pérez',  'preparatoria', '2', 'B')
ON CONFLICT DO NOTHING;

INSERT INTO public.padres (id, nombre, apellidos, email, telefono, whatsapp, alumno_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Carlos',   'Ramírez',   'c.ramirez@mail.com',  '(55) 1111-2222', '+525511112222', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'Ana',      'Morales',   'ana.morales@mail.com', '(55) 3333-4444', '+525533334444', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000003', 'Roberto',  'Cruz',      'r.cruz@mail.com',      '(55) 5555-6666', '+525555556666', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000004', 'Laura',    'Herrera',   'l.herrera@mail.com',   '(55) 7777-8888', '+525577778888', 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000005', 'Miguel',   'Jiménez',   'm.jimenez@mail.com',   '(55) 9999-0000', '+525599990000', 'a1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000006', 'Patricia', 'Castillo',  'p.castillo@mail.com',  '(55) 1212-3434', '+525512123434', 'a1000000-0000-0000-0000-000000000006')
ON CONFLICT DO NOTHING;

INSERT INTO public.pagos (padre_id, alumno_id, periodo, monto, fecha_limite, fecha_pago, estado, metodo_pago) VALUES
  ('b1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','2026-05', 3500, '2026-05-10', '2026-05-08', 'pagado',   'transferencia'),
  ('b1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000002','2026-05', 4200, '2026-05-10',  NULL,        'atrasado',  NULL),
  ('b1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000003','2026-05', 5800, '2026-05-10',  NULL,        'pendiente', NULL),
  ('b1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000004','2026-05', 3500, '2026-05-10', '2026-05-05', 'pagado',   'efectivo'),
  ('b1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000005','2026-05', 4200, '2026-05-10',  NULL,        'atrasado',  NULL),
  ('b1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000006','2026-05', 5800, '2026-05-10', '2026-05-09', 'pagado',   'tarjeta')
ON CONFLICT DO NOTHING;

-- ── Tickets (WhatsApp bot) ────────────────────────────────────
-- Un registro por número de WhatsApp (upsert en cada conversación)
CREATE TABLE IF NOT EXISTS public.tickets (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_whatsapp TEXT NOT NULL,
  nombre_padre    TEXT,
  nombre_alumno   TEXT,
  correo          TEXT,
  nivel_escolar   TEXT,
  descripcion     TEXT,
  estado          TEXT NOT NULL DEFAULT 'Nuevo',
  tipo            TEXT,
  prioridad       TEXT NOT NULL DEFAULT 'MEDIA',
  numero_negocio  TEXT,
  notas           TEXT,
  fecha_hora      TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT tickets_whatsapp_uq UNIQUE (numero_whatsapp)
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Admin autenticado puede leer/escribir todo
CREATE POLICY "auth_all_tickets" ON public.tickets
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Bot (via endpoint /api/tickets) puede hacer upsert con service_role
CREATE POLICY "anon_insert_tickets" ON public.tickets
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_update_tickets" ON public.tickets
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Trigger updated_at
DROP TRIGGER IF EXISTS trg_tickets_updated_at ON public.tickets;
CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.fn_updated_at();

CREATE INDEX IF NOT EXISTS idx_tickets_whatsapp ON public.tickets(numero_whatsapp);
CREATE INDEX IF NOT EXISTS idx_tickets_estado   ON public.tickets(estado);
CREATE INDEX IF NOT EXISTS idx_tickets_updated  ON public.tickets(updated_at DESC);
