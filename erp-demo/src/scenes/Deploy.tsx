import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, SceneTitle, useLayout} from '../components/ui';

export const DURATION = 210;

const NODES = [
  {name: 'Casa Central', tag: 'Servidor', x: 50, y: 50},
  {name: 'Sucursal Norte', tag: 'Laptop', x: 18, y: 72},
  {name: 'Sucursal Sur', tag: 'Laptop', x: 82, y: 72},
];

const PROFILES = [
  {name: 'Perfil Laptop', desc: 'Todo en una máquina · ideal para empezar', port: ':8081'},
  {name: 'Perfil Servidor', desc: 'Multi-terminal · TLS · sucursales', port: '80 / 443'},
];

/** Escena 7 — Multi-sucursal y despliegue on-premise */
export const Deploy: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const fade = interpolate(frame, [DURATION - 15, DURATION], [1, 0]);
  const lineDraw = spring({frame: frame - 70, fps, config: {damping: 30, stiffness: 60}});

  const map = (
    <div
      style={{
        flex: vertical ? undefined : 1.2,
        width: vertical ? '100%' : undefined,
        position: 'relative',
        borderRadius: 28,
        border: `1px solid ${theme.line}`,
        background: theme.surface,
        minHeight: vertical ? 320 : 420,
        padding: vertical ? 26 : 40,
        boxSizing: 'border-box',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: vertical ? 26 : 40,
          width: vertical ? 'calc(100% - 52px)' : 'calc(100% - 80px)',
          height: vertical ? 'calc(100% - 52px)' : 'calc(100% - 80px)',
        }}
      >
        <line
          x1="50" y1="50" x2="18" y2="72"
          stroke={theme.accent} strokeWidth="1.2"
          strokeDasharray="100"
          strokeDashoffset={interpolate(lineDraw, [0, 1], [100, 0])}
        />
        <line
          x1="50" y1="50" x2="82" y2="72"
          stroke={theme.accent} strokeWidth="1.2"
          strokeDasharray="100"
          strokeDashoffset={interpolate(lineDraw, [0, 1], [100, 0])}
        />
      </svg>
      {NODES.map((n, i) => {
        const s = spring({frame: frame - 35 - i * 18, fps, config: {damping: 16, stiffness: 120}});
        return (
          <div
            key={n.name}
            style={{
              position: 'absolute',
              left: `${n.x}%`,
              top: `${n.y}%`,
              transform: `translate(-50%,-50%) scale(${s})`,
              opacity: s,
              background: theme.surface2,
              border: `2px solid ${i === 0 ? theme.accent : theme.line}`,
              borderRadius: 20,
              padding: vertical ? '14px 22px' : '20px 30px',
              textAlign: 'center',
              minWidth: vertical ? 200 : 260,
            }}
          >
            <div style={{fontSize: vertical ? 24 : 32, fontWeight: 700}}>{n.name}</div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                fontFamily: theme.fontMono,
                fontSize: vertical ? 17 : 22,
                color: i === 0 ? '#fff' : theme.muted,
                background: i === 0 ? theme.accent : 'rgba(255,255,255,0.06)',
                padding: '4px 16px',
                borderRadius: 999,
              }}
            >
              {n.tag}
            </div>
          </div>
        );
      })}
    </div>
  );

  const profiles = (
    <div
      style={{
        flex: vertical ? undefined : 1,
        width: vertical ? '100%' : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: vertical ? 18 : 24,
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {PROFILES.map((p, i) => {
        const s = spring({frame: frame - 90 - i * 18, fps, config: {damping: 19, stiffness: 140}});
        return (
          <div
            key={p.name}
            style={{
              opacity: s,
              transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
              borderRadius: 24,
              border: `1px solid ${theme.line}`,
              background: theme.surface,
              padding: vertical ? '26px 32px' : '36px 40px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14}}>
              <span style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: vertical ? 32 : 40}}>
                {p.name}
              </span>
              <span style={{fontFamily: theme.fontMono, fontSize: vertical ? 20 : 24, color: theme.accent}}>
                {p.port}
              </span>
            </div>
            <div style={{fontSize: vertical ? 23 : 28, color: theme.muted, marginTop: 8}}>{p.desc}</div>
          </div>
        );
      })}
      <div
        style={{
          opacity: spring({frame: frame - 130, fps, config: {damping: 20, stiffness: 120}}),
          fontFamily: theme.fontMono,
          fontSize: vertical ? 20 : 26,
          color: theme.muted,
        }}
      >
        $ docker compose --profile server up -d
      </div>
    </div>
  );

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
          gap: vertical ? 36 : 50,
        }}
      >
        <SceneTitle
          kicker="Despliegue"
          title="On-premise, multi-sucursal"
          sub="Tus datos en tu servidor · terminales locales · VPN opcional para verlo desde casa"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: vertical ? 'column' : 'row',
            alignItems: 'stretch',
            gap: vertical ? 26 : 60,
            padding: vertical ? '0 64px' : '0 110px',
            width: vertical ? '100%' : undefined,
            boxSizing: 'border-box',
          }}
        >
          {map}
          {profiles}
        </div>
      </div>
      <ProgressBar durationInFrames={DURATION} />
    </SceneShell>
  );
};
