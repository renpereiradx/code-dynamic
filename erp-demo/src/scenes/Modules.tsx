import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {ProgressBar, SceneShell, SceneTitle, useLayout} from '../components/ui';

export const DURATION = 240;

// Los 10 módulos del flyer (GUIA_VENTAS §5), en lenguaje de cliente
const MODULES = [
  {icon: '◉', name: 'Ventas y caja', desc: 'Cobrá en segundos, incluso en hora pico', hot: true},
  {icon: '▣', name: 'Inventario (stock)', desc: 'Cuánto hay en cada local y en total, con transferencias'},
  {icon: '⬢', name: 'Compras', desc: 'Órdenes a proveedores y cuentas por pagar'},
  {icon: '⬣', name: 'Factura electrónica', desc: 'SIFEN nativo + libros fiscales', hot: true},
  {icon: '▤', name: 'Cuentas por cobrar', desc: 'Quién te debe y desde cuándo'},
  {icon: '◎', name: 'Reservas', desc: 'Con agenda; al concretar, ya son ventas'},
  {icon: '⬒', name: 'Producción', desc: 'Para quien produce: insumos al producto terminado'},
  {icon: '⇄', name: 'Multi-moneda', desc: 'Precios y pagos con tu tasa de cambio'},
  {icon: '◈', name: 'Reportes BI', desc: 'Dashboards, rentabilidad y pronósticos', hot: true},
  {icon: '⬔', name: 'Multi-sucursal', desc: 'Inventario, caja y permisos por local'},
];

/** Escena 3 — Bento de módulos */
export const Modules: React.FC = () => {
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
          gap: vertical ? 40 : 56,
        }}
      >
        <SceneTitle
          kicker="Módulos"
          title="Un solo sistema para tu negocio"
          sub="La venta conecta stock, factura, caja y cuenta del cliente — todo queda integrado"
        />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: vertical ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
            gap: vertical ? 20 : 24,
            padding: vertical ? '0 70px' : '0 100px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {MODULES.map((m, i) => {
            const s = spring({
              frame: frame - 45 - i * (vertical ? 5 : 7),
              fps,
              config: {damping: 19, stiffness: 140},
            });
            return (
              <div
                key={m.name}
                style={{
                  opacity: s,
                  transform: `translateY(${interpolate(s, [0, 1], [50, 0])}px) scale(${interpolate(s, [0, 1], [0.94, 1])})`,
                  borderRadius: 24,
                  border: `1px solid ${m.hot ? 'rgba(46,124,246,0.5)' : theme.line}`,
                  background: m.hot ? 'rgba(46,124,246,0.08)' : theme.surface,
                  padding: vertical ? '24px 26px' : '28px 30px',
                  minHeight: vertical ? undefined : 216,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{fontSize: vertical ? 36 : 42, color: m.hot ? theme.accent : theme.muted}}>
                  {m.icon}
                </span>
                <div
                  style={{
                    fontFamily: theme.fontDisplay,
                    fontWeight: 700,
                    fontSize: vertical ? 28 : 31,
                    marginTop: vertical ? 12 : 14,
                    lineHeight: 1.15,
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    fontSize: vertical ? 20 : 22,
                    color: theme.muted,
                    marginTop: 8,
                    lineHeight: 1.35,
                  }}
                >
                  {m.desc}
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
