# MASTER — Design System Code Dynamic

Fuente de verdad (patrón ui-ux-pro-max). Todo componente debe conformarse a este archivo.
Overrides por página en `design-system/pages/*.md` (crear solo si desvían del master).

## 1. PATTERN: Hero-Centric + Bento + Social Proof

- Home narrativa: Nav → Hero → Prueba (logos/stats) → Bento servicios →
  Proceso → Stack → Casos placeholder → Testimonios placeholder → CTA → Footer.
- CTA sobre el fold + repetido tras prueba social + CTA final.
- Bento: 1 celda grande (IA/Automatización) + 2 medianas + 3 pequeñas, gutters 16–24px.

## 2. STYLE: Apple Minimal + Liquid Glass sutil + acento Material 3 Expressive

- Base Apple: aire generoso, bordes nítidos, jerarquía por tipo/color (no sombras pesadas).
- Glass solo en: nav sticky, badges flotantes, overlays. Blur 12–16px + borde 1px
  `white/10` + guard de contraste (texto siempre AA sobre blur).
- Toque Google: píldoras fully-rounded, CTA azul sólido, iconos redondeados,
  micro-copy amable. Sin degradados neón, sin "AI purple".

## 3. COLORS (dark-first)

| Rol        | Dark (default) | Light        | Nota                    |
|------------|----------------|--------------|-------------------------|
| bg         | #0A0A0B        | #FAFAF8      | warm white en light     |
| surface    | #131316        | #FFFFFF      | cards bento             |
| surface-2  | #1C1C21        | #F4F4F2      | hover / code blocks     |
| text       | #F5F5F7        | #1D1D1F      | Apple grays             |
| muted      | #A1A1AA        | #6E6E73      | secundaria              |
| line       | rgba(255,255,255,.08) | rgba(0,0,0,.08) | hairlines          |
| accent (CTA) | #2E7CF6      | #1A73E8      | Google blue, 1 solo acento |
| accent-ink | #FFFFFF        | #FFFFFF      | texto sobre CTA         |
| ok         | #34C759        | #188038      | sutil, estados          |
| warn       | #FF9F0A        | #E37400      | sutil                   |

Contraste: texto normal ≥4.5:1, grande ≥3:1. CTA blanco sobre #2E7CF6 ≈ 4.6:1 OK.

## 4. TYPOGRAPHY (variable, 1–2 familias)

- Display: **"Inter Tight" variable** (700–800, tracking -0.04em → -0.02em).
  Hero `clamp(2.75rem, 1rem + 6vw, 5.5rem)`. Alternativa sistema: `-apple-system`.
- Body: **"Inter" variable** (400/500/600), `1rem–1.125rem`, line-height 1.6.
- Mono accents: **"JetBrains Mono"** o `ui-monospace` para labels técnicas (`_api.go`, `$ deploy`).
- Escala modular 1.25 (display/h1/h2/h3/body/caption). Sin tamaños bespoke por sección.
- Google Fonts self-hosted en v2; v1 usa system stack + @fontsource si cabe en presupuesto.

## 5. SPACING / RADIUS / LAYOUT

- Container: max-w-6xl (72rem), px 20–32. Secciones py 88–128.
- Radius: cards 20–24px (Apple), pills 999px (Google), botones 14px o pill.
- Grid bento: `grid-template-columns: repeat(6, 1fr)` desktop; celdas span 4/2, 3/3, 2/2/2.
  Mobile: stack 1 col preservando jerarquía.
- Bordes: 1px hairline + inner highlight sutil. Sombras mínimas (solo elevación nav/modal).

## 6. KEY EFFECTS (motion con propósito, 2026)

- Duraciones: micro 150–250 ms, reveal 300–500 ms, `cubic-bezier(.22,1,.36,1)` (Apple ease).
- Reveal on scroll: `opacity + translateY(16px)`, stagger 60–80 ms, una vez (`once`).
- Scroll-driven CSS (`animation-timeline: view()`) para progress bar y hero parallax sutil.
- `View Transitions API` en cambio de idioma/tema (con fallback).
- Hover bento: `translateY(-2px)` + borde accent/40 + cursor-pointer. Botón CTA: scale .98 on press.
- Skeleton screens para cualquier carga diferida. Feedback acción <100 ms.
- **Reducido**: `@media (prefers-reduced-motion: reduce)` desactiva parallax/stagger/hero anim.

## 7. ICONS / LOGO

- Iconos: SVG inline estilo Lucide (stroke 1.8, round caps). Prohibidos emojis como iconos.
- Logo temp v1: marca tipográfica — cuadrado redondeado con `</>` + "Code Dynamic".
  `frontend/src/assets/logo.svg` + favicon derivado.

## 8. AVOID (anti-patterns)

Neón/AI gradients · glass generalizado ilegible · scroll-hijacking · spinners genéricos ·
animación decorativa que bloquee INP · 5 familias de fuentes · bento con celdas iguales y
copy genérico · texto bajo contraste sobre blur · cursores custom agresivos · audio ambiental.

## 9. PRE-DELIVERY CHECKLIST

- [ ] Sin emojis como iconos; SVG con `aria-hidden` o label accesible.
- [ ] `cursor-pointer` en todo clickable; foco visible `:focus-visible`.
- [ ] Contraste AA verificado (texto 4.5:1).
- [ ] `prefers-reduced-motion` respetado.
- [ ] Texto reflow sin clipping a 320px, zoom 200%, spacing override.
- [ ] Responsive: 375 / 768 / 1024 / 1440 probados.
- [ ] INP ≤200 ms, LCP <2.5 s, CLS <0.1 (Lighthouse móvil).
- [ ] SEO: title/desc ES+EN, OG, lang correcto, sitemap.
- [ ] i18n completo: sin strings hardcodeados fuera del diccionario.
