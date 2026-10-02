-- Accesos de invitado y prensa: tipo de código, registro de ingresos, eventos de uso y opiniones.
-- Todo se aplica en producción con --command, una sentencia por llamada (no --file con --remote):
--   ALTER TABLE codigos_prensa RENAME TO codigos_acceso
--   ALTER TABLE codigos_acceso ADD COLUMN tipo TEXT NOT NULL DEFAULT 'prensa'
--   ALTER TABLE sesiones ADD COLUMN acceso_id INTEGER
--   (y los CREATE TABLE / CREATE INDEX de abajo)

ALTER TABLE codigos_prensa RENAME TO codigos_acceso;
ALTER TABLE codigos_acceso ADD COLUMN tipo TEXT NOT NULL DEFAULT 'prensa'; -- 'prensa' | 'invitado'
ALTER TABLE sesiones ADD COLUMN acceso_id INTEGER;

-- Un registro por canje del código (cada ingreso): quién, desde dónde y con qué.
CREATE TABLE IF NOT EXISTS accesos_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_id INTEGER NOT NULL,
  usuario_id INTEGER,
  tipo TEXT,
  ip TEXT,
  pais TEXT,
  region TEXT,
  ciudad TEXT,
  asn INTEGER,
  zona_horaria TEXT,
  user_agent TEXT,
  idioma TEXT,
  referer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  origen_ruta TEXT,
  creado_en TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_accesos_log_codigo ON accesos_log (codigo_id);

-- Qué hace cada sesión de acceso: páginas, videos (inicio / progreso / fin) y opiniones.
CREATE TABLE IF NOT EXISTS eventos_uso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  acceso_id INTEGER NOT NULL,
  codigo_id INTEGER NOT NULL,
  usuario_id INTEGER,
  evento TEXT NOT NULL,
  ruta TEXT,
  video TEXT,
  posicion_seg REAL,
  duracion_seg REAL,
  porcentaje REAL,
  creado_en TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_eventos_uso_codigo ON eventos_uso (codigo_id, evento);

-- Opinión por video (¿te gustó? + mensaje). `respuestas` guarda en JSON campos extra
-- cuando el cliente confirme el formulario definitivo.
CREATE TABLE IF NOT EXISTS opiniones_acceso (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL,
  tipo TEXT,
  video TEXT NOT NULL,
  me_gusto INTEGER,
  mensaje TEXT,
  respuestas TEXT,
  creado_en TEXT DEFAULT (datetime('now')),
  UNIQUE (usuario_id, video)
);
