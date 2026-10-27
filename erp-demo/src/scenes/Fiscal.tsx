import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, useLayout} from '../components/ui';

export const DURATION = 240;

const STEPS = [
  {t: 'Venta cobrada', d: 'Mostrador · V-1042'},
  {t: 'Documento generado', d: 'Factura electrónica · IVA incluido'},
  {t: 'Firmado y enviado a SIFEN', d: 'Firma digital · autorización en línea'},
  {t: 'Caja actualizada', d: 'Movimiento de ingreso conciliado'},
];

/** Escena 6 — Facturación electrónica SIFEN + Caja */
export const Fiscal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const fade = interpolate(frame, [DURATION - 15, DURATION], [1, 0]);

  const header = (
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
        Fiscal + Caja
      </div>
      <h2
        style={{
          fontFamily: theme.fontDisplay,
          fontWeight: 800,
          fontSize: vertical ? 56 : 88,
          letterSpacing: -2,
          lineHeight: 1.05,
          margin: '16px 0 0',
        }}
      >
        Factura electrónica, sin papeles
      </h2>
    </div>
  );

  const invoice = (
    <div
      style={{
        flex: vertical ? undefined : 1,
        width: vertical ? '100%' : undefined,
        maxWidth: vertical ? 920 : 700,
        borderRadius: 28,
        border: `1px solid ${theme.line}`,
        background: '#fff',
        color: '#111',
        padding: vertical ? '32px 36px' : '52px 56px',
        transform: `rotate(${interpolate(frame, [0, 60], [-4, 0], {extrapolateRight: 'clamp'})}deg)`,
        boxShadow: '0 30px 100px rgba(0,0,0,0.55)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10}}>
        <span style={{fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: vertical ? 32 : 40}}>
          Factura Electrónica
        </span>
        <span
          style={{
            fontFamily: theme.fontMono,
            fontSize: vertical ? 19 : 24,
            background: '#188038',
            color: '#fff',
            padding: '7px 20px',
            borderRadius: 999,
          }}
        >
          SIFEN ✓
        </span>
      </div>
      <div style={{height: 2, background: '#eee', margin: vertical ? '20px 0' : '26px 0'}} />
      {[
        ['Emisor', 'Empresa Demo S.R.L. · RUC 80012345-6'],
        ['Receptor', 'Consumidor final'],
        ['Condición', 'Contado · Efectivo'],
        ['Gravada 10%', 'Gs. 165.455'],
        ['IVA 10% incl.', 'Gs. 16.545'],
      ].map(([k, v], i) => {
        const s = spring({frame: frame - 30 - i * 14, fps, config: {damping: 20, stiffness: 140}});
        return (
          <div
            key={k}
            style={{
              opacity: s,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: 18,
              fontSize: vertical ? 23 : 29,
              padding: vertical ? '8px 0' : '10px 0',
            }}
          >
            <span style={{color: '#666', flexShrink: 0}}>{k}</span>
            <span style={{fontFamily: theme.fontMono, fontWeight: 600, textAlign: 'right'}}>{v}</span>
          </div>
        );
      })}
      <div style={{height: 2, background: '#eee', margin: vertical ? '20px 0' : '26px 0'}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <span style={{fontSize: vertical ? 25 : 30, color: '#666'}}>Total</span>
        <span style={{fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: vertical ? 46 : 60}}>
          Gs. 182.000
        </span>
      </div>
    </div>
  );

  const stepsList = (
    <>
      {STEPS.map((st, i) => {
        const appearAt = 40 + i * 40;
        const s = spring({frame: frame - appearAt, fps, config: {damping: 19, stiffness: 140}});
        const done = frame > appearAt;
        return (
          <div key={st.t} style={{opacity: s, display: 'flex', gap: vertical ? 18 : 24, marginBottom: vertical ? 20 : 30}}>
            <div
              style={{
                width: vertical ? 52 : 64,
                height: vertical ? 52 : 64,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: vertical ? 24 : 30,
                fontWeight: 700,
                background: done ? theme.ok : theme.surface2,
                color: done ? '#fff' : theme.muted,
                border: `1px solid ${done ? theme.ok : theme.line}`,
              }}
            >
              {done ? '✓' : i + 1}
            </div>
            <div>
              <div style={{fontSize: vertical ? 29 : 36, fontWeight: 700}}>{st.t}</div>
              <div style={{fontSize: vertical ? 23 : 28, color: theme.muted}}>{st.d}</div>
            </div>
          </div>
        );
      })}
      <div style={{marginTop: 16, fontSize: vertical ? 22 : 26, color: theme.muted, lineHeight: 1.4}}>
        Libros de IVA compras y ventas, listos para tu contador.
      </div>
    </>
  );

  return (
    <SceneShell>
      <div
        style={{
          opacity: fade,
          display: 'flex',
          flexDirection: vertical ? 'column' : 'row',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: vertical ? 42 : 70,
          padding: vertical ? '50px 64px' : '0 110px',
          boxSizing: 'border-box',
        }}
      >
        {vertical ? (
          <>
            {header}
            {invoice}
            <div style={{width: '100%'}}>{stepsList}</div>
          </>
        ) : (
          <>
            {invoice}
            <div style={{flex: '0 0 640px'}}>
              {header}
              <div style={{margin: '20px 0 40px'}} />
              {stepsList}
            </div>
          </>
        )}
      </div>
      <ProgressBar durationInFrames={DURATION} />
    </SceneShell>
  );
};
