/**
 * Modelo de datos del catálogo GWM Paraguay (landing).
 *
 * Fuente: gwm.com.py — páginas de producto verificadas contra el HTML en vivo
 * el 2026-09-02. Las imágenes de cada modelo se descargaron al directorio
 * `public/modelos/<slug>/` (hero del producto + fotos de interior).
 */

export type Modelo = {
  slug: string;
  nombre: string;
  segmento: string;
  precio: string;
  tagline: string;
  descripcion: string;
  destacados: string[];
  specs: { label: string; valor: string }[];
  imagen: string;
  /** Galería de imágenes locales del modelo. */
  galeria: string[];
  fichaPdf?: string;
};

export const modelos: Modelo[] = [
  {
    slug: "h6-gt-phev",
    nombre: "H6 GT PHEV",
    segmento: "SUV deportiva híbrida",
    precio: "Desde USD 39.990",
    tagline: "Deportiva, ecológica y tecnológica",
    descripcion:
      "La H6 GT PHEV es una SUV deportiva de lujo y muy ecológica gracias a su sistema híbrido enchufable, que brinda más autonomía en modo eléctrico para el uso diario.",
    destacados: [
      "Híbrido enchufable (PHEV)",
      "Espacio para 5 adultos",
      "Apple CarPlay y Android Auto",
      "Pantalla táctil",
      "Diseño deportivo y juvenil",
    ],
    specs: [
      { label: "Tipo", valor: "SUV deportiva de lujo" },
      { label: "Motorización", valor: "Híbrido enchufable (PHEV)" },
      { label: "Capacidad", valor: "5 adultos" },
      { label: "Conectividad", valor: "CarPlay y Android Auto" },
    ],
    imagen: "/modelos/h6-gt-phev/hero.webp",
    galeria: [
      "/modelos/h6-gt-phev/hero.webp",
      "/modelos/h6-gt-phev/galeria-1.webp",
      "/modelos/h6-gt-phev/galeria-2.webp",
    ],
    fichaPdf:
      "https://gwm.com.py/storage/productos/h6-gt-phev1762517596.pdf",
  },
  {
    slug: "tank-400-phev",
    nombre: "TANK 400 PHEV 4x4",
    segmento: "SUV 4x4 todoterreno",
    precio: "Desde USD 50.990",
    tagline: "Poder y elegancia sin fronteras",
    descripcion:
      "La TANK 400 4x4 PHEV es el equilibrio perfecto entre poder y elegancia. Potente y elegante, con hasta 107 km de autonomía en modo eléctrico.",
    destacados: [
      "Híbrido enchufable (PHEV) 4x4",
      "Hasta 107 km en modo eléctrico",
      "Sistema ADAS de conducción asistida",
      "Pantalla central de 16,2\"",
      "Asientos de cuero con masajeador",
    ],
    specs: [
      { label: "Tipo", valor: "SUV 4x4 todoterreno" },
      { label: "Motorización", valor: "Híbrido enchufable (PHEV) 4x4" },
      { label: "Autonomía eléctrica", valor: "Hasta 107 km" },
      { label: "Tecnología", valor: "ADAS · Pantalla 16,2\"" },
    ],
    imagen: "/modelos/tank-400-phev/hero.webp",
    galeria: [
      "/modelos/tank-400-phev/hero.webp",
      "/modelos/tank-400-phev/galeria-1.webp",
      "/modelos/tank-400-phev/galeria-2.webp",
    ],
    fichaPdf:
      "https://gwm.com.py/storage/productos/tank-400-4x4-hibrida-enchufable1750267826.pdf",
  },
  {
    slug: "poer-plus-24t",
    nombre: "POER PLUS 2.4T",
    segmento: "Camioneta doble cabina",
    precio: "Desde USD 35.990",
    tagline: "Más poder para dominar cualquier terreno",
    descripcion:
      "La nueva POER PLUS 2.4 con más poder para dominar cualquier terreno. Doble cabina con motor diésel 2.4T y gran capacidad de carga.",
    destacados: [
      "Motor 2.4T diésel",
      "Capacidad de carga de 1.050 kg",
      "Panel de instrumentos de 7\"",
      "Pantalla multimedia de 12,3\"",
      "Apple CarPlay y Android Auto",
    ],
    specs: [
      { label: "Tipo", valor: "Camioneta doble cabina" },
      { label: "Motor", valor: "2.4T diésel" },
      { label: "Carga útil", valor: "1.050 kg" },
      { label: "Conectividad", valor: "CarPlay y Android Auto" },
    ],
    imagen: "/modelos/poer-plus-24t/hero.webp",
    galeria: [
      "/modelos/poer-plus-24t/hero.webp",
      "/modelos/poer-plus-24t/galeria-1.webp",
      "/modelos/poer-plus-24t/galeria-2.webp",
    ],
    fichaPdf:
      "https://gwm.com.py/storage/productos/poer-plus1756993372.pdf",
  },
];

export function getModeloBySlug(slug: string): Modelo | undefined {
  return modelos.find((m) => m.slug === slug);
}
