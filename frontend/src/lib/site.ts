/** Contacto del estudio — mismo número de WhatsApp que los sitios de producto. */
const WA_NUMBER = "595995639582";

export function waLink(text: string): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}
