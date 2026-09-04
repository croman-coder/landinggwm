import { ArrowDownToLine, Check } from "lucide-react";
import type { Modelo } from "@/content/modelos";
import { cn } from "@/lib/utils";
import { ModeloGaleria } from "@/components/home/ModeloGaleria";

/**
 * Franja de un modelo: imagen y bloque de datos (specs, destacados, ficha
 * PDF, CTA). La usan `ModelShowcase` (los 3 modelos, alternando lado) y la
 * landing de un solo modelo (`app/(modelo)/[slug]`, siempre del mismo lado).
 */
export function ModeloDetalle({
  modelo,
  invertido = false,
}: {
  modelo: Modelo;
  /** Invierte imagen/contenido de lado en desktop. Para franjas alternadas. */
  invertido?: boolean;
}) {
  return (
    <section
      id={modelo.slug}
      className="border-b border-[color:var(--color-border)]"
      aria-labelledby={`titulo-${modelo.slug}`}
    >
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-8 lg:py-24">
        {/* Imagen */}
        <div
          className={cn(
            "order-1",
            invertido ? "md:order-2" : "md:order-1",
          )}
        >
          <ModeloGaleria imagenes={modelo.galeria} alt={`GWM ${modelo.nombre}`} />
        </div>

        {/* Contenido */}
        <div
          className={cn(
            "order-2",
            invertido ? "md:order-1" : "md:order-2",
          )}
        >
          <p className="mb-3 inline-block bg-[color:var(--color-ink)] px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-white">
            {modelo.segmento}
          </p>

          <h2
            id={`titulo-${modelo.slug}`}
            className="text-[length:var(--text-h1)] font-black leading-tight"
          >
            {modelo.nombre}
          </h2>

          <p className="mt-2 text-lg font-black tabular-nums text-[color:var(--color-text-2)]">
            {modelo.precio}
          </p>

          <p className="mt-4 text-[1.0625rem] leading-[1.65] text-[color:var(--color-text-2)]">
            {modelo.descripcion}
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {modelo.specs.map((spec) => (
              <div key={spec.label} className="border-l-2 border-[color:var(--color-ink)] pl-3">
                <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                  {spec.label}
                </dt>
                <dd className="text-sm font-bold">{spec.valor}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 space-y-2">
            {modelo.destacados.map((d) => (
              <li key={d} className="flex items-start gap-2 text-sm">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[color:var(--color-text)]"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#cotizar"
              className="inline-flex min-h-12 items-center gap-2 bg-[color:var(--color-ink)] px-7 text-[0.875rem] font-bold uppercase tracking-[0.06em] text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-[color:var(--color-gwm-hover)]"
            >
              Lo quiero, cotizar
            </a>
            {modelo.fichaPdf && (
              <a
                href={modelo.fichaPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 border-2 border-[color:var(--color-border-strong)] px-7 text-[0.875rem] font-bold uppercase tracking-[0.06em] text-[color:var(--color-text)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:border-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)] hover:text-white"
              >
                <ArrowDownToLine className="size-4" strokeWidth={2.25} aria-hidden="true" />
                Ficha técnica
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
