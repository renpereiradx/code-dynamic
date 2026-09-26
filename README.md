# Code Dynamic — Website corporativo

Empresa de desarrollo de software. Monorepo preparado para frontend + backend futuro.

```
code-dynamic/
├── frontend/       # Astro + React + TypeScript + Tailwind (site ES/EN, dark-first)
├── backend/        # Placeholder Golang (API futura, no se usa en v1)
├── docs/           # Plan del proyecto
└── design-system/  # MASTER.md — fuente de verdad visual
```

## Requisitos

- Node >= 22.12, npm >= 10
- Go >= 1.22 (solo cuando se active `backend/`)

## Desarrollo frontend

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
cd frontend
npm run build
npm run preview
```

## Deploy — Cloudflare Pages (plan gratuito)

Sitio 100% estático (`frontend/dist/`), sin adapter SSR. Headers en `frontend/public/_headers`.

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name code-dynamic
```

Requiere auth una vez: `npx wrangler login` o `CLOUDFLARE_API_TOKEN` (permiso
Account → Cloudflare Pages → Edit) + `CLOUDFLARE_ACCOUNT_ID`.
URL resultante: `https://code-dynamic.pages.dev` (dominio propio configurable
gratis en el dashboard de Cloudflare).

## Diseño

Ver `design-system/MASTER.md` y `docs/PLAN.md`.

Filosofía: minimalismo Apple (aire, tipografía, bento, scrollytelling) + acento sutil Google
(Material 3 Expressive: píldoras, color azul, micro-interacciones amables). Dark-first con modo claro.
