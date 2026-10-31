import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Pill, ProgressBar, SceneShell, useLayout} from '../components/ui';

export const DURATION = 210;

/** Escena 1 — Hero: posicionamiento del flyer / GUIA_VENTAS §2-§3 */
export const Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const kicker = spring({frame, fps, config: {damping: 16, stiffness: 120}});
  const title = spring({frame: frame - 15, fps, config: {damping: 20, stiffness: 140}});
  const sub = spring({frame: frame - 35, fps, config: {damping: 20, stiffness: 140}});
  const pills = spring({frame: frame - 55, fps, config: {damping: 20, stiffness: 140}});
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
          padding: vertical ? '0 60px' : 0,
        }}
      >
        {/* Kicker — igual al flyer */}
        <div
          style={{
            opacity: kicker,
            transform: `scale(${interpolate(kicker, [0, 1], [0.94, 1])})`,
            fontFamily: theme.fontMono,
            fontSize: vertical ? 22 : 26,
            fontWeight: 700,
            letterSpacing: vertical ? 4 : 6,
            textTransform: 'uppercase',
            color: theme.accent,
            textAlign: 'center',
          }}
        >
          CDGC · Sistema de gestión comercial · Paraguay
        </div>
        <div
          style={{
            opacity: title,
            transform: `translateY(${interpolate(title, [0, 1], [50, 0])}px)`,
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 800,
              fontSize: vertical ? 78 : 124,
              letterSpacing: vertical ? -2 : -3.5,
              margin: vertical ? '28px 0 0' : '40px 0 0',
              lineHeight: 1.06,
            }}
          >
            Tu gestión comercial
            <br />
            en un solo <span style={{color: theme.accent}}>sistema.</span>
          </h1>
        </div>
        <p
          style={{
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [30, 0])}px)`,
            fontSize: vertical ? 30 : 40,
            color: theme.muted,
            margin: vertical ? '22px 0 0' : '30px 0 0',
            maxWidth: vertical ? 880 : 1240,
            textAlign: 'center',
            lineHeight: 1.45,
          }}
        >
          Ventas, inventario, compras, reservas y facturación electrónica — para
          comercios con una o varias sucursales.
        </p>
        <div
          style={{
            opacity: pills,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: vertical ? 14 : 20,
            marginTop: vertical ? 38 : 52,
            maxWidth: 900,
          }}
        >
          <Pill>Guaraníes</Pill>
          <Pill>SIFEN</Pill>
          <Pill>Multi-sucursal</Pill>
          <Pill>Sin mensualidad</Pill>
        </div>
        <p
          style={{
            opacity: pills,
            position: 'absolute',
            bottom: vertical ? 50 : 70,
            fontFamily: theme.fontMono,
            fontSize: vertical ? 20 : 26,
            color: theme.muted,
            letterSpacing: 1,
          }}
        >
          Una presentación de <span style={{color: theme.text}}>Code&nbsp;Dynamic</span>
        </p>
      </div>
      <ProgressBar durationInFrames={DURATION} />
    </SceneShell>
  );
};
