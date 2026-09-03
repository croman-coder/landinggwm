# Publicar la landing de GWM en Coolify — servidor SRPY186

Runbook para dejarla andando en **https://gwm.santarosa.lat**, mismo patrón que
`compras.santarosa.lat`, `callbot.santarosa.lat` y `jac`.

> **Estado: sin ejecutar.** Lo que está en el repo (Dockerfile, `output:
> "standalone"`, dominio en `lib/site.ts`) sí está probado: `npm run build`
> genera `.next/standalone/server.js`. Lo que sigue del "Paso 1" para abajo
> **no se corrió**: desde la máquina donde se escribió esto no hay Tailscale ni
> acceso al server, y Docker Desktop estaba apagado, así que tampoco se
> construyó la imagen. Los datos de infraestructura (UUID del túnel, rutas,
> puertos) vienen de los runbooks de `gestion-compras` y `callbots`;
> verificalos antes de confiar en ellos.

| | |
|---|---|
| **Dominio** | https://gwm.santarosa.lat |
| **Servidor** | `srpy186` — `100.112.44.111` por Tailscale (LAN `192.168.221.87`) |
| **Coolify** | http://100.112.44.111:8090 — proyecto **SRPY** / entorno `production` |
| **Repo** | `croman-coder/landinggwm`, rama `main` |
| **Build pack** | **Dockerfile** (no Nixpacks) |
| **Puerto interno** | `3000` |

El TLS lo termina Cloudflare. El túnel `505fc6ac-4f83-4fbe-b490-9110828589ea`
ya corre en el server como el container `cloudflared-compras` y sirve `compras`,
`jac` y `callbot`; a esta landing hay que **agregarle una entrada de ingress**,
no crear un túnel nuevo.

> El puerto de Coolify difiere entre los dos runbooks viejos: el de `compras`
> (10/08) dice `:8000`, el de `callbots` (14/08) dice `:8090` y que `:8000` lo
> ocupa `supabase-kong`. El segundo es posterior. Si `:8090` no contesta,
> probá `:8000`.

---

## Lo que cambió en el repo para poder desplegar

| Archivo | Cambio | Por qué |
|---|---|---|
| `next.config.ts` | `output: "standalone"` | Deja en `.next/standalone` un `server.js` con solo las dependencias trazadas. Sin esto la imagen de runtime tendría que llevar `node_modules` entero. |
| `Dockerfile` | nuevo, 3 etapas | Fija en el repo cómo arranca la app. Nixpacks también autodetecta Next, pero deja esa decisión fuera del control de versiones. |
| `.dockerignore` | nuevo | Sin él viajan `node_modules` y `.next` locales al contexto de build — y el `sharp` compilado para Windows revienta dentro de Alpine. |
| `package.json` | `sharp` de `devDependencies` a `dependencies` | Lo usa el optimizador de imágenes de Next **en runtime**, no en el build. Como devDependency, cualquier instalación sin dev deja las `<Image>` tirando 500. |
| `lib/site.ts` | `SITE.url` → `https://gwm.santarosa.lat` | De ahí salen las URL canónicas y las de Open Graph: son las que ve WhatsApp al previsualizar el enlace del QR. |

`INDEXABLE` **queda en `false` a propósito**, también publicada: el tráfico
entra por el QR de la campaña, no por Google, e indexar una landing de marca GWM
bajo `santarosa.lat` le competiría a `gwm.com.py` por las mismas búsquedas.

---

## Paso 0 — Commitear y pushear

Coolify despliega desde GitHub, no desde tu disco.

```bash
git add Dockerfile .dockerignore next.config.ts package.json package-lock.json lib/site.ts docs/deploy-coolify.md && git commit -m "chore: preparar despliegue en Coolify" && git push origin main
```

---

## Paso 1 — Crear la aplicación en Coolify

Dashboard por Tailscale → proyecto **SRPY** / entorno `production` → **+ New** →
repositorio de GitHub.

| Campo | Valor |
|---|---|
| Repository | `https://github.com/croman-coder/landinggwm` |
| Branch | `main` |
| Build Pack | **Dockerfile** |
| Dockerfile Location | `/Dockerfile` |
| Port Exposes | `3000` |
| Is Static | **false** |

`Is Static` en `true` haría que Coolify sirva el build con nginx en vez de
arrancar el server de Next. Acá las tres rutas son estáticas, así que a primera
vista "funcionaría" — pero el optimizador de `next/image` es una ruta del
server, y sin él todas las fotos de los modelos dejan de resolverse.

**No hacen falta variables de entorno.** La landing no tiene backend: el
formulario postea directo a Google Forms desde el browser y no hay secreto que
cargar. Si algún día se agrega alguna, ojo con las `NEXT_PUBLIC_*`: se hornean
en el build y hay que marcarlas como *build time*.

---

## Paso 2 — Dominio

En la aplicación → **Domains**:

```
http://gwm.santarosa.lat
```

**Con `http://`, no `https://`.** Con `https` Coolify le agrega a Traefik el
middleware `redirect-to-https`; como Cloudflare ya terminó el TLS y le habla
HTTP plano a Traefik, eso queda en un loop de redirects. El candado en el
browser lo pone Cloudflare igual.

Y **desactivá Let's Encrypt / Force HTTPS** para esta app: si Coolify también
intenta emitir certificado, se pisa con Cloudflare.

---

## Paso 3 — Ingress en el túnel de Cloudflare

El túnel ya existe y ya apunta a `coolify-proxy:80`. Solo hay que sumarle el
hostname en `/home/santarosa/cloudflared-compras/config.yml`, **antes** de la
regla catch-all `http_status:404`:

```yaml
  - hostname: gwm.santarosa.lat
    service: http://coolify-proxy:80
```

Después, reiniciar el container del túnel:

```bash
docker restart cloudflared-compras
```

Y crear el CNAME. El `--overwrite-dns` y el UUID explícito no son opcionales:
sin ellos `cloudflared` toma el túnel por defecto del `config.yml` local y el
CNAME termina apuntando al túnel equivocado (pasó con `compras`).

```bash
cloudflared tunnel route dns --overwrite-dns 505fc6ac-4f83-4fbe-b490-9110828589ea gwm.santarosa.lat
```

---

## Paso 4 — Desplegar y verificar

Botón **Deploy** en Coolify. El primer build baja el árbol de npm entero, así
que tarda algunos minutos; los siguientes reusan la capa de `npm ci` mientras no
cambie `package-lock.json`.

```bash
dig +short gwm.santarosa.lat
```

Tiene que devolver IPs de Cloudflare (`104.21.x` / `172.67.x`).

```bash
curl -sI https://gwm.santarosa.lat | head -3
```

Esperado `HTTP/2 200`. Si da:

- **404** → Traefik no está ruteando ese hostname. Es el Paso 2, o `custom_labels` (ver abajo).
- **502 / 503** → el container no está corriendo o no escucha en 3000. Mirá los logs de runtime, no los del build.
- **Timeout** → el ingress del túnel (Paso 3) no quedó, o falta reiniciar `cloudflared-compras`.

Y revisá a ojo lo que no da error pero sale mal:

- Las imágenes de los modelos (`/modelos/<slug>/hero.webp`) — si tiran 500, es
  `sharp`; ver la nota de `package.json` más arriba.
- El logo del header y las fichas técnicas PDF, que se sirven desde `gwm.com.py`.
- El link de WhatsApp y el envío del formulario de punta a punta, contra el
  Google Form real.
- La previsualización del enlace en WhatsApp, que es por donde va a circular.

---

## Antes de cualquier redeploy: `custom_labels`

Es la trampa que ya tiró abajo `compras` una vez. En `ApplicationDeploymentJob`,
si `custom_labels` tiene algo, gana sobre las labels regeneradas y la
regeneración ni corre — el sitio se cae con 404 aunque el container esté sano.
Tiene que quedar en `NULL` para que las labels se regeneren de la config en cada
deploy.

Ver el valor actual:

```bash
ssh srpy-servidor 'docker exec coolify php artisan tinker --execute="echo var_export(\App\Models\Application::where(\"uuid\",\"EL-UUID\")->first()->custom_labels, true);"'
```

Ver las labels que Coolify va a generar, **sin desplegar**:

```bash
ssh srpy-servidor 'docker exec coolify php artisan tinker --execute="foreach (generateLabelsApplication(\App\Models\Application::where(\"uuid\",\"EL-UUID\")->first()) as \$l) { echo \$l . PHP_EOL; }"'
```

Tienen que salir el `Host(...)` con `gwm.santarosa.lat`,
`loadbalancer.server.port=3000`, `middlewares=gzip` y **ningún** router
`https-0-` ni `redirect-to-https`.

---

## Operación

Estado de los containers:

```bash
ssh srpy-servidor 'docker ps -a --filter name=EL-UUID --format "{{.Names}} | {{.Status}}"'
```

Logs:

```bash
ssh srpy-servidor 'docker logs --tail 50 $(docker ps --filter name=EL-UUID --format "{{.Names}}" | head -1)'
```

Anotá acá el UUID de la aplicación cuando la crees: `________________`.

---

## Pendientes

1. **Nada del Paso 1 en adelante se ejecutó.** Ver el aviso del principio.
2. **El Google Form todavía no está configurado.** `content/contacto.ts` →
   `FORM` tiene placeholders `entry.<...>`: publicada así, el formulario acepta
   los datos del visitante y no los guarda en ningún lado. Esto se resuelve
   antes de imprimir el QR, no después.
3. **No hay analítica.** Si la campaña necesita medir la conversión del QR, hay
   que decidir con qué (GA4, Plausible, o el pixel que ya usen) y meterlo en
   `app/layout.tsx`.
