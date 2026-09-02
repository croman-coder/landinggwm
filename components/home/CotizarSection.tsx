import { ShieldCheck, Wallet, Wrench } from "lucide-react";
import { LeadForm } from "@/components/form/LeadForm";
import { SectionTitle } from "@/components/ui/SectionTitle";

const RAZONES = [
  {
    icon: Wallet,
    titulo: "Precio de lanzamiento",
    texto: "Cotizaciones personalizadas de cada modelo según tu forma de pago y financiación.",
  },
  {
    icon: ShieldCheck,
    titulo: "Tecnología PHEV",
    texto: "H6 GT y TANK 400 combinan motor naftero y eléctrico para más autonomía y eficiencia.",
  },
  {
    icon: Wrench,
    titulo: "Respaldo y postventa",
    texto: "Servicio oficial GWM para mantener tu vehículo siempre en óptimas condiciones.",
  },
];

/**
 * Sección ancla #cotizar: el formulario de leads es el corazón de la landing.
 * Los datos van a Google Forms con origen "QR POP UP".
 */
export function CotizarSection() {
  return (
    <section
      id="cotizar"
      aria-labelledby="titulo-cotizar"
      className="bg-[color:var(--color-surface)] py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Copy + razones */}
          <div className="lg:col-span-6">
            <SectionTitle
              id="titulo-cotizar"
              eyebrow="Cotizá sin compromiso"
              title="Dejanos tus datos y te contactamos"
              description="Completá el formulario y un asesor GWM te envía la cotización del modelo que elegiste."
            />

            <ul className="mt-10 space-y-6">
              {RAZONES.map((r) => (
                <li key={r.titulo} className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center bg-[color:var(--color-ink)] text-white">
                    <r.icon className="size-5" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-black">{r.titulo}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-text-2)]">
                      {r.texto}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-6">
            <div className="border border-[color:var(--color-border-strong)] bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}