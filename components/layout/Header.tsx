"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "@/lib/site";
import { CONTACTO, whatsappUrl } from "@/content/contacto";

/**
 * Header de la landing GWM.
 *
 * Arranca transparente sobre el hero oscuro y se vuelve sólido al
 * scrollear. Los enlaces anclan a las secciones de la propia landing
 * (secciones por modelo + formulario), porque es una página única.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const solido = scrolled || drawerAbierto;

  useEffect(() => {
    let ticking = false;
    const alScrollear = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  useEffect(() => {
    const alPresionar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerAbierto(false);
    };
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerAbierto]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[50] transition-[background-color,border-color] duration-[--dur-base] ease-[--ease-out]",
          solido
            ? "border-b border-[color:var(--color-border-strong)] bg-[color:var(--color-ink)]"
            : "border-b border-white/10 bg-transparent",
        )}
      >
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex min-h-16 w-full max-w-[1280px] items-stretch pl-4 md:pl-8 xl:min-h-[4.5rem]"
        >
          <a
            href="#inicio"
            className="flex shrink-0 items-center pr-3"
            aria-label="GWM Paraguay — ir al inicio"
          >
            <Image
              src="https://gwm.com.py/assets_front/images/gwm_blanco.png"
              alt="GWM"
              width={260}
              height={44}
              priority
              className="h-8 w-auto"
            />
          </a>

          {/* Navegación de escritorio */}
          <div className="ml-auto hidden items-stretch lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "edge flex items-center justify-center px-4 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white/10",
                  item.href === "#cotizar" &&
                    "bg-white px-6 text-[color:var(--color-ink)] hover:bg-white/90",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Disparador móvil */}
          <button
            type="button"
            onClick={() => setDrawerAbierto(true)}
            aria-expanded={drawerAbierto}
            aria-controls="menu-movil"
            aria-label="Abrir menú"
            className="ml-auto flex w-16 items-center justify-center text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-white/10 lg:hidden"
          >
            <Menu className="size-6" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {/* Drawer móvil */}
      {drawerAbierto && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerAbierto(false)}
            className="absolute inset-0 bg-black/55"
          />
          <div
            id="menu-movil"
            className="absolute inset-y-0 right-0 flex w-[min(88vw,24rem)] flex-col overflow-y-auto overscroll-contain bg-white pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
              <Image
                src="https://gwm.com.py/assets_front/images/gwm_blanco.png"
                alt="GWM"
                width={260}
                height={44}
                className="h-7 w-auto"
              />
              <button
                type="button"
                onClick={() => setDrawerAbierto(false)}
                aria-label="Cerrar menú"
                className="-my-4 -mr-5 flex w-16 items-center justify-center self-stretch border-l border-[color:var(--color-border)] transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-[color:var(--color-surface)]"
              >
                <X className="size-6" strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Navegación móvil" className="flex-1 px-5 py-6">
              <ul>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex min-h-12 items-center border-b border-[color:var(--color-border)] text-[1.0625rem] font-bold"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[color:var(--color-border)] px-5 py-5">
              <a
                href={whatsappUrl(CONTACTO.whatsapp, CONTACTO.mensajeGenerico)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 w-full items-center justify-center bg-[color:var(--color-gwm)] px-6 font-black uppercase tracking-[0.06em] text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-[color:var(--color-gwm-hover)]"
              >
                Cotizar por WhatsApp
              </a>
              <a
                href={`tel:${CONTACTO.whatsapp}`}
                className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 text-[0.9375rem] font-bold text-[color:var(--color-text-2)]"
              >
                <Phone className="size-4" strokeWidth={2.25} aria-hidden="true" />
                <span className="tabular-nums">{CONTACTO.whatsappFormato}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
