# GWM Paraguay — Landing de modelos

Landing de captura de leads de los modelos **H6 GT PHEV**, **TANK 400 PHEV 4x4** y **POER PLUS 2.4T** de GWM Paraguay, replicando la estructura y el estilo de `jac-paraguay` (Next.js + React + Tailwind v4).

Hay dos formas de llegar:

- **La landing general** (`/`) — los 3 modelos, con selector de modelo en el formulario. Es la que indexa el dominio.
- **Una landing por modelo** (`/h6-gt-phev`, `/tank-400-phev`, `/poer-plus-24t`) — cada QR impreso lleva a la suya. Ahí solo se ve ESE modelo (nada de navegación a los otros 2, ni en el header ni en el footer), el formulario no tiene el desplegable de modelo (va fijo por código) y el origen del lead queda rotulado por cuál QR fue (`QR H6-GT`, `QR TANK-400`, `QR POER-PLUS`), para poder medir cada uno por separado en la misma hoja de respuestas.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (design tokens en `app/globals.css`)
- **Framer Motion** (reveals) y **Lucide** (íconos)
- Fuente **Lato** auto-hospedada vía `next/font`

## Estructura

```
app/
  layout.tsx            # html/body, fuente, metadata global — SIN Header/Footer
  (main)/                 # grupo de rutas: landing general + /gracias
    layout.tsx            # monta PageChrome (Header/Footer completos)
    page.tsx               # landing general (los 3 modelos)
    gracias/page.tsx
  (modelo)/[slug]/         # grupo de rutas: una landing por modelo (la del QR)
    layout.tsx              # resuelve el modelo por slug, monta PageChrome aislado
    page.tsx                 # Hero + specs + formulario de ESE modelo
components/
  home/                 # Hero, HeroModelo, ModelShowcase, ModeloDetalle, CotizarSection
  form/LeadForm.tsx     # Formulario de leads → Google Forms (con o sin selector)
  layout/               # Header, Footer, WhatsAppFAB, PageChrome
  ui/                   # Button, Container, SectionTitle, Reveal, Badge, WhatsAppIcon
content/
  modelos.ts            # Los 3 modelos (datos verificados de gwm.com.py)
  contacto.ts           # Contacto + Google Forms + origen por QR
public/modelos/         # Imágenes locales de cada modelo (hero + galeria-N, .webp)
lib/                    # site.ts, seo.ts, utils.ts
```

`app/layout.tsx` no arma el Header/Footer: un layout no recibe los `params`
del segmento hijo, así que no puede saber si la página es de un solo modelo.
Cada grupo `(main)` / `(modelo)` decide eso y arma su propio `PageChrome`
(`components/layout/PageChrome.tsx`) — mismo Header/Footer/FAB, con o sin el
modo aislado.

## Configuración del formulario de leads

El formulario envía los datos a un **Google Forms**. Hoy `content/contacto.ts` tiene placeholders (`entry.REEMPLAZAR_...`): mientras no se reemplacen, el formulario le dice "gracias" al visitante pero **no guarda nada** — hay que crear el Form real antes de imprimir cualquier QR.

**Creá el Form con 4 campos, los 4 como "Respuesta corta"** (ninguno como desplegable — el desplegable original vive en el código, no en el Form):

| Campo del Form | Lo llena |
|---|---|
| Nombre y apellido | el visitante |
| Teléfono / WhatsApp | el visitante |
| Correo electrónico | el visitante |
| Modelo de interés | el código (el desplegable de la landing general, o fijo por página en las de un solo modelo) |

Sumale un 5º campo oculto para el origen (igual "Respuesta corta"): **Origen**. No lo completa nadie a mano — lo manda el código con el valor de `FORM.origen` o de `ORIGEN_POR_MODELO`, según de qué landing vino.

En **Respuestas → ⋮ → Crear hoja de cálculo** conectás una Google Sheet que se llena sola con cada envío — no hace falta backend ni volumen en el servidor para esto.

La configuración vive en `content/contacto.ts` → `export const FORM`. Cuando tengas el Google Form creado, editá estos valores:

```ts
export const FORM = {
  origen: "QR POP UP",                            // Origen de la landing GENERAL (con selector)
  action: "https://docs.google.com/forms/d/e/<FORM_ID>/formResponse",
  campos: {
    nombre:   "entry.<NOMBRE_ENTRY>",
    telefono: "entry.<TELEFONO_ENTRY>",
    email:    "entry.<EMAIL_ENTRY>",
    modelo:   "entry.<MODELO_ENTRY>",
    origen:   "entry.<ORIGEN_ENTRY>",              // Campo oculto
  },
};
```

> **Cómo obtener los `entry.XXXXXX`:** en la vista previa del Form, examiná el HTML de cada campo y copiá el `name="entry.XXXXXX"`. La URL de envío es el `action` del `<form>` de esa misma vista previa, termina en `/formResponse`.

### Origen por landing

`content/contacto.ts` → `ORIGEN_POR_MODELO` mapea cada slug a su rótulo
(`"QR H6-GT"`, `"QR TANK-400"`, `"QR POER-PLUS"`). La landing general sigue
usando `FORM.origen` ("QR POP UP"). `LeadForm` manda uno u otro sin que el
visitante lo vea ni lo elija.

## Correr el proyecto

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # build de producción
npm run lint       # eslint
```

## Los 3 QR

Cada uno es solo la URL de su landing, sin nada especial del lado del código:

| Modelo | URL |
|---|---|
| H6 GT PHEV | `https://gwm.santarosa.lat/h6-gt-phev` |
| TANK 400 PHEV 4x4 | `https://gwm.santarosa.lat/tank-400-phev` |
| POER PLUS 2.4T | `https://gwm.santarosa.lat/poer-plus-24t` |

Se generan aparte, para imprimir — no son parte del build ni del repo:

```bash
npx qrcode "https://gwm.santarosa.lat/h6-gt-phev" -o qr-h6-gt-phev.png -w 1000
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