# GWM Paraguay — Landing de modelos

Landing de captura de leads de los modelos **H6 GT PHEV**, **TANK 400 PHEV 4x4** y **POER PLUS 2.4T** de GWM Paraguay, replicando la estructura y el estilo de `jac-paraguay` (Next.js + React + Tailwind v4).

Hay dos formas de llegar:

- **La landing general** (`/`) — los 3 modelos, con selector de modelo en el formulario. Es la que indexa el dominio.
- **Una landing por modelo** (`/h6-gt-phev`, `/tank-400-phev`, `/poer-plus-24t`) — cada QR impreso lleva a la suya. Ahí solo se ve ESE modelo (nada de navegación a los otros 2, ni en el header ni en el footer) y el formulario no tiene el desplegable de modelo: va fijo por código, rotulado `(QR)` para poder distinguirlo en la hoja de respuestas de los que entran por la landing general.

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

Los leads van a un **Google Form** ("Formulario de Modelos Columbia"), que los
deja en su hoja de respuestas vinculada. No hay backend ni base de datos: el
navegador del visitante postea directo al `formResponse` del Form.

Conectado y verificado el 2026-09-04 con un envío real. La configuración vive
en `content/contacto.ts` → `FORM`:

| Campo del Form | `entry` | Lo completa |
|---|---|---|
| Nombre y Apellido | `entry.1514241206` | el visitante |
| Teléfono / Whatsapp | `entry.398727019` | el visitante |
| Correo Electrónico | `entry.706488911` | el visitante |
| Modelo de Interés | `entry.1172442362` | **el código** |

Los 4 son de respuesta corta y obligatorios. "Modelo de Interés" no lo ve el
visitante como tal: en las landings de un modelo lo fija el código, y en la
general sale del desplegable.

### El valor del modelo lleva también el origen

El Form tiene una sola columna para el modelo, así que `valorModelo()`
(en `content/contacto.ts`) le agrega de dónde vino el lead:

```
POER PLUS 2.4T (QR)    ← escaneó el QR impreso de ese modelo
POER PLUS 2.4T (web)   ← entró a la landing general y lo eligió del desplegable
```

Así la misma columna sirve para las dos cosas: el vendedor ve qué auto quiere
la persona, y se puede contar cuántos leads trajo cada QR sin una columna extra.

### Si algún día se recrea el Form

Los `entry.XXXXXX` cambian. **No están como atributos `name` en el HTML** — hay
que sacarlos del blob `FB_PUBLIC_LOAD_DATA_` de la vista previa:

```bash
curl -sL "https://docs.google.com/forms/d/e/<FORM_ID>/viewform" -o form.html
python3 -c "
import re, json
d = json.loads(re.search(r'FB_PUBLIC_LOAD_DATA_ = (\[.*?\]);', open('form.html', encoding='utf-8').read(), re.S).group(1))
for q in d[1][1]:
    for c in (q[4] or []): print(f'entry.{c[0]}', q[1])
"
```

> **Importante:** el Form no puede exigir inicio de sesión ni estar restringido
> a la organización. Si lo está, los envíos se pierden **en silencio** — el
> visitante ve "gracias" y el lead nunca llega.

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