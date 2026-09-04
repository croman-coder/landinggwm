import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { modelos, getModeloBySlug } from "@/content/modelos";
import { buildMetadata } from "@/lib/seo";
import { HeroModelo } from "@/components/home/HeroModelo";
import { ModeloDetalle } from "@/components/home/ModeloDetalle";
import { CotizarSection } from "@/components/home/CotizarSection";

type Params = { slug: string };

/** Prerenderiza los 3 modelos. `dynamicParams = false` de abajo hace que
 *  cualquier otro slug reciba el 404 estándar de Next, sin invocar esta
 *  página. */
export function generateStaticParams(): Params[] {
  return modelos.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const modelo = getModeloBySlug(slug);
  if (!modelo) return {};

  return buildMetadata({
    title: modelo.nombre,
    description: `${modelo.tagline}. ${modelo.precio}. Dejanos tus datos y un asesor GWM te contacta con la cotización.`,
    path: `/${modelo.slug}`,
    image: modelo.imagen,
  });
}

export default async function ModeloPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const modelo = getModeloBySlug(slug);
  if (!modelo) notFound();

  return (
    <>
      <HeroModelo modelo={modelo} />
      <ModeloDetalle modelo={modelo} />
      <CotizarSection modelo={modelo} />
    </>
  );
}
