# Plataforma C.A.S.A.

Plataforma C.A.S.A. — Del Cuidado a Distancia: test de bienestar, cuenta,
suscripción y contenidos (videos) para cuidadores a distancia. Independiente
del sitio principal `ahorasoypapademispapas`, pero mantiene cercanía de marca
(paleta de color, tipografías) con él.

El "Test de Bienestar C.A.S.A." fue el primer módulo construido; vivía dentro
de `ahorasoypapademispapas` y se separó a este proyecto propio con su propio
Worker y base D1.

## Desarrollo

```bash
pnpm install
pnpm run db:local:setup   # solo la primera vez: crea el esquema en la D1 local (.wrangler/state)
pnpm dev
```

Abre la URL que imprima `pnpm dev` (usa 3000 si está libre; si no, el siguiente puerto disponible).

El módulo `nitro-cloudflare-dev` emula los bindings de Cloudflare (D1 incluido)
en desarrollo local — sin él, `nuxt dev` no tiene `event.context.cloudflare.env`
y los endpoints que dependen de la base de datos (registro, login, test,
pago) fallan. Esa base local es independiente de la remota (no comparte
datos ni esquema versionado — ver sección "Base de datos" abajo).

## Deploy

```bash
pnpm deploy
```

Esto compila el sitio (`nuxt build`) y despliega con `wrangler deploy` al
Worker `casa-plataforma` (plan gratuito de Cloudflare Workers).

## Flujo implementado

`/` (landing) → `/registrarse` (pre-inscripción, 12 campos) → `/test` (test
de bienestar) → resultado → "¿Ingresar a la plataforma?" → `/crear-cuenta`
(contraseña) → `/pago` (**simulado**, sin pasarela real todavía) → asigna
código de usuario de 6 dígitos → `/contenidos` (video por suscripción).
`/iniciar-sesion` para volver a entrar con el código de usuario.

Inscripción y referidos (Word del cliente, oct 2026): `/registrarse` captura los datos ampliados
(listas en `app/data/ubicaciones.ts`). Los primeros `CUPO_GRATIS` (100, en `shared/utils/cupo.ts`) que crean su cuenta quedan
activos sin pagar (`usuarios.acceso_gratis`); del siguiente en adelante se muestra `/pago`. `/referidos` (tras el video
SOSTENER) guarda tres referidos y cómo llegó el usuario en `referidos_envios` y `referidos`. Migración: `migrations/0007_*.sql`.
Preguntas abiertas para el cliente: `PENDIENTES-CLIENTE.md`.

Diseños de referencia (moodboard, Principal 1/2, Iniciar sesión) en `diseno/`.

Pendiente / no incluido todavía:
- Pasarela de pago real (queda un módulo aislado en `server/api/pago.post.ts`
  listo para reemplazar por la integración real).
- Envío de correos transaccionales (Resend) — no hay `RESEND_API_KEY`
  configurada aún.
- Videos reales (Cloudflare Stream) — hoy son placeholders visuales.
- Evaluación 1-5 + solicitud de referidos + certificación final.
- Confirmar con el cliente si la pregunta "¿Hace cuánto tiempo llevas
  apoyando o cuidando a la distancia? (1-50 años)" reemplaza la pregunta 1
  actual del test o es una pregunta adicional.

## Base de datos

Usa la base D1 `casa-test-bienestar-db` (nombre heredado del módulo original;
no se renombró porque ya tiene respuestas reales de usuarios y D1 no soporta
renombrar bases in situ). Tablas: `usuarios`, `sesiones`, `respuestas_test`
(ver `server/utils/auth.ts` y `server/api/test-bienestar.post.ts`), más
`comparte_respuestas` (ver `server/api/comparte.post.ts`).

El esquema real de la base remota no está versionado en este repo (se creó a
mano antes de tener migraciones). `migrations/0000_schema_local.sql` es una
reconstrucción de las columnas que el código usa, solo para desarrollo local
(`--local`) — **no correrla con `--remote`**, la base remota ya existe y tiene
datos reales. `migrations/0001_comparte.sql` sí es nueva y falta aplicarla
también en remoto:

```bash
npx wrangler d1 execute casa-test-bienestar-db --remote --file=migrations/0001_comparte.sql
```

Consultar datos guardados:

```bash
npx wrangler d1 execute casa-test-bienestar-db --remote \
  --command "SELECT * FROM usuarios ORDER BY creado_en DESC LIMIT 20;"
```
