import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getModeloBySlug } from "@/content/modelos";
import { PageChrome } from "@/components/layout/PageChrome";

/**
 * Landing de un solo modelo (la que abre cada QR impreso): Header y Footer
 * aislados, sin navegación a los otros 2.
 *
 * En la práctica este `notFound()` no debería disparar nunca: `page.tsx`
 * declara `dynamicParams = false`, así que Next devuelve su 404 estándar
 * para cualquier slug fuera de los 3 conocidos sin llegar a renderizar
 * nada de acá. Queda como resguardo de tipos, no como camino real.
 */
export default async function ModeloLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const modelo = getModeloBySlug(slug);
  if (!modelo) notFound();

  return <PageChrome modelo={modelo}>{children}</PageChrome>;
}
