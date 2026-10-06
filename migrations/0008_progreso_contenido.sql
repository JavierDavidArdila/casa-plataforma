-- Recorrido de cada contenido (pedido del cliente, 5 oct 2026): ver el video → descargar la guía PDF
-- → responder las 3 preguntas → correo de felicitación.
-- Producción (usar --command, una sentencia por llamada; no --file con --remote):
--   el CREATE TABLE de abajo en una sola línea.
-- Local: wrangler d1 execute casa-test-bienestar-db --local --file=migrations/0008_progreso_contenido.sql

CREATE TABLE IF NOT EXISTS progreso_contenido (
  usuario_id INTEGER NOT NULL,
  video TEXT NOT NULL,
  visto_en TEXT,
  guia_en TEXT,
  preguntas_en TEXT,
  correo_enviado_en TEXT,
  PRIMARY KEY (usuario_id, video)
);
