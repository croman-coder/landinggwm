# GWM Paraguay — Landing de modelos

Landing de captura de leads de los modelos **H6 GT PHEV**, **TANK 400 PHEV 4x4** y **POER PLUS 2.4T** de GWM Paraguay, replicando la estructura y el estilo de `jac-paraguay` (Next.js + React + Tailwind v4).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens en `app/globals.css`)
- **Framer Motion** (reveals) y **Lucide** (íconos)
- Fuente **Lato** auto-hospedada vía `next/font`

## Estructura

```
app/                    # layout.tsx, page.tsx (landing), gracias/, globals.css
components/
  home/                 # Hero, ModelShowcase, CotizarSection
  form/LeadForm.tsx     # Formulario de leads → Google Forms
  layout/               # Header, Footer, WhatsAppFAB
  ui/                   # Button, Container, SectionTitle, Reveal, Badge, WhatsAppIcon
content/
  modelos.ts            # Los 3 modelos (datos verificados de gwm.com.py)
  contacto.ts           # Contacto + configuración del Google Forms
public/modelos/         # Imágenes locales de cada modelo (hero + galeria-N, .webp)
lib/                    # site.ts, seo.ts, utils.ts
```

## Configuración del formulario de leads

El formulario envía los datos a un **Google Forms** cuyo origen es **"QR POP UP"**.

La configuración vive en `content/contacto.ts` → `export const FORM`. Cuando tengas el Google Form creado, editá estos valores:

```ts
export const FORM = {
  origen: "QR POP UP",                            // Nombre del formulario / origen del lead
  action: "https://docs.google.com/forms/d/e/<FORM_ID>/formResponse",
  campos: {
    nombre:   "entry.<NOMBRE_ENTRY>",              // Campo Nombre y Apellido
    telefono: "entry.<TELEFONO_ENTRY>",            // Campo Teléfono
    email:    "entry.<EMAIL_ENTRY>",               // Campo Email
    modelo:   "entry.<MODELO_ENTRY>",              // Select de modelo de interés
    origen:   "entry.<ORIGEN_ENTRY>",              // Campo oculto ORIGEN con valor "QR POP UP"
  },
};
```

> **Cómo obtener los `entry.XXXXXX`:** creá el formulario en Google Forms, abrí la vista previa, examiná el HTML del campo correspondiente y copiá el valor del atributo `name="entry.XXXXXX"`. La URL final tiene `.py`... no, la URL de envío termina en `/formResponse` (mirá el atributo `action` del `<form>` de la vista previa).

### Campo oculto de origen "QR POP UP"

El `LeadForm` fija automáticamente `FORM.campos.origen = "QR POP UP"` antes de enviar. Para que el lead llegue rotulado en Google Sheets, agregá en tu formulario un campo de respuesta (puede quedar oculto en el form de edición) con el `entry` correspondiente.

## Correr el proyecto

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # build de producción
npm run lint       # eslint
```

## Despliegue

Se publica en **https://gwm.santarosa.lat** con Coolify en el servidor SRPY186,
detrás del mismo túnel de Cloudflare que `compras` y `callbot`. El runbook
completo —incluidas las trampas de Coolify que ya mordieron en otros
proyectos— está en [`docs/deploy-coolify.md`](docs/deploy-coolify.md).

```bash
docker build -t gwm-landing . && docker run --rm -p 3000:3000 gwm-landing
```

## Notas

- `INDEXABLE` en `lib/site.ts` está en `false` **a propósito, también en producción**: el tráfico entra por el QR de la campaña y no conviene competirle a `gwm.com.py` por las búsquedas de marca. `SITE.url` sí apunta al dominio real, porque de ahí salen las URL canónicas y las de Open Graph.
- El WhatsApp y las redes se leen de `content/contacto.ts`.
- Las imágenes de los modelos viven en `public/modelos/<slug>/` en formato `.webp` y con la convención `hero.webp` + `galeria-N.webp` (misma que usa `jac-paraguay`). El logo de GWM del header/footer y las fichas técnicas PDF se sirven desde `gwm.com.py`.