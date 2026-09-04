import type { Metadata } from "next";
import { SITE } from "@/lib/site";

type SeoArgs = {
  title?: string;
  description?: string;
  path?: string;
  /** Ruta local (ej. `/modelos/h6-gt-phev/hero.webp`) para `og:image`. */
  image?: string;
};

/**
 * Helper standard de metadata para páginas de la landing.
 *
 * `title` se pasa CRUDO (sin sufijo): el layout raíz ya define
 * `title.template = "%s | GWM Paraguay"`, así que Next se lo aplica solo. Si
 * acá también le agregáramos el sufijo, quedaría duplicado
 * ("Gracias | GWM Paraguay | GWM Paraguay").
 *
 * `openGraph.title` sí necesita el sufijo a mano: ese campo no hereda el
 * template del `<title>`, es un string independiente.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
}: SeoArgs = {}): Metadata {
  const desc = description ?? SITE.description;

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: `${SITE.url}${path}`,
      title: title ? `${title} | GWM Paraguay` : SITE.name,
      description: desc,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}
