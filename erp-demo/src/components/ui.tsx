import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';

/** Layout de la composición en curso: vertical = formato celular (1080×1920) */
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  return {vertical: height > width};
};

export const SceneShell: React.FC<{
  children: React.ReactNode;
  bg?: string;
}> = ({children, bg}) => (
  <AbsoluteFill
    style={{
      background: bg ?? theme.bg,
      fontFamily: theme.fontBody,
      color: theme.text,
      overflow: 'hidden',
    }}
  >
    {/* glow decorativo sutil */}
    <div
      style={{
        position: 'absolute',
        width: 1400,
        height: 700,
        left: 260,
        top: -260,
        background:
          'radial-gradient(closest-side, rgba(46,124,246,0.16), transparent)',
        pointerEvents: 'none',
      }}
    />
    {children}
  </AbsoluteFill>
);

export const useRise = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = spring({frame: frame - delay, fps, config: {damping: 22, stiffness: 160}});
  return {
    opacity: interpolate(t, [0, 1], [0, 1]),
    translateY: interpolate(t, [0, 1], [36, 0]),
  };
};

export const Pill: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {vertical} = useLayout();
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: vertical ? '10px 22px' : '12px 28px',
        borderRadius: 999,
        border: `1px solid ${theme.line}`,
        background: 'rgba(255,255,255,0.04)',
        fontFamily: theme.fontMono,
        fontSize: vertical ? 20 : 26,
        letterSpacing: 2,
        color: theme.muted,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

export const SceneTitle: React.FC<{kicker: string; title: string; sub?: string}> = ({
  kicker,
  title,
  sub,
}) => {
  const {vertical} = useLayout();
  const a = useRise(0);
  const b = useRise(12);
  const c = useRise(24);
  return (
    <div style={{textAlign: 'center', padding: vertical ? '0 60px' : '0 120px'}}>
      <div style={{...a, transform: `translateY(${a.translateY}px)`}}>
        <Pill>{kicker}</Pill>
      </div>
      <h1
        style={{
          ...b,
          transform: `translateY(${b.translateY}px)`,
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: vertical ? 68 : 110,
          letterSpacing: vertical ? -2 : -3,
          margin: vertical ? '26px 0 0' : '36px 0 0',
          lineHeight: 1.08,
        }}
      >
        {title}
      </h1>
      {sub ? (
        <p
          style={{
            ...c,
            transform: `translateY(${c.translateY}px)`,
            fontSize: vertical ? 30 : 40,
            color: theme.muted,
            margin: vertical ? '18px 0 0' : '28px 0 0',
            lineHeight: 1.4,
          }}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
};

/** Barra de progreso inferior de escena */
export const ProgressBar: React.FC<{durationInFrames: number; color?: string}> = ({
  durationInFrames,
  color,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          background: color ?? theme.accent,
        }}
      />
    </div>
  );
};
