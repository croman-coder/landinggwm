import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { modelos, type Modelo } from "@/content/modelos";
import { CONTACTO, whatsappUrl, mensajeWhatsApp } from "@/content/contacto";
import { cn } from "@/lib/utils";

type Props = {
  /**
   * Landing de un solo modelo: la columna "Modelos" (que hoy linkea a los
   * otros 2) desaparece, la bajada menciona solo este modelo, y el logo
   * ancla al inicio de esta misma página en vez de navegar a la landing
   * general con los 3.
   */
  modelo?: Modelo;
};

export function Footer({ modelo }: Props) {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-[color:var(--color-ink)] text-white/70">
      <div
        className={cn(
          "mx-auto grid w-full max-w-[1280px] grid-cols-1 md:grid-cols-12",
        )}
      >
        <div
          className={cn(
            "px-4 py-10 md:px-8 md:py-16",
            modelo ? "md:col-span-6" : "md:col-span-5",
          )}
        >
          {modelo ? (
            <a href="#inicio" aria-label="GWM Paraguay — ir al inicio">
              <Image
                src="https://gwm.com.py/assets_front/images/gwm_blanco.png"
                alt="GWM"
                width={1080}
                height={180}
                className="h-8 w-auto"
              />
            </a>
          ) : (
            <Link href="/" aria-label="GWM Paraguay — ir al inicio">
              <Image
                src="https://gwm.com.py/assets_front/images/gwm_blanco.png"
                alt="GWM"
                width={1080}
                height={180}
                className="h-8 w-auto"
              />
            </Link>
          )}
          <p className="mt-5 max-w-[34ch] text-sm leading-relaxed">
            {modelo
              ? `${modelo.nombre}. Dejanos tus datos y cotizá el tuyo en Paraguay.`
              : "H6 GT PHEV, TANK 400 PHEV 4x4 y POER PLUS 2.4T. Dejanos tus datos y cotizá tu GWM en Paraguay."}
          </p>
          <div className="mt-6 flex gap-px">
            <a
              href={CONTACTO.redes.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GWM Paraguay en Facebook"
              className="flex size-11 items-center justify-center bg-[color:var(--color-ink)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white hover:text-[color:var(--color-ink)]"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12" />
              </svg>
            </a>
            <a
              href={CONTACTO.redes.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GWM Paraguay en Instagram"
              className="flex size-11 items-center justify-center bg-[color:var(--color-ink)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white hover:text-[color:var(--color-ink)]"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77c-.5.5-1.11.9-1.77 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.37-.42 2.43-.47C8.94.01 9.28 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.25A3.25 3.25 0 1 1 12 6.5a3.25 3.25 0 0 1 0 6.75ZM17.5 4.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
              </svg>
            </a>
          </div>
        </div>

        {!modelo && (
          <nav
            aria-label="Modelos"
            className="border-t border-white/10 px-4 py-10 md:col-span-4 md:border-l md:border-t-0 md:px-8 md:py-16"
          >
            <h3 className="eyebrow-rule flex items-center text-xs font-bold uppercase tracking-[0.12em] text-white">
              Modelos
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              {modelos.map((m) => (
                <li key={m.slug}>
                  <a
                    href={`#${m.slug}`}
                    className="edge inline-block py-0.5 transition-colors duration-[--dur-base] hover:text-white"
                  >
                    {m.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div
          className={cn(
            "border-t border-white/10 px-4 py-10 md:border-l md:border-t-0 md:px-8 md:py-16",
            modelo ? "md:col-span-6" : "md:col-span-3",
          )}
        >
          <h3 className="eyebrow-rule flex items-center text-xs font-bold uppercase tracking-[0.12em] text-white">
            Contacto
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone
                className="mt-0.5 size-4 shrink-0 text-white"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <a
                href={whatsappUrl(CONTACTO.whatsapp, mensajeWhatsApp(modelo))}
                target="_blank"
                rel="noopener noreferrer"
                className="tabular-nums transition-colors duration-[--dur-base] hover:text-white"
              >
                {CONTACTO.whatsappFormato}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail
                className="mt-0.5 size-4 shrink-0 text-white"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <a
                href={`mailto:${CONTACTO.email}`}
                className="break-all transition-colors duration-[--dur-base] hover:text-white"
              >
                {CONTACTO.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-white"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span>Paraguay</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-xs uppercase tracking-[0.1em] text-white/40">
            GWM Paraguay · Landings de modelos
          </p>
          <p className="text-xs text-white/40">
            © {anio} GWM Paraguay. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
