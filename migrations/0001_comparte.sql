-- Tabla para el feedback del panel "Comparte" (detalle de cada video en /contenidos/[slug]).
-- No se aplica sola: correr manualmente contra la base D1 `casa-test-bienestar-db`, por ejemplo:
--   npx wrangler d1 execute casa-test-bienestar-db --remote --file=migrations/0001_comparte.sql

CREATE TABLE IF NOT EXISTS comparte_respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  video TEXT NOT NULL,
  que_sirvio TEXT,
  que_profundizar TEXT,
  otro_tema TEXT,
  creado_en TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
