/**
 * Configuración del sitio.
 *
 * `INDEXABLE` está en false a propósito: la landing vive en preview de
 * Vercel hasta que se defina el dominio. Mientras sea false emite
 * `noindex, nofollow`.
 */
export const INDEXABLE = false;

export const SITE = {
  url: "https://gwm-py-landing.vercel.app",
  name: "GWM Paraguay",
  shortName: "GWM Paraguay",
  locale: "es_PY",
  lang: "es-PY",
  description:
    "Landing de los modelos GWM H6 GT PHEV, TANK 400 PHEV 4x4 y POER PLUS 2.4T en Paraguay. Dejanos tus datos y un asesor te contacta.",
} as const;

export const NAV = [
  { label: "Modelos", href: "#modelos" },
  { label: "H6 GT", href: "#h6-gt-phev" },
  { label: "TANK 400", href: "#tank-400-phev" },
  { label: "POER PLUS", href: "#poer-plus-24t" },
  { label: "Cotizá", href: "#cotizar" },
] as const;
