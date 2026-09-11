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
pnpm dev
```

Abre `http://localhost:3000`.

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
(ver `server/utils/auth.ts` y `server/api/test-bienestar.post.ts`).

Consultar datos guardados:

```bash
npx wrangler d1 execute casa-test-bienestar-db --remote \
  --command "SELECT * FROM usuarios ORDER BY creado_en DESC LIMIT 20;"
```
