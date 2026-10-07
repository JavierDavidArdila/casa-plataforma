-- Embudo anónimo de visitas (lanzamiento, 6 oct 2026): páginas vistas y pasos del registro de cualquier
-- visitante, con o sin sesión. Sin IP ni datos personales: `visitante` es un id aleatorio del navegador.
-- Producción (usar --command, una sentencia por llamada; no --file con --remote):
--   el CREATE TABLE y cada CREATE INDEX de abajo en una sola línea.
-- Local: wrangler d1 execute casa-test-bienestar-db --local --file=migrations/0009_embudo.sql

CREATE TABLE IF NOT EXISTS embudo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitante TEXT NOT NULL,
  evento TEXT NOT NULL,
  ruta TEXT,
  origen TEXT,
  pais TEXT,
  dispositivo TEXT,
  creado_en TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_embudo_creado ON embudo (creado_en);
CREATE INDEX IF NOT EXISTS idx_embudo_evento ON embudo (evento, creado_en);
