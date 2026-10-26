# MASTER — Design System Code Dynamic

Fuente de verdad (patrón ui-ux-pro-max). Todo componente debe conformarse a este archivo.
Referencia visual: `frontend/specs/.../hybrid_bento_services_layout/` (concepto **Apple + Google**).
Overrides por página en `design-system/pages/*.md` (crear solo si desvían del master).

## 1. PATTERN: Hero-Centric + Hybrid Bento + Social Proof

- Home narrativa: Nav → Hero → Prueba (logos/stats) → Bento servicios →
  Proceso → Stack → Casos placeholder → Testimonios placeholder → CTA → Footer.
- CTA sobre el fold + repetido tras prueba social + CTA final.
- Hybrid Bento (como el spec): grid **4 columnas**, filas `minmax(180px, auto)`, gap 20px.
  1 celda ancla **2×2** (servicio estrella con visual liquid) + 1 de **2×1** (dato/métrica con
  gráfico) + celdas **1×1** (stat, feature con toggles) + 1 vertical **1×2** (terminal/stack).
  Nunca filas de celdas iguales; cada celda tiene un job distinto.
- Mobile: stack 1 col preservando jerarquía (ancla primero). Tablet: 2 cols.

## 2. STYLE: Apple structure + Google expression

- **Apple** (estructura): squircle 28px, hairlines 1px, titulares tracking-tight,
  aire generoso, jerarquía por tipo/color, sombras casi ausentes.
- **Google** (expresión): Material Symbols, píldoras fully-rounded, CTA azul sólido con
  sombra de color, chips/badges redondeados, toggles, micro-copy amable.
- Glass solo en: nav sticky (blur 16–20px + bg 60–80%), badges flotantes y terminal
  (`black/40` + blur 8px). Texto siempre AA sobre blur.
- Acento "liquid": radial-gradient del accent (40% → transparente), blur ≥60px,
  opacity 0.15–0.25 — solo en hero y celda ancla. Overlay de superficie:
  linear 135deg `white/5 → white/1`. Sin neón, sin "AI purple".

## 3. COLORS (dark-first, tint azul)

| Rol         | Dark (default)  | Light      | Nota                            |
|-------------|-----------------|------------|---------------------------------|
| bg          | #111921         | #F6F7F8    | base con tinte azul, no negro   |
| surface-1   | #161E27         | #FFFFFF    | cards bento                     |
| surface-2   | #1C242E         | #ECEEF1    | hover / inner blocks            |
| surface-3   | #252D38         | #E2E6EB    | inputs, icon buttons            |
| outline     | #36414F         | rgba(0,0,0,.10) | bordes estructurales        |
| line        | rgba(255,255,255,.05–.10) | rgba(0,0,0,.08) | hairline cards/nav   |
| text        | #F5F7FA         | #16181D    |                                 |
| muted       | #98A2B3         | #5F6B7A    | secundaria, blue-gray           |
| accent (CTA)| #308CE8        | #1A6FB0    | 1 solo acento                   |
| accent-text | #8FC4F4         | #1A6FB0    | texto corrido en acento (AA)    |
| accent-ink  | #FFFFFF         | #FFFFFF    | texto sobre CTA                 |
| ok          | #34D399         | #188038    | status dots, "Operational"      |
| warn        | #FFB224         | #E37400    | sutil                           |

Contraste: blanco sobre #308CE8 ≈ 3.5:1 → solo UI/botones (≥3:1, texto ≥15px/600);
texto normal en acento usar `accent-text` (≥7:1 sobre dark). Links accent sobre bg ≈ 5:1 OK.
Light: blanco sobre #1A6FB0 ≈ 5.3:1 AA.

## 4. TYPOGRAPHY (variable, 1–2 familias)

- Display: **Inter 700–800**, tracking-tight (−0.02 a −0.04em). Inter Tight variable
  aceptado como variante display. Hero `clamp(2.75rem, 1rem + 6vw, 5rem)`.
- Body: **Inter 400/500/600**, `1rem–1.125rem`, line-height 1.6.
- Micro-labels (stats): 11–12px, 600, **uppercase, tracking-wider**, muted — como en el spec.
- Mono: `ui-monospace, SFMono-Regular, Menlo` (JetBrains Mono opcional) para terminal
  y labels técnicas (`_api.go`, `$ deploy`), 12px.
- Escala modular 1.25. Sin tamaños bespoke por sección.
- Google Fonts self-hosted en v2; v1 usa system stack + @fontsource si cabe en presupuesto.

## 5. SPACING / RADIUS / LAYOUT

- Container: **max-w 1400px**, px 16–32. Secciones py 80–128.
- Header de sección: título grande tracking-tight + subtítulo muted a la izquierda,
  acciones en píldoras a la derecha (como "Customize" / "New Service" del spec).
- Radius: cards **28px (squircle)**, inner elements 12–16px, pills/botones/chips 999px,
  icon buttons cuadrados 12–16px o círculos.
- Bento: `repeat(4, 1fr)` desktop, `auto-rows: minmax(180px, auto)`, gap 20px;
  spans según §1. Bordes: hairline `white/5` en cards; hover `accent/30`.
- Sombras — solo 3 usos permitidos: elevación nav/modal, celda ancla (`shadow-2xl`
  suave), y sombra de color en CTA (`accent/25` → `accent/40` hover). Nada más.

## 6. KEY EFFECTS (motion con propósito, 2026)

- Duraciones: micro 150–250 ms, reveal 300–500 ms, `cubic-bezier(.22,1,.36,1)` (Apple ease).
- Hover bento: `translateY(-2/−3px)` + borde `accent/30`. Icon buttons: `group-hover:scale-105/110`.
- CTA: hover `-translate-y-0.5` + shadow `accent/40`; press `active:scale-95`.
- Status dots con glow `0 0 8px` (ok) + pulse lento (≥2s) solo si es dato en vivo.
- Reveal on scroll: `opacity + translateY(16px)`, stagger 60–80 ms, una vez (`once`).
- Scroll-driven CSS (`animation-timeline: view()/scroll()`) para progress bar y parallax sutil.
- `View Transitions API` en cambio de idioma/tema (con fallback).
- Noise: textura ≤5% opacity solo en hero/ancla, inline SVG data-URI (nunca URL externa).
- Skeleton screens para carga diferida. Feedback acción <100 ms.
- **Reducido**: `@media (prefers-reduced-motion: reduce)` desactiva parallax/stagger/pulse/glow.

## 7. ICONS / LOGO

- Iconos: **Material Symbols Outlined** (variable: wght 400–500, FILL 0–1), 20–24px.
  Regla Google: FILL 0 en reposo → FILL 1 en hover/activo (iconos interactivos).
  Cargar con `display=swap` + preconnect, o self-host con subset de glifos usados.
- Prohibidos emojis como iconos; todo icono con `aria-hidden` o label accesible.
- Logo temp v1: marca tipográfica — cuadrado redondeado con `</>` + "Code Dynamic".
  `frontend/src/assets/logo.svg` + favicon derivado.

## 8. COMPONENTS (vocabulario del spec)

- **Nav**: sticky, glass (bg 60–80% + blur 16–20px + hairline bottom), links píldora
  `rounded-full` con hover `white/5`, altura 64px.
- **Celda ancla**: badge chip glass (`white/10 + blur + border white/10`), título grande,
  visual liquid radial, fila de stats con micro-labels + hairline superior.
- **Stat card**: icono muted → accent en hover, número 4xl bold tracking-tight, label muted.
- **Terminal card**: `black/40 + blur 8px`, traffic dots (red/yellow/emerald al 80%),
  título mono `white/40`, prompt `➜` emerald, logs `white/50` 12px.
- **Toggles**: Material 44×26 pill, thumb 16px, on=accent / off=outline.
- **Chips/badges**: pill `white/10` glass (dark) o `ok/10` con texto ok ("4 Online").
- **Botones**: CTA pill accent + shadow de color; secundario pill `surface-3` + hairline.

## 9. AVOID (anti-patterns)

Neón/AI gradients · glass generalizado ilegible · sombras en cada card · scroll-hijacking ·
spinners genéricos · animación decorativa que bloquee INP · 5 familias de fuentes ·
bento con celdas iguales y copy genérico · texto bajo contraste sobre blur · textura
externa por URL · emojis como iconos · glow decorativo sin significado de estado.

## 10. PRE-DELIVERY CHECKLIST

- [ ] Sin emojis como iconos; Material Symbols con `aria-hidden` o label accesible.
- [ ] `cursor-pointer` en todo clickable; foco visible `:focus-visible`.
- [ ] Contraste AA verificado (texto 4.5:1) incl. sobre superficies con tinte azul y blur.
- [ ] `prefers-reduced-motion` respetado (parallax/stagger/pulse/glow off).
- [ ] Texto reflow sin clipping a 320px, zoom 200%, spacing override.
- [ ] Responsive: 375 / 768 / 1024 / 1440 probados (bento 1→2→4 cols).
- [ ] INP ≤200 ms, LCP <2.5 s, CLS <0.1 (Lighthouse móvil); subset de iconos fonts.
- [ ] SEO: title/desc ES+EN, OG, lang correcto, sitemap.
- [ ] i18n completo: sin strings hardcodeados fuera del diccionario.
