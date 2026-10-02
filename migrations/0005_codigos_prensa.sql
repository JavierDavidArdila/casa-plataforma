-- `max_usos` = máximo de ingresos (canjes) por código; se cuenta en `usos`.
-- Códigos de acceso para prensa (uno por tarjeta impresa). Al canjearlo se crea un
-- usuario "de prensa" suscrito y una sesión que vence en `vence_en` (primer canje +
-- `dias_acceso`). Desactivar = poner activo = 0 y borrar sus sesiones (ver README).
-- Producción (usar --command, no --file):
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "CREATE TABLE IF NOT EXISTS codigos_prensa (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT NOT NULL UNIQUE, medio TEXT, dias_acceso INTEGER NOT NULL DEFAULT 90, max_usos INTEGER NOT NULL DEFAULT 5, activo INTEGER NOT NULL DEFAULT 1, usuario_id INTEGER, canjeado_en TEXT, vence_en TEXT, usos INTEGER NOT NULL DEFAULT 0, creado_en TEXT DEFAULT (datetime('now')))"

CREATE TABLE IF NOT EXISTS codigos_prensa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  medio TEXT,
  dias_acceso INTEGER NOT NULL DEFAULT 90,
  max_usos INTEGER NOT NULL DEFAULT 5,
  activo INTEGER NOT NULL DEFAULT 1,
  usuario_id INTEGER,
  canjeado_en TEXT,
  vence_en TEXT,
  usos INTEGER NOT NULL DEFAULT 0,
  creado_en TEXT DEFAULT (datetime('now'))
);
