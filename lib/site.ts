/**
 * Configuración del sitio.
 *
 * `INDEXABLE` queda en false a propósito, también publicada: la landing vive
 * en santarosa.lat, que es el dominio de operaciones, y su tráfico entra por
 * el QR de la campaña, no por Google. Indexarla acá le competiría a
 * gwm.com.py por las mismas búsquedas de marca. Mientras sea false emite
 * `noindex, nofollow`.
 *
 * `SITE.url` sí apunta al dominio real: de ahí salen las URL canónicas y las
 * de Open Graph, que son las que ve WhatsApp al previsualizar el enlace.
 */
export const INDEXABLE = false;

export const SITE = {
  url: "https://gwm.santarosa.lat",
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
