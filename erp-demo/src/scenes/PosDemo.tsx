import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, useLayout} from '../components/ui';

export const DURATION = 300;

// Ticket realista de comercio (distribuidora/almacén paraguayo, precios en Gs.)
const ITEMS = [
  {name: 'Yerba canaria 1 kg', qty: 1, price: 28000},
  {name: 'Arroz 1 kg', qty: 2, price: 8500},
  {name: 'Aceite girasol 900 ml', qty: 1, price: 12000},
  {name: 'Fideo guiso 500 g', qty: 2, price: 6500},
];

const fmt = (n: number) => n.toLocaleString('es-PY');

/** Escena 4 — Demo animada de una venta en el mostrador */
export const PosDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vertical} = useLayout();
  const fade = interpolate(frame, [DURATION - 15, DURATION], [1, 0]);

  const visibleCount = Math.min(
    ITEMS.length,
    Math.floor(interpolate(frame, [30, 30 + ITEMS.length * 45], [0, ITEMS.length + 0.999]))
  );
  const total = ITEMS.slice(0, visibleCount).reduce((a, i) => a + i.qty * i.price, 0);
  const grandTotal = ITEMS.reduce((a, i) => a + i.qty * i.price, 0);
  const shownTotal = Math.round(interpolate(frame, [30, 30 + ITEMS.length * 45], [0, grandTotal]));
  const ticketDone = frame > 30 + ITEMS.length * 45 + 10;
  const payProgress = spring({frame: frame - (30 + ITEMS.length * 45 + 25), fps, config: {damping: 20, stiffness: 90}});

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
          gap: vertical ? 44 : 70,
          padding: vertical ? '50px 64px' : '0 110px',
          boxSizing: 'border-box',
        }}
      >
        {/* Columna texto */}
        <div
          style={{
            flex: vertical ? '0 0 auto' : '0 0 560px',
            width: vertical ? '100%' : undefined,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              fontFamily: theme.fontMono,
              fontSize: vertical ? 22 : 26,
              letterSpacing: 2,
              color: theme.accent,
              textTransform: 'uppercase',
            }}
          >
            Demo · Ventas
          </div>
          <h2
            style={{
              fontFamily: theme.fontDisplay,
              fontWeight: 800,
              fontSize: vertical ? 62 : 92,
              letterSpacing: -2,
              lineHeight: 1.05,
              margin: '16px 0',
            }}
          >
            Cobrar en segundos
          </h2>
          <p
            style={{
              fontSize: vertical ? 28 : 36,
              color: theme.muted,
              lineHeight: 1.5,
              margin: vertical ? '0 0 8px' : undefined,
            }}
          >
            Escaneás el código de barras o buscás por nombre. El inventario (stock) se
            descuenta solo, sucursal por sucursal.
          </p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: vertical ? 12 : 16, marginTop: vertical ? 22 : 36}}>
            {['Efectivo', 'Tarjeta', 'Cta. cte.'].map((m, i) => {
              const on = ticketDone && i === 0;
              return (
                <div
                  key={m}
                  style={{
                    padding: vertical ? '10px 22px' : '14px 30px',
                    borderRadius: 999,
                    fontSize: vertical ? 23 : 28,
                    border: `1px solid ${on ? theme.ok : theme.line}`,
                    background: on ? 'rgba(52,199,89,0.12)' : theme.surface,
                    color: on ? theme.ok : theme.muted,
                  }}
                >
                  {on ? '✓ ' : ''}<span style={{fontFamily: theme.fontMono, marginRight: 10}}>{i + 1}</span>{m}
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: vertical ? 14 : 22,
              fontFamily: theme.fontMono,
              fontSize: vertical ? 19 : 24,
              color: theme.muted,
              letterSpacing: 1,
            }}
          >
            Teclas 1–9 = medios de pago, sin mouse
          </div>
        </div>

        {/* Ticket */}
        <div
          style={{
            flex: vertical ? '0 0 auto' : 1,
            width: vertical ? '100%' : undefined,
            maxWidth: vertical ? 920 : 760,
            borderRadius: 28,
            border: `1px solid ${theme.line}`,
            background: theme.surface,
            padding: vertical ? '34px 38px' : '48px 52px',
            boxShadow: '0 30px 100px rgba(0,0,0,0.5)',
            boxSizing: 'border-box',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8}}>
            <span style={{fontFamily: theme.fontDisplay, fontWeight: 700, fontSize: vertical ? 34 : 44}}>
              Venta de mostrador
            </span>
            <span style={{fontFamily: theme.fontMono, fontSize: vertical ? 21 : 26, color: theme.muted}}>
              #V-1042 · Sucursal Centro
            </span>
          </div>
          <div style={{height: 2, background: theme.line, margin: vertical ? '20px 0' : '28px 0'}} />
          {ITEMS.map((item, i) => {
            const vis = i < visibleCount;
            const s = spring({frame: frame - (30 + i * 45), fps, config: {damping: 18, stiffness: 150}});
            if (!vis) {
              return (
                <div key={item.name} style={{height: vertical ? 58 : 76, borderBottom: '1px dashed rgba(255,255,255,0.07)'}} />
              );
            }
            return (
              <div
                key={item.name}
                style={{
                  opacity: s,
                  transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: vertical ? '12px 0' : '16px 0',
                  borderBottom: '1px dashed rgba(255,255,255,0.07)',
                  fontSize: vertical ? 26 : 32,
                }}
              >
                <span>
                  <span style={{color: theme.accent, fontFamily: theme.fontMono}}>{item.qty}× </span>
                  {item.name}
                </span>
                <span style={{fontFamily: theme.fontMono}}>Gs. {fmt(item.qty * item.price)}</span>
              </div>
            );
          })}
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: vertical ? 20 : 30, alignItems: 'baseline'}}>
            <span style={{fontSize: vertical ? 28 : 34, color: theme.muted}}>Total</span>
            <span
              style={{
                fontFamily: theme.fontDisplay,
                fontWeight: 800,
                fontSize: vertical ? 54 : 68,
                color: ticketDone ? theme.ok : theme.text,
              }}
            >
              Gs. {fmt(ticketDone ? total : shownTotal)}
            </span>
          </div>
          {/* barra de pago */}
          <div style={{marginTop: vertical ? 18 : 26, height: 14, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden'}}>
            <div
              style={{
                width: `${Math.max(0, Math.min(1, payProgress)) * 100}%`,
                height: '100%',
                background: theme.ok,
                borderRadius: 999,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: vertical ? 22 : 28,
              color: ticketDone ? theme.ok : theme.muted,
              fontFamily: theme.fontMono,
            }}
          >
            {ticketDone ? '✓ COBRADO — ticket impreso · stock descontado' : 'Agregando items…'}
          </div>
        </div>
      </div>
      <ProgressBar durationInFrames={DURATION} color={theme.ok} />
    </SceneShell>
  );
};
