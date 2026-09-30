-- Casilla "Acepto envío de información sobre el contenido, publicidad y de aliados de C.A.S.A."
-- (igual que en ahorasoypapademispapas.com). 0 = no aceptó / usuarios anteriores, 1 = aceptó.
-- Producción (usar --command, no --file):
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "ALTER TABLE usuarios ADD COLUMN acepta_comunicaciones INTEGER DEFAULT 0"
--   npx wrangler d1 execute casa-test-bienestar-db --remote --command "ALTER TABLE usuarios ADD COLUMN acepta_comunicaciones_en TEXT"
-- Local (después de 0000_schema_local.sql): mismos comandos con --local.

ALTER TABLE usuarios ADD COLUMN acepta_comunicaciones INTEGER DEFAULT 0;
ALTER TABLE usuarios ADD COLUMN acepta_comunicaciones_en TEXT;
