import Image from "next/image";
import { CONTACTO, whatsappUrl } from "@/content/contacto";

/**
 * Hero de la landing: los tres modelos en una franja que se abre sobre un
 * fondo oscuro, con el CTA anclando al formulario de cotización.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      aria-label="Bienvenida GWM"
      className="relative isolate overflow-hidden bg-[color:var(--color-ink)]"
    >
      {/* Fondo */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/modelos/tank-400-phev/hero.webp"
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
            GWM Paraguay
          </p>

          <h1 className="text-[length:var(--text-display)] font-black leading-[0.98] tracking-[-0.03em] text-white">
            Tres modelos,
            <br />
            una decisión sin arrepentimientos
          </h1>

          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-white/80 md:text-lg">
            H6 GT PHEV, TANK 400 PHEV 4x4 y POER PLUS 2.4T. Conocé cada modelo
            abajo y dejá tus datos para recibir una cotización personalizada.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#cotizar"
              className="inline-flex min-h-14 items-center gap-2 bg-white px-8 font-bold uppercase tracking-[0.06em] text-[color:var(--color-ink)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white/85"
            >
              Cotizá tu GWM
            </a>
            <a
              href={whatsappUrl(CONTACTO.whatsapp, CONTACTO.mensajeGenerico)}
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
