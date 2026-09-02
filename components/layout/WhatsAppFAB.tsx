"use client";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { CONTACTO, whatsappUrl } from "@/content/contacto";

/**
 * Botón flotante de WhatsApp. La landing tiene su propio formulario de
 * leads, así que el FAB complementa (no reemplaza) el canal de captura.
 */
export function WhatsAppFAB() {
  const href = whatsappUrl(CONTACTO.whatsapp, CONTACTO.mensajeGenerico);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex size-14 items-center justify-center bg-[color:var(--color-whatsapp)] text-white transition-transform duration-[--dur-base] ease-[--ease-out] hover:scale-105 active:scale-95 md:bottom-7 md:right-7"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[color:var(--color-whatsapp)] motion-safe:animate-ping motion-safe:[animation-duration:2.4s] opacity-20"
      />
      <WhatsAppIcon className="relative size-7" />
    </a>
  );
}
