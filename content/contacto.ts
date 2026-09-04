/**
 * Datos de contacto y redes de GWM Paraguay.
 * Fuente: gwm.com.py — verificados contra el HTML en vivo.
 */

import type { Modelo } from "@/content/modelos";

export const CONTACTO = {
  whatsapp: "+595976955836",
  whatsappFormato: "+595 976 955 836",
  email: "contacto@gwm.com.py",
  redes: {
    facebook: "https://www.facebook.com/GreatWallPamosa/",
    instagram: "https://www.instagram.com/gwmpy/",
  },
  mensajeGenerico:
    "Hola, vengo desde la landing de GWM y quiero información sobre los modelos H6 GT, TANK 400 o POER PLUS.",
} as const;

/** Arma el link de WhatsApp con el mensaje ya codificado. */
export function whatsappUrl(numero: string, mensaje: string): string {
  const digitos = numero.replace(/\D/g, "");
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje de WhatsApp según la página. Sin `modelo` (landing general), el
 * genérico de los 3. Con `modelo` (landing de un solo modelo, la del QR),
 * nombra solo ese — nombrar a los otros dos ahí contradice el aislamiento.
 */
export function mensajeWhatsApp(modelo?: Modelo): string {
  return modelo
    ? `Hola, vengo desde la landing de GWM y quiero información sobre el ${modelo.nombre}.`
    : CONTACTO.mensajeGenerico;
}

/**
 * Valor que se manda en el campo "Modelo de Interés" del Google Form.
 *
 * Lleva el modelo Y de dónde vino el lead en un solo dato, porque el Form
 * tiene una sola columna para eso:
 *
 *   desde un QR impreso   → "POER PLUS 2.4T (QR)"
 *   desde la landing general → "POER PLUS 2.4T (web)"
 *
 * Así la planilla sirve para las dos cosas: el vendedor ve qué auto quiere
 * la persona, y marketing puede contar cuántos leads trajo cada QR sin
 * necesidad de una columna extra.
 */
export function valorModelo(nombre: string, desdeQR: boolean): string {
  return `${nombre} ${desdeQR ? "(QR)" : "(web)"}`;
}

/**
 * Configuración del formulario de leads (Google Forms).
 *
 * Form: "Formulario de Modelos Columbia". Los 4 campos son de respuesta
 * corta y obligatorios; "Modelo de Interés" NO lo completa el visitante,
 * lo manda el código (ver `valorModelo`). Verificado el 2026-09-04 con un
 * envío real: acepta POST anónimo, sin login ni recolección de correo.
 *
 * Si algún día se recrea el Form, estos `entry.XXXXXX` cambian. Se sacan
 * del HTML de la vista previa (están en el blob `FB_PUBLIC_LOAD_DATA_`,
 * no como atributos `name` sueltos).
 */
export const FORM = {
  /** URL de envío del Google Form (acción `formResponse`). */
  action:
    "https://docs.google.com/forms/d/e/1FAIpQLSdRsoH6i3eYWKaUg41vadjpgIYhmaa4c9sguRuenhQmihRVcw/formResponse",
  titulo: "Solicitá tu cotización",
  descripcion:
    "Dejanos tus datos y un asesor te contacta con una cotización personalizada del modelo que elijas.",
  campos: {
    /** Nombre y Apellido. */
    nombre: "entry.1514241206",
    /** Teléfono / Whatsapp. */
    telefono: "entry.398727019",
    /** Correo Electrónico. */
    email: "entry.706488911",
    /** Modelo de Interés. Lo fija el código, no el visitante. */
    modelo: "entry.1172442362",
  },
} as const;
