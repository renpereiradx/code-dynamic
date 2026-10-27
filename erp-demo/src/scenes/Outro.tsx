import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {SceneShell, useLayout} from '../components/ui';

export const DURATION = 180;

// Diferenciales del flyer (GUIA_VENTAS §6, §8)
const STATS = [
  ['30 días', 'de prueba, completo y gratis'],
  ['1 pago', 'licencia perpetua'],
  ['0', 'mensualidades'],
];

/** Escena 8 — Cierre / CTA */
export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const logo = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const title = spring({frame: frame - 15, fps, config: {damping: 20, stiffness: 140}});
  const stats = spring({frame: frame - 40, fps, config: {damping: 20, stiffness: 140}});
  const cta = spring({frame: frame - 65, fps, config: {damping: 16, stiffness: 110}});

  return (
    <SceneShell bg="radial-gradient(1200px 700px at 50% 110%, rgba(46,124,246,0.25), #0A0A0B 70%)">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: vertical ? '0 60px' : 0,
        }}
      >
        <div
          style={{
            transform: `scale(${logo})`,
            opacity: logo,
            width: vertical ? 104 : 140,
            height: vertical ? 104 : 140,
            borderRadius: vertical ? 28 : 36,
            background: theme.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: theme.fontMono,
            fontWeight: 800,
            fontSize: vertical ? 40 : 52,
            color: '#fff',
            boxShadow: '0 24px 90px rgba(46,124,246,0.45)',
          }}
        >
          {'</>'}
        </div>
        <h1
          style={{
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [40, 0])}px)`,
            fontFamily: theme.fontDisplay,
            fontWeight: 800,
            fontSize: vertical ? 62 : 116,
            letterSpacing: vertical ? -2 : -3,
            margin: vertical ? '30px 0 0' : '40px 0 0',
            textAlign: 'center',
            lineHeight: 1.08,
          }}
        >
          Probalo gratis por <span style={{color: theme.accent}}>30 días</span>
        </h1>
        <div
          style={{
            opacity: stats,
            display: 'flex',
            gap: vertical ? 40 : 70,
            marginTop: vertical ? 30 : 44,
          }}
        >
          {STATS.map(([v, l]) => (
            <div key={l} style={{textAlign: 'center'}}>
              <div
                style={{
                  fontFamily: theme.fontDisplay,
                  fontWeight: 800,
                  fontSize: vertical ? 42 : 64,
                }}
              >
                {v}
              </div>
              <div style={{fontSize: vertical ? 20 : 28, color: theme.muted, maxWidth: 240}}>{l}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            opacity: cta,
            transform: `scale(${interpolate(cta, [0, 1], [0.9, 1])})`,
            marginTop: vertical ? 38 : 52,
            background: theme.accent,
            color: '#fff',
            fontSize: vertical ? 30 : 40,
            fontWeight: 700,
            padding: vertical ? '20px 56px' : '26px 80px',
            borderRadius: 999,
            boxShadow: '0 16px 60px rgba(46,124,246,0.5)',
            whiteSpace: 'nowrap',
          }}
        >
          +595 995 639 582
        </div>
        <p
          style={{
            opacity: cta,
            marginTop: vertical ? 22 : 30,
            fontFamily: theme.fontMono,
            fontSize: vertical ? 20 : 26,
            color: theme.muted,
          }}
        >
          Code Dynamic · codedynamicdev@gmail.com
        </p>
      </div>
    </SceneShell>
  );
};
