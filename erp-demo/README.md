# ERP SYSTEM — Presentación demo (Remotion)

Dos composiciones del mismo contenido (~61 segundos, 30fps):

| Composición | Formato | Salida | Uso |
|---|---|---|---|
| `ERPDemo` | 1920×1080 horizontal | `out/erp-system-demo.mp4` | YouTube, presentaciones, PC |
| `ERPDemoVertical` | 1080×1920 vertical (9:16) | `out/erp-system-demo-vertical.mp4` | Estados de WhatsApp, reels, celular |

Las escenas son compartidas: cada una detecta el formato (`useLayout()` en
`src/components/ui.tsx`) y ajusta layout (columnas apiladas en vertical) y tipografías.

Todo el contenido está groundeado en los documentos reales del producto — `docs/sales/GUIA_VENTAS.md`
v1.3 (posicionamiento, módulos §5, diferenciales §6, paquetes §8) y el flyer
(`docs/sales/assets/`). Nada de lo que dice el video está inventado.

| # | Escena | Contenido |
|---|--------|-----------|
| 1 | Hero | "Tu gestión comercial en un solo sistema" + pilares: guaraníes, SIFEN, multi-sucursal, sin mensualidad |
| 2 | Cómo funciona | On-premise: datos en tu negocio · compra única · funciona sin internet (solo la factura viaja a SIFEN) |
| 3 | Módulos | Bento con los 10 módulos del flyer en lenguaje de cliente (ventas, inventario, compras, SIFEN, cobrar, reservas, producción, multi-moneda, BI, multi-sucursal) |
| 4 | Demo POS | Venta de mostrador realista en guaraníes, cobro con teclas 1–9, ticket impreso + stock descontado |
| 5 | Reportes BI Premium | KPIs + ventas semanales (paquete Core + BI Premium) |
| 6 | Facturación SIFEN | Factura electrónica, autorización en línea, caja actualizada, libros de IVA |
| 7 | Despliegue | On-premise multi-sucursal, perfiles laptop/servidor, VPN opcional |
| 8 | Cierre | CTA: prueba gratis 30 días + contacto Code Dynamic (+595 995 639 582) |

## Uso

```bash
cd erp-demo
npm install
npm run dev              # abre Remotion Studio (elige composición arriba a la izquierda)
npm run render           # genera out/erp-system-demo.mp4 (horizontal)
npm run render:vertical  # genera out/erp-system-demo-vertical.mp4 (celular)
npm run lint             # tsc --noEmit
```

Fuente de datos: `/home/darthrpm/dev/erp-system` — `docs/sales/GUIA_VENTAS.md`,
`docs/requirements/`, flyer en `docs/sales/assets/`.
Diseño alineado a `design-system/MASTER.md` (dark-first, acento #2E7CF6).

## Regla de contenido

Si el video dice algo que no está en `GUIA_VENTAS.md` o en los REQ, está mal:
actualizar la escena o el doc, nunca inventar features (no "ERP completo",
no contabilidad, no nómina — ver GUIA_VENTAS §2 y §11).
