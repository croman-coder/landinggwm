import Image from "next/image";
import type { Modelo } from "@/content/modelos";
import { CONTACTO, whatsappUrl, mensajeWhatsApp } from "@/content/contacto";

/**
 * Hero de la landing de UN solo modelo (la que abre cada QR impreso).
 * Mismo lenguaje visual que `Hero.tsx`, pero mostrando solo ese modelo:
 * su imagen, su tagline y su precio, sin mencionar a los otros dos.
 */
export function HeroModelo({ modelo }: { modelo: Modelo }) {
  return (
    <section
      id="inicio"
      aria-label={`Bienvenida GWM ${modelo.nombre}`}
      className="relative isolate overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* Fondo */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={modelo.imagen}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)] via-[color:var(--color-ink)]/70 to-[color:var(--color-ink)]/40" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />

      <div className="relative mx-auto flex min-h-[clamp(32rem,82svh,52rem)] w-full max-w-[1280px] flex-col justify-end px-4 pb-16 pt-32 md:px-8 lg:pb-20">
        <div className="max-w-[44rem] motion-safe:animate-[fade-up_0.7s_var(--ease-out)_both]">
          <p className="mb-5 text-[length:var(--text-eyebrow)] font-bold uppercase tracking-[0.14em] text-white/70">
            GWM Paraguay · {modelo.segmento}
          </p>

          <h1 className="text-[length:var(--text-display)] font-black leading-[0.98] tracking-[-0.03em] text-white">
            {modelo.nombre}
          </h1>

          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-white/80 md:text-lg">
            {modelo.tagline}. {modelo.precio}.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#cotizar"
              className="inline-flex min-h-14 items-center gap-2 bg-white px-8 font-bold uppercase tracking-[0.06em] text-[color:var(--color-ink)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white/85"
            >
              Cotizá tu {modelo.nombre}
            </a>
            <a
              href={whatsappUrl(CONTACTO.whatsapp, mensajeWhatsApp(modelo))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center gap-2 border-2 border-white/60 px-8 font-bold uppercase tracking-[0.06em] text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:border-white hover:bg-white hover:text-[color:var(--color-ink)]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
