import type { Metadata } from "next";
import { SITE } from "@/lib/site";

type SeoArgs = {
  title?: string;
  description?: string;
  path?: string;
};

/** Helper standard de metadata para páginas de la landing. */
export function buildMetadata({
  title,
  description,
  path = "/",
}: SeoArgs = {}): Metadata {
  const pageTitle = title ? `${title} | GWM Paraguay` : "GWM Paraguay";
  const desc = description ?? SITE.description;

  return {
    title: pageTitle,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      siteName: SITE.name,
      url: `${SITE.url}${path}`,
      title: pageTitle,
      description: desc,
    },
  };
}
