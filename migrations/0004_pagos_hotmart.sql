-- Registro de los avisos (webhooks) de Hotmart: sirve de auditoría, de idempotencia
-- (Hotmart reintenta) y para activar a quien pagó antes de crear su cuenta.
-- Producción (usar --command, no --file):
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "CREATE TABLE IF NOT EXISTS pagos_hotmart (id INTEGER PRIMARY KEY AUTOINCREMENT, transaccion TEXT NOT NULL, evento TEXT NOT NULL, email TEXT NOT NULL, usuario_id INTEGER, payload TEXT, recibido_en TEXT DEFAULT (datetime('now')), UNIQUE (transaccion, evento))"
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "CREATE INDEX IF NOT EXISTS idx_pagos_hotmart_email ON pagos_hotmart (email)"

CREATE TABLE IF NOT EXISTS pagos_hotmart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaccion TEXT NOT NULL,
  evento TEXT NOT NULL,
  email TEXT NOT NULL,
  usuario_id INTEGER,
  payload TEXT,
  recibido_en TEXT DEFAULT (datetime('now')),
  UNIQUE (transaccion, evento)
);
CREATE INDEX IF NOT EXISTS idx_pagos_hotmart_email ON pagos_hotmart (email);
