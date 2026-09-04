"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Send } from "lucide-react";
import { modelos, type Modelo } from "@/content/modelos";
import { FORM } from "@/content/contacto";
import { cn } from "@/lib/utils";

type Props = {
  /**
   * Modelo fijo (landing de un solo modelo, la que abre cada QR): oculta el
   * desplegable y manda `modelo.nombre` por debajo, sin que el visitante lo
   * elija. Sin este prop se muestra el desplegable con los 3 modelos, como
   * en la landing general.
   */
  modelo?: Modelo;
  /** Rótulo de origen a enviar. Por defecto, `FORM.origen` ("QR POP UP"). */
  origen?: string;
};

/**
 * Formulario de captura de leads.
 *
 * Envía los datos a un Google Forms (las URL `action` y `entry.XXXX` son
 * CONFIGURABLES en `content/contacto.ts` → `FORM`).
 *
 * Se usa `fetch` con `mode: "no-cors"`: Google Forms acepta el envío pero
 * nunca devuelve una respuesta legible, así que el flujo local maneja el
 * estado y redirige a /gracias sin depender de la respuesta del navegador.
 */
export function LeadForm({ modelo, origen }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const origenEfectivo = origen ?? FORM.origen;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    data.set(FORM.campos.origen, origenEfectivo);
    // Sin desplegable (landing de un solo modelo): el valor va igual, fijado
    // por código en vez de elegido por el visitante.
    if (modelo) {
      data.set(FORM.campos.modelo, modelo.nombre);
    }

    setEnviando(true);
    try {
      await fetch(FORM.action, {
        method: "POST",
        mode: "no-cors",
        body: data,
      });
      router.push("/gracias");
    } finally {
      setEnviando(false);
    }
  }

  const inputBase =
    "w-full border border-[color:var(--color-border-strong)] bg-white px-4 py-3 text-[0.9375rem] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-3)] transition-colors duration-[--dur-base] " +
    "focus:border-[color:var(--color-ink)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-ink)]/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label={FORM.titulo}
    >
      <div>
        <label htmlFor="lead-nombre" className="mb-1.5 block text-sm font-bold">
          Nombre y apellido
        </label>
        <input
          id="lead-nombre"
          name={FORM.campos.nombre}
          type="text"
          required
          autoComplete="name"
          placeholder="Juan Pérez"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="lead-telefono" className="mb-1.5 block text-sm font-bold">
          Teléfono / WhatsApp
        </label>
        <input
          id="lead-telefono"
          name={FORM.campos.telefono}
          type="tel"
          required
          autoComplete="tel"
          placeholder="+595 9XX XXX XXX"
          className={inputBase}
        />
      </div>

      <div>
        <label htmlFor="lead-email" className="mb-1.5 block text-sm font-bold">
          Correo electrónico
        </label>
        <input
          id="lead-email"
          name={FORM.campos.email}
          type="email"
          required
          autoComplete="email"
          placeholder="juan@ejemplo.com"
          className={inputBase}
        />
      </div>

      {!modelo && (
        <div>
          <label htmlFor="lead-modelo" className="mb-1.5 block text-sm font-bold">
            Modelo de interés
          </label>
          <select
            id="lead-modelo"
            name={FORM.campos.modelo}
            required
            defaultValue=""
            className={cn(inputBase, "appearance-none")}
          >
            <option value="" disabled>
              Elegí un modelo
            </option>
            {modelos.map((m) => (
              <option key={m.slug} value={m.nombre}>
                {m.nombre} · {m.precio}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="mt-2 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-[color:var(--color-ink)] px-8 font-black uppercase tracking-[0.06em] text-white transition-colors duration-[--dur-base] ease-[--ease-out] hover:bg-[color:var(--color-gwm-hover)] disabled:opacity-60"
      >
        {enviando ? (
          <>
            <Loader2 className="size-5 animate-spin" strokeWidth={2.5} aria-hidden="true" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="size-4" strokeWidth={2.5} aria-hidden="true" />
            Solicitar cotización
          </>
        )}
      </button>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-[color:var(--color-text-3)]">
        <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--color-success)]" strokeWidth={2.5} aria-hidden="true" />
        Al enviar aceptás que un asesor GWM te contacte. Origen: {origenEfectivo}.
      </p>
    </form>
  );
}
