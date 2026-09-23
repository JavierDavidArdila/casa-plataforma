-- Reconstrucción del esquema para DESARROLLO LOCAL únicamente (emulado por
-- nitro-cloudflare-dev en .wrangler/state, vía `wrangler d1 execute --local`).
-- NO correr esto contra --remote: esa base ya tiene usuarios reales y su
-- esquema real vive solo en Cloudflare (no hay migraciones versionadas de
-- origen en este repo). Las columnas de abajo son las que el código en
-- server/api/*.ts y server/utils/auth.ts efectivamente usa.

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  apellido TEXT,
  edad INTEGER,
  fecha_nacimiento TEXT,
  genero TEXT,
  email TEXT UNIQUE,
  movil TEXT,
  pais_origen TEXT,
  pais_residencia TEXT,
  ciudad TEXT,
  a_quien_ayudas TEXT,
  hace_cuanto_vives_fuera TEXT,
  password_hash TEXT,
  password_salt TEXT,
  suscrito INTEGER DEFAULT 0,
  incluye_libro INTEGER DEFAULT 0,
  codigo_usuario TEXT,
  creado_en TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sesiones (
  token TEXT PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  expira_en TEXT NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS respuestas_test (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  anios_cuidando TEXT,
  mayor_aporte TEXT,
  interlocutores TEXT,
  comunicacion TEXT,
  p5 INTEGER,
  p6 INTEGER,
  p7 INTEGER,
  p8 INTEGER,
  p9 INTEGER,
  naturaleza_relacion TEXT,
  p11 INTEGER,
  p12 INTEGER,
  p13 INTEGER,
  p14 INTEGER,
  p15 INTEGER,
  puntaje_iecd INTEGER,
  resultado TEXT,
  pilar_principal TEXT,
  creado_en TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
