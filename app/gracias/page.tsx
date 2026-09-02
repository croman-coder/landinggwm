import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gracias",
  description: "Gracias por dejar tus datos. Un asesor GWM te contactará.",
  path: "/gracias",
});

export default function GraciasPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[color:var(--color-ink)] px-4 py-24 text-center">
      <div className="max-w-md">
        <p className="mb-5 flex items-center justify-center text-[length:var(--text-eyebrow)] font-bold uppercase tracking-[0.14em] text-white/70">
          Listo
        </p>
        <h1 className="text-[length:var(--text-h1)] text-white">
          Gracias por tu interés.
          <br />
          Ya estamos en contacto.
        </h1>
        <p className="mt-5 text-white/75">
          Un asesor GWM te va a escribir al teléfono o correo que dejaste con
          la cotización del modelo elegido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center bg-white px-7 font-bold uppercase tracking-[0.06em] text-[color:var(--color-ink)] transition-colors duration-[--dur-base] hover:bg-white/85"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}