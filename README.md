# Test de Bienestar C.A.S.A.

Encuesta independiente del "Test de Bienestar C.A.S.A." (antes vivía dentro de
`ahorasoypapademispapas`, se separó a este proyecto propio con su propio
Worker y base D1).

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
Worker `casa-test-bienestar` (plan gratuito de Cloudflare Workers).

## Base de datos

Usa la base D1 `casa-test-bienestar-db` (ya existía, creada para este mismo
propósito). Ver el esquema de la tabla `respuestas_test` en el propio
`server/api/test-bienestar.post.ts`.

Consultar respuestas guardadas:

```bash
npx wrangler d1 execute casa-test-bienestar-db --remote \
  --command "SELECT * FROM respuestas_test ORDER BY creado_en DESC LIMIT 20;"
```
