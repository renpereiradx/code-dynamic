// Design tokens — alineados con design-system/MASTER.md (dark-first)
export const theme = {
  bg: '#0A0A0B',
  surface: '#131316',
  surface2: '#1C1C21',
  text: '#F5F5F7',
  muted: '#A1A1AA',
  line: 'rgba(255,255,255,0.08)',
  accent: '#2E7CF6',
  ok: '#34C759',
  warn: '#FF9F0A',
  violet: '#8E8EA0',
  fontDisplay:
    '"Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontBody: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
} as const;

export const FPS = 30;

// Horizontal (YouTube / presentaciones)
export const W = 1920;
export const H = 1080;

// Vertical (celular / estados de WhatsApp / reels)
export const VW = 1080;
export const VH = 1920;
