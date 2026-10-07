-- Recuperar contraseña (7 oct 2026): enlace de un solo uso enviado por correo, válido 1 hora.
-- Se guarda solo el SHA-256 del token; el token en claro va únicamente en el correo.
-- Producción (usar --command, una sentencia por llamada; no --file con --remote):
--   el CREATE TABLE y el CREATE INDEX de abajo en una sola línea.
-- Local: wrangler d1 execute casa-test-bienestar-db --local --file=migrations/0010_recuperar_clave.sql

CREATE TABLE IF NOT EXISTS recuperaciones_clave (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expira_en TEXT NOT NULL,
  usado_en TEXT,
  creado_en TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE INDEX IF NOT EXISTS idx_recuperaciones_usuario ON recuperaciones_clave (usuario_id, creado_en);
