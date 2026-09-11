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

## Base de datos

Usa la base D1 `casa-test-bienestar-db` (nombre heredado del módulo original;
no se renombró porque ya tiene respuestas reales de usuarios y D1 no soporta
renombrar bases in situ). Ver el esquema de la tabla `respuestas_test` en
`server/api/test-bienestar.post.ts`.

Consultar respuestas guardadas:

```bash
npx wrangler d1 execute casa-test-bienestar-db --remote \
  --command "SELECT * FROM respuestas_test ORDER BY creado_en DESC LIMIT 20;"
```
