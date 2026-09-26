# PLAN — Website Code Dynamic (v1 frontend)

Fecha: 2026-09-26. Stack: Git + Astro + React + TypeScript + Tailwind. i18n ES/EN. Dark-first.

## 0. Decisiones tomadas con el cliente

- Idioma: ES + EN desde el inicio.
- Servicios v1: desarrollo general + IA/automatización.
- Visual: Apple minimal + acento Google, dark-first, logo temporal tipográfico/SVG.
- Estructura: monorepo (`frontend/` + `backend/` stub Go).
- Contacto v1: simple, solo email real `codedynamic@gmail.com` (formulario mock local).
- Redes sociales: ocultas hasta tener URLs reales.
- Casos/Testimonios: ocultos hasta tener contenido real (textos demo conservados en i18n).
- Dominio propio: pendiente (se sigue en `code-dynamic.pages.dev`).

## 0.1 Historial de pasos

- Paso 1: commit inicial (`feat: website v1…`).
- Paso 2: deploy Cloudflare Pages gratis → https://code-dynamic.pages.dev
  (estático, `_headers`, sin adapter SSR).
- Paso 3: contenido real parcial (email, ocultar redes/casos/testimonios).

## 1. Fuentes de diseño aplicadas

### 1.1 ui-ux-pro-max-skill (nextlevelbuilder)

Metodología adoptada: **Design System Generator** — todo UI debe salir de
`design-system/MASTER.md` (Pattern + Style + Colors + Typography + Effects +
Anti-patterns + Pre-delivery checklist). Reglas relevantes para
"Developer Tool / Agency / B2B Service":

- Pattern: Hero-Centric + Bento Features + Social Proof + Proceso + CTA final.
- 79 estilos: se elige **Minimalism + Bento Grid + Liquid Glass refinado (Apple)**
  con toque **Material 3 Expressive (Google)** solo en acentos.
- 192 paletas: fríos premium dark-first, un solo acento saturado para CTA.
- Tipografía: 1 familia variable display + 1 body + mono para code accents.
- Anti-patterns del skill respetados: sin emojis como iconos (SVG Lucide),
  `cursor-pointer` en clickables, timing por plataforma, contraste AA,
  `prefers-reduced-motion`, reflow sin clipping, responsive 375/768/1024/1440.

### 1.2 Tendencias web 2025/2026 investigadas (Figma, Envato, Webflow, NN/g, Google)

1. **Bento grids** — patrón dominante 2026 (Apple → SaaS). Jerarquía 1 grande +
   2 medianas + N pequeñas, contenido real, gutters consistentes.
2. **Tipografía cinética + variable** — display oversize como layout, 1 archivo
   variable, `clamp()` fluido, animación sutil de peso/espaciado.
3. **Scroll-driven animations CSS nativas** (`animation-timeline`, `view()`) —
   sin GSAP por defecto; Framer Motion solo para islas que lo justifiquen.
4. **View Transitions API** — transiciones de ruta/estado estilo app nativa.
5. **Motion con propósito** — micro-interacciones 200–400 ms, feedback <100 ms,
   skeleton > spinner, sin scroll-hijacking, respetar `prefers-reduced-motion`.
6. **Glassmorphism 2.0 / Liquid Glass** — solo en nav/sticky/overlays, con
   guards de contraste, no como fondo general.
7. **Dark-first + light** — `prefers-color-scheme` + toggle, contraste AA.
8. **Islands / Partial Hydration** — Astro renderiza estático, hidrata solo
   Nav, toggle tema/idioma, bento interactivo, formulario mock.
9. **Performance como estética** — presupuesto ~300 KB landing, 1 familia
   variable self-hosted, INP ≤200 ms, LCP <2.5 s, CLS <0.1.
10. **WCAG 2.2 AA + SEO** — foco visible, navegación teclado, meta/OG,
    sitemap, semantic HTML.
11. **Minimalismo emocional + single-page storytelling** — home narrativa
    larga (problema → solución → prueba → CTA), copy corto.

## 2. Arquitectura

```
frontend/src/
├── layouts/Layout.astro      # <head>, SEO, theme, nav, footer
├── components/               # Astro estáticos (Hero, Bento, Proceso, CTA…)
├── components/react/         # Islas: ThemeToggle, LangSwitch, ContactForm mock, TiltCard
├── i18n/{es,en}.ts           # diccionarios
├── pages/
│   ├── index.astro           # redirect → /es/
│   ├── es/index.astro        # home ES
│   └── en/index.astro        # home EN
├── styles/global.css         # tokens Tailwind v4 (@theme) + keyframes
└── assets/logo.svg
```

- Rutas v1: `/es/`, `/en/` (+ 404). Secundarias (`/servicios`, `/nosotros`)
  se añaden solo si el contenido real lo exige; v1 prioriza one-page storytelling.
- Contacto: `mailto:hola@codedynamic.dev` + LinkedIn/GitHub/X placeholders.
  Formulario mock (validación cliente, sin POST; listo para `backend/` Go).

## 3. Secciones home v1 (ES/EN)

1. Nav glass sticky + switch idioma + toggle tema.
2. Hero editorial text-only + badge + 2 CTAs + stats + marquee tech.
3. Bento Servicios (6 celdas: Web, Móvil, APIs/Cloud, IA/Automatización, UI/UX, Mantenimiento).
4. Proceso (Descubrir → Diseñar → Construir → Escalar) numerado.
5. Stack strip (Astro, React, TS, Go, etc.).
6. Placeholder casos/testimonios (contenido ficticio marcado).
7. CTA final + contacto simple + footer.

## 4. Fases de ejecución

- [x] Fase 0: monorepo + git + scaffold Astro/React/Tailwind.
- [ ] Fase 1: tokens, layout, i18n, logo, estilos globales (en curso).
- [ ] Fase 2: secciones home ES/EN + páginas índice.
- [ ] Fase 3: islas React, motion, formulario mock, 404, SEO/sitemap.
- [ ] Fase 4: build, Lighthouse/CWV, checklist AA, commit inicial.

## 5. Preguntas abiertas para v2 (no bloquean v1)

- Dominio real + email corporativo.
- Redes reales (LinkedIn/GitHub/X).
- Copy definitivo y casos de éxito.
- Deploy target (Cloudflare Pages / Vercel / Netlify).
- Activar `backend/` Go (endpoint contacto).
