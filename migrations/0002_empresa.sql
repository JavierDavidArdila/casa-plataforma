-- Campo "Empresa" del formulario Registrarse (Figma). Columna nullable: no afecta usuarios existentes.
-- Aplicada a producción el 2026-09-23:
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "ALTER TABLE usuarios ADD COLUMN empresa TEXT"
-- Para desarrollo local (después de 0000_schema_local.sql):
--   npx wrangler d1 execute casa-test-bienestar-db --local --command "ALTER TABLE usuarios ADD COLUMN empresa TEXT"

ALTER TABLE usuarios ADD COLUMN empresa TEXT;
