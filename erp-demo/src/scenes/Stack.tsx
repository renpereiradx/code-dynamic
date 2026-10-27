import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, SceneTitle, useLayout} from '../components/ui';

export const DURATION = 180;

// Diferenciales reales — GUIA_VENTAS §6 y objeciones §7
const CARDS = [
  {
    mono: 'on-premise',
    title: 'En tu negocio',
    desc: 'Corre en tu computadora o servidor.\nTus datos nunca salen del local.',
    accent: theme.ok,
  },
  {
    mono: 'compra única',
    title: 'Sin mensualidad',
    desc: 'Licencia perpetua: se paga una vez.\nSin cuota anual ni renovación.',
    accent: theme.accent,
  },
  {
    mono: 'red local',
    title: 'Sin internet',
    desc: 'Vendés y controlás stock en tu red.\nSolo la factura viaja a SIFEN.',
    accent: theme.warn,
  },
];

/** Escena 2 — Cómo funciona (lenguaje de cliente, no arquitectura interna) */
export const Stack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const fade = interpolate(frame, [DURATION - 15, DURATION], [1, 0]);

  return (
    <SceneShell>
      <div
        style={{
          opacity: fade,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: vertical ? 40 : 64,
        }}
      >
        <SceneTitle
          kicker="Cómo funciona"
          title="Instalado en tu negocio"
          sub="Sin nube ajena, sin mensualidades, sin depender de internet"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'center',
            gap: vertical ? 22 : 36,
            padding: vertical ? '0 80px' : 0,
            width: vertical ? '100%' : undefined,
          }}
        >
          {CARDS.map((c, i) => {
            const s = spring({
              frame: frame - 40 - i * 14,
              fps,
              config: {damping: 18, stiffness: 130},
            });
            return (
              <div
                key={c.title}
                style={{
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [60, 0])}px)`,
                  width: vertical ? '100%' : 500,
                  borderRadius: 28,
                  border: `1px solid ${theme.line}`,
                  background: theme.surface,
                  padding: vertical ? '32px 38px' : '44px 48px',
                  borderTop: `6px solid ${c.accent}`,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    fontFamily: theme.fontMono,
                    fontSize: vertical ? 20 : 24,
                    color: theme.muted,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {c.mono}
                </div>
                <div
                  style={{
                    fontFamily: theme.fontDisplay,
                    fontWeight: 800,
                    fontSize: vertical ? 46 : 64,
                    margin: '10px 0 14px',
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontSize: vertical ? 25 : 30,
                    lineHeight: 1.55,
                    color: theme.muted,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ProgressBar durationInFrames={DURATION} />
    </SceneShell>
  );
};
