-- Inscripción ampliada (Word del cliente, 2 oct 2026), cupo gratuito de los 100 primeros y referidos.
-- Producción (usar --command, una sentencia por llamada; no --file con --remote):
--   ALTER TABLE usuarios ADD COLUMN anios_cuidando TEXT
--   ALTER TABLE usuarios ADD COLUMN acceso_gratis INTEGER DEFAULT 0
--   ALTER TABLE usuarios ADD COLUMN acceso_gratis_en TEXT
--   (y los CREATE TABLE / CREATE INDEX de abajo)
-- Local: wrangler d1 execute casa-test-bienestar-db --local --file=migrations/0007_inscripcion_referidos.sql

ALTER TABLE usuarios ADD COLUMN anios_cuidando TEXT;
-- 1 = activó su suscripción dentro de los 100 primeros inscritos (sin pagar). Ver shared/utils/cupo.ts.
ALTER TABLE usuarios ADD COLUMN acceso_gratis INTEGER DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN acceso_gratis_en TEXT;

-- Un envío del formulario de referidos por usuario (quién refiere + cómo llegó a C.A.S.A.).
CREATE TABLE IF NOT EXISTS referidos_envios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL UNIQUE,
  nombre TEXT,
  apellido TEXT,
  pais_origen TEXT,
  pais_residencia TEXT,
  como_llegaste TEXT, -- 'clave' (Periodista/Invitado Especial) | 'primeros100'
  clave_acceso TEXT,
  creado_en TEXT DEFAULT (datetime('now'))
);

-- Los tres referidos de cada envío.
CREATE TABLE IF NOT EXISTS referidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  envio_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  posicion INTEGER NOT NULL,
  nombre TEXT,
  apellido TEXT,
  email TEXT,
  celular TEXT,
  creado_en TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_referidos_usuario ON referidos (usuario_id);
