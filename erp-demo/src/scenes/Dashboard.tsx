import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, useLayout} from '../components/ui';

export const DURATION = 270;

const KPIS = [
  {label: 'Ventas hoy', value: 'Gs. 4,8 M', delta: '+12%', up: true},
  {label: 'Tickets', value: '132', delta: '+8%', up: true},
  {label: 'Ticket prom.', value: 'Gs. 36.400', delta: '+3%', up: true},
  {label: 'Stock crítico', value: '7 items', delta: '-2', up: false},
];

const BARS = [42, 58, 50, 70, 64, 88, 112];
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

/** Escena 5 — Reportes BI Premium: dashboard y analítica */
export const Dashboard: React.FC = () => {
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
          height: '100%',
          justifyContent: 'center',
          padding: vertical ? '0 64px' : '0 110px',
          gap: vertical ? 30 : 44,
          boxSizing: 'border-box',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: vertical ? 22 : 26,
              letterSpacing: 2,
              color: theme.accent,
              textTransform: 'uppercase',
            }}
          >
            Reportes BI Premium
          </div>
          <h2
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 800,
              fontSize: vertical ? 56 : 88,
              letterSpacing: -2,
              margin: '12px 0 0',
            }}
          >
            El negocio, de un vistazo
          </h2>
          <p
            style={{
              fontSize: vertical ? 25 : 32,
              color: theme.muted,
              marginTop: vertical ? 10 : 14,
              lineHeight: 1.4,
            }}
          >
            Qué vendió cada vendedor · qué producto deja más ganancia · qué conviene reponer
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: vertical ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: vertical ? 18 : 28,
          }}
        >
          {KPIS.map((k, i) => {
            const s = spring({frame: frame - 20 - i * 12, fps, config: {damping: 19, stiffness: 140}});
            return (
              <div
                key={k.label}
                style={{
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
                  borderRadius: 24,
                  border: `1px solid ${theme.line}`,
                  background: theme.surface,
                  padding: vertical ? '22px 26px' : '32px 36px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{fontSize: vertical ? 22 : 26, color: theme.muted}}>{k.label}</div>
                <div
                  style={{
                    fontFamily: theme.fontDisplay,
                    fontWeight: 800,
                    fontSize: vertical ? 40 : 52,
                    marginTop: 8,
                  }}
                >
                  {k.value}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: 12,
                    fontSize: vertical ? 21 : 26,
                    fontFamily: theme.fontMono,
                    color: k.up ? theme.ok : theme.warn,
                    background: k.up ? 'rgba(52,199,89,0.1)' : 'rgba(255,159,10,0.12)',
                    padding: '5px 18px',
                    borderRadius: 999,
                  }}
                >
                  {k.up ? '▲' : '●'} {k.delta}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gráfico de barras semanal */}
        <div
          style={{
            borderRadius: 24,
            border: `1px solid ${theme.line}`,
            background: theme.surface,
            padding: vertical ? '26px 30px 22px' : '36px 44px 28px',
          }}
        >
          <div style={{fontSize: vertical ? 23 : 28, color: theme.muted, marginBottom: 20}}>
            Ventas por día · esta semana
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: vertical ? 18 : 26, height: vertical ? 230 : 260}}>
            {BARS.map((v, i) => {
              const h = spring({frame: frame - 60 - i * 8, fps, config: {damping: 17, stiffness: 110}});
              const peak = i === 5;
              const maxV = 112;
              return (
                <div key={i} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
                  <div
                    style={{
                      width: '100%',
                      height: interpolate(h, [0, 1], [0, (v / maxV) * (vertical ? 190 : 220)]),
                      borderRadius: 12,
                      background: peak ? theme.accent : 'rgba(46,124,246,0.35)',
                      boxShadow: peak ? '0 8px 32px rgba(46,124,246,0.5)' : undefined,
                    }}
                  />
                  <span
                    style={{
                      fontSize: vertical ? 19 : 22,
                      fontFamily: theme.fontMono,
                      color: peak ? theme.muted : 'transparent',
                    }}
                  >
                    {DAYS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ProgressBar durationInFrames={DURATION} />
    </SceneShell>
  );
};
