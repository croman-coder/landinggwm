/**
 * Datos de contacto y redes de GWM Paraguay.
 * Fuente: gwm.com.py — verificados contra el HTML en vivo.
 */

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
 * Configuración del formulario de leads (Google Forms).
 *
 * ⚠️ CONFIGURABLE: el formulario Google Forms original se llama "QR POP UP".
 * Conectar acá los `entry.XXXXXX` de los campos reales y la `formResponse` del
 * formulario creado. Los placeholders actuales no envían datos reales; solo
 * mantienen el flujo funcionando de punta a punta hasta que se reemplacen.
 */
export const FORM = {
  /** Nombre del formulario de origen. Los leads quedan rotulados así. */
  origen: "QR POP UP",
  /** URL de envío del Google Form (acción `formResponse`). */
  action: "https://docs.google.com/forms/d/e/REEMPLAZAR_FORM_ID/formResponse",
  titulo: "Solicitá tu cotización",
  descripcion:
    "Dejanos tus datos y un asesor te contacta con una cotización personalizada del modelo que elijas.",
  campos: {
    /** Campo Nombre y Apellido. */
    nombre: "entry.REEMPLAZAR_NOMBRE",
    /** Campo Teléfono / WhatsApp. */
    telefono: "entry.REEMPLAZAR_TELEFONO",
    /** Campo Email. */
    email: "entry.REEMPLAZAR_EMAIL",
    /** Campo Modelo de interés. */
    modelo: "entry.REEMPLAZAR_MODELO",
    /** Campo oculto: origen del lead. Valor fijo "QR POP UP". */
    origen: "entry.REEMPLAZAR_ORIGEN",
  },
} as const;
