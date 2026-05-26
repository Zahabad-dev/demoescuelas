-- ============================================================
-- Instituto San Ángel — Schema PostgreSQL
-- Railway PostgreSQL compatible
-- Ejecutar en Railway > Data > Query
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Usuarios del sistema (administradores) ──────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre        TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol           TEXT NOT NULL DEFAULT 'admin' CHECK (rol IN ('admin', 'director', 'secretaria')),
  activo        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Alumnos ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alumnos (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
CREATE TABLE IF NOT EXISTS padres (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre     TEXT NOT NULL,
  apellidos  TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  telefono   TEXT,
  whatsapp   TEXT,
  alumno_id  UUID REFERENCES alumnos(id) ON DELETE SET NULL,
  activo     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Pagos / Colegiaturas ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS pagos (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  padre_id     UUID NOT NULL REFERENCES padres(id),
  alumno_id    UUID NOT NULL REFERENCES alumnos(id),
  concepto     TEXT NOT NULL DEFAULT 'Colegiatura mensual',
  periodo      TEXT NOT NULL,       -- formato: YYYY-MM  ej. 2026-05
  monto        NUMERIC(10, 2) NOT NULL,
  fecha_limite DATE NOT NULL,
  fecha_pago   DATE,
  estado       TEXT NOT NULL DEFAULT 'pendiente'
               CHECK (estado IN ('pagado', 'pendiente', 'atrasado')),
  metodo_pago  TEXT CHECK (metodo_pago IN ('efectivo', 'transferencia', 'tarjeta', 'cheque', NULL)),
  referencia   TEXT,
  notas        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Trigger updated_at ───────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pagos_updated_at ON pagos;
CREATE TRIGGER trg_pagos_updated_at
  BEFORE UPDATE ON pagos
  FOR EACH ROW EXECUTE FUNCTION fn_updated_at();

-- ── Índices ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_pagos_estado    ON pagos(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_periodo   ON pagos(periodo);
CREATE INDEX IF NOT EXISTS idx_pagos_alumno    ON pagos(alumno_id);
CREATE INDEX IF NOT EXISTS idx_pagos_padre     ON pagos(padre_id);
CREATE INDEX IF NOT EXISTS idx_padres_alumno   ON padres(alumno_id);

-- ── Vista útil para n8n ──────────────────────────────────────
CREATE OR REPLACE VIEW v_pagos_detalle AS
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
  a.nombre || ' ' || a.apellidos AS alumno_nombre,
  a.nivel,
  a.grado,
  a.grupo,
  pad.nombre || ' ' || pad.apellidos AS padre_nombre,
  pad.email   AS padre_email,
  pad.telefono,
  pad.whatsapp
FROM pagos p
JOIN alumnos a   ON a.id = p.alumno_id
JOIN padres pad  ON pad.id = p.padre_id;

-- ── Datos de ejemplo (demo) ───────────────────────────────────
-- Usuario admin (contraseña: Admin123!)
-- Hash generado con bcryptjs rounds=10
INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES
  ('Director Admin', 'admin@institutosanangel.edu.mx',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;
-- NOTA: Cambia la contraseña del admin en producción usando:
-- SELECT crypt('TuNuevaContraseña', gen_salt('bf')) o genera el hash con bcryptjs

-- Alumnos de ejemplo
INSERT INTO alumnos (id, nombre, apellidos, nivel, grado, grupo) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Sofía',     'Ramírez Torres',  'primaria',     '3', 'A'),
  ('a1000000-0000-0000-0000-000000000002', 'Diego',     'Morales Vega',    'secundaria',   '2', 'B'),
  ('a1000000-0000-0000-0000-000000000003', 'Valentina', 'Cruz López',      'preparatoria', '1', 'C'),
  ('a1000000-0000-0000-0000-000000000004', 'Mateo',     'Herrera Santos',  'primaria',     '5', 'A'),
  ('a1000000-0000-0000-0000-000000000005', 'Isabella',  'Jiménez Ruiz',    'secundaria',   '3', 'A'),
  ('a1000000-0000-0000-0000-000000000006', 'Emilio',    'Castillo Pérez',  'preparatoria', '2', 'B')
ON CONFLICT DO NOTHING;

-- Padres de ejemplo
INSERT INTO padres (id, nombre, apellidos, email, telefono, whatsapp, alumno_id) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Carlos',   'Ramírez',   'c.ramirez@mail.com',   '(55) 1111-2222', '+525511112222', 'a1000000-0000-0000-0000-000000000001'),
  ('b1000000-0000-0000-0000-000000000002', 'Ana',      'Morales',   'ana.morales@mail.com',  '(55) 3333-4444', '+525533334444', 'a1000000-0000-0000-0000-000000000002'),
  ('b1000000-0000-0000-0000-000000000003', 'Roberto',  'Cruz',      'r.cruz@mail.com',       '(55) 5555-6666', '+525555556666', 'a1000000-0000-0000-0000-000000000003'),
  ('b1000000-0000-0000-0000-000000000004', 'Laura',    'Herrera',   'l.herrera@mail.com',    '(55) 7777-8888', '+525577778888', 'a1000000-0000-0000-0000-000000000004'),
  ('b1000000-0000-0000-0000-000000000005', 'Miguel',   'Jiménez',   'm.jimenez@mail.com',    '(55) 9999-0000', '+525599990000', 'a1000000-0000-0000-0000-000000000005'),
  ('b1000000-0000-0000-0000-000000000006', 'Patricia', 'Castillo',  'p.castillo@mail.com',   '(55) 1212-3434', '+525512123434', 'a1000000-0000-0000-0000-000000000006')
ON CONFLICT DO NOTHING;

-- Pagos de ejemplo (período actual)
INSERT INTO pagos (padre_id, alumno_id, periodo, monto, fecha_limite, fecha_pago, estado, metodo_pago) VALUES
  ('b1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000001','2026-05', 3500, '2026-05-10', '2026-05-08', 'pagado',   'transferencia'),
  ('b1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000002','2026-05', 4200, '2026-05-10', NULL,         'atrasado',  NULL),
  ('b1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000003','2026-05', 5800, '2026-05-10', NULL,         'pendiente', NULL),
  ('b1000000-0000-0000-0000-000000000004','a1000000-0000-0000-0000-000000000004','2026-05', 3500, '2026-05-10', '2026-05-05', 'pagado',   'efectivo'),
  ('b1000000-0000-0000-0000-000000000005','a1000000-0000-0000-0000-000000000005','2026-05', 4200, '2026-05-10', NULL,         'atrasado',  NULL),
  ('b1000000-0000-0000-0000-000000000006','a1000000-0000-0000-0000-000000000006','2026-05', 5800, '2026-05-10', '2026-05-09', 'pagado',   'tarjeta')
ON CONFLICT DO NOTHING;
