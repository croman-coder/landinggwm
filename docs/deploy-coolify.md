# Landing de GWM en Coolify — servidor SRPY186

Runbook del despliegue. Verificado contra el servidor el **2026-09-03**, no es
una guía teórica.

> **Estado: en línea.** https://gwm.santarosa.lat responde 200 de punta a punta
> desde el 2026-09-03. Verificado: `/` y `/gracias` en 200, los `.webp` de los
> modelos, el optimizador `/_next/image`, `robots: noindex, nofollow, nocache` y
> `og:url` apuntando al dominio correcto.

| | |
|---|---|
| **Dominio** | https://gwm.santarosa.lat |
| **Servidor** | `srpy186` — LAN `192.168.221.87` |
| **Coolify** | http://192.168.221.87:8090 — proyecto **SRPY** / entorno `production` |
| **App UUID** | `x6fsgjdswj0ehatl9jgwd2bo` |
| **Repo** | `croman-coder/landinggwm`, rama `main`, build pack *Dockerfile* |
| **Puerto interno** | `3000` |

UUIDs que hacen falta para cualquier llamada a la API:

| Recurso | UUID |
|---|---|
| Proyecto SRPY | `ss9h84bpll0l4ghzg2r6cq02` |
| Entorno `production` | `kifejxc5878yledqr54tlcc8` (id 2) |
| Servidor `localhost` | `y68hpzeifw1h666ga8zxc2ai` |

El TLS lo termina Cloudflare. El túnel `505fc6ac-4f83-4fbe-b490-9110828589ea`
corre como el container `cloudflared-compras` y ya servía otros 13 hostnames;
se le agregó `gwm.santarosa.lat → coolify-proxy:80`. Por eso el dominio en
Coolify va con esquema **`http://`**: con `https://` Coolify mete el middleware
`redirect-to-https` y, como Cloudflare ya viene por HTTP plano contra Traefik,
queda un loop de redirects.

> **Ojo con el puerto de Coolify.** Es **8090**. El `:8000` que menciona el
> runbook viejo de `gestion-compras` está cerrado; lo ocupa Supabase.

---

## Lo que cambió en el repo

| Archivo | Cambio | Por qué |
|---|---|---|
| `next.config.ts` | `output: "standalone"` | Deja en `.next/standalone` un `server.js` con solo las dependencias trazadas. Es lo que copia el Dockerfile. |
| `Dockerfile` | nuevo, 3 etapas | Fija en el repo cómo arranca la app en vez de dejárselo a Nixpacks. |
| `.dockerignore` | nuevo | Sin él viajan `node_modules` y `.next` locales al contexto de build — y el `sharp` compilado para Windows revienta dentro de Alpine. |
| `package.json` | `sharp` de `devDependencies` a `dependencies` | **No es cosmético.** Lo usa el optimizador de `next/image` en runtime. Como devDependency, la imagen de producción se queda sin él y toda `<Image>` tira 500. Verificado después del deploy: `/_next/image?...` devuelve AVIF de 79 KB. |
| `lib/site.ts` | `SITE.url` → `https://gwm.santarosa.lat` | De ahí salen las canónicas y las de Open Graph, que son las que ve WhatsApp al previsualizar el enlace del QR. |

`INDEXABLE` **queda en `false` a propósito**, también en producción: el tráfico
entra por el QR de la campaña, no por Google, e indexar una landing de marca GWM
bajo `santarosa.lat` le competiría a `gwm.com.py` por las mismas búsquedas.
Verificado en el HTML servido: `<meta name="robots" content="noindex, nofollow, nocache">`.

---

## Cómo quedó creada la aplicación

El repo es **público**, así que se usó `POST /api/v1/applications/public` y no
hizo falta deploy key — a diferencia del resto de las apps del server, que son
repos privados con una llave por proyecto en *Keys & Tokens*.

> Si algún día `landinggwm` pasa a privado, el deploy se rompe con un error de
> clone. La salida es crear un deploy key de solo lectura y setearle
> `private_key_id` a la app.

```bash
ssh srpy-servidor 'T=$(cat ~/.coolify-token); curl -s -X POST \
  "http://localhost:8090/api/v1/applications/public" \
  -H "Authorization: Bearer $T" -H "Content-Type: application/json" \
  -d "{\"project_uuid\":\"ss9h84bpll0l4ghzg2r6cq02\",\"server_uuid\":\"y68hpzeifw1h666ga8zxc2ai\",\"environment_name\":\"production\",\"environment_uuid\":\"kifejxc5878yledqr54tlcc8\",\"git_repository\":\"https://github.com/croman-coder/landinggwm\",\"git_branch\":\"main\",\"build_pack\":\"dockerfile\",\"dockerfile_location\":\"/Dockerfile\",\"ports_exposes\":\"3000\",\"name\":\"landing-gwm\",\"domains\":\"http://gwm.santarosa.lat\",\"instant_deploy\":false}"'
```

### `custom_labels` viene sucia de fábrica

**Coolify pre-carga `custom_labels` al crear la aplicación por API.** Es la
misma trampa que tiró abajo `compras` en agosto: si el campo tiene algo, gana
sobre las labels regeneradas y la regeneración ni corre, así que cualquier
cambio futuro de dominio o de puerto no se aplica y el sitio queda en 404 con el
container perfectamente sano.

Las apps que funcionan en este server lo tienen en `NULL`. Se limpió así:

```bash
ssh srpy-servidor "docker exec -i coolify php artisan tinker" <<'EOF'
$a = \App\Models\Application::where('uuid','x6fsgjdswj0ehatl9jgwd2bo')->first();
$a->custom_labels = null;
$a->save();
echo var_export($a->fresh()->custom_labels, true) . PHP_EOL;
EOF
```

**Verificá esto antes de cada redeploy.** Para ver qué labels va a generar
Coolify, sin desplegar:

```bash
ssh srpy-servidor "docker exec -i coolify php artisan tinker" <<'EOF'
$a = \App\Models\Application::where('uuid','x6fsgjdswj0ehatl9jgwd2bo')->first();
foreach (generateLabelsApplication($a) as $l) { echo $l . PHP_EOL; }
EOF
```

Tienen que salir el `Host(...)` con `gwm.santarosa.lat`,
`loadbalancer.server.port=3000`, `middlewares=gzip` y **ningún** router
`https-0-` ni `redirect-to-https` aplicado.

---

## El túnel corre en DOS connectors — hay que reiniciar los dos

**Esta es la trampa que costó media hora de diagnóstico el 2026-09-03.**

El túnel `505fc6ac-…` no lo sirve un solo container: hay **dos**, y los dos
corren el mismo `tunnelID` montando el mismo `config.yml`:

| Container | Rol |
|---|---|
| `cloudflared-compras` | el que documentaban los runbooks viejos |
| `cloudflared-replica2` | réplica para HA — **la que nadie menciona** |

Cloudflare reparte las peticiones entre los connectors registrados del túnel.
`cloudflared` lee el `config.yml` **una sola vez, al arrancar**: si reiniciás
uno solo, el otro sigue en memoria con las reglas viejas y **la mitad del
tráfico —o todo, según a quién elija el borde— cae al catch-all**.

### Cómo se ve cuando pasa

Un `404` que engaña, porque no viene de donde parece:

- cuerpo **vacío** y **sin `Content-Type`** → es el `http_status:404` de
  cloudflared. El 404 de Traefik trae 19 bytes (`404 page not found`) y
  `text/plain`; el de Cloudflare trae HTML.
- `Server: cloudflare` y `CF-RAY` están igual, porque la respuesta pasa por el
  borde. **No** significa que la haya generado Cloudflare.
- los logs del connector **no muestran nada**: en nivel INFO cloudflared no
  loguea peticiones, así que el silencio no prueba que el tráfico no llegó.
- `cloudflared tunnel ingress rule <url>` dice que la regla matchea — pero lee
  el **archivo**, no la memoria del proceso. Por eso no sirve para diagnosticar
  esto.

### El diagnóstico que sí sirve

Comparar la fecha del `config.yml` contra el arranque de **cada** connector:

```bash
ssh srpy-servidor 'CFG=$(stat -c %Y /home/santarosa/cloudflared-compras/config.yml)
for c in cloudflared-compras cloudflared-replica2; do
  S=$(date -u -d "$(docker inspect -f "{{.State.StartedAt}}" $c)" +%s)
  echo "$c: $(date -d @$S -u +%F\ %T) $([ $S -gt $CFG ] && echo OK || echo DESACTUALIZADO)"
done'
```

### Reiniciar bien

`cloudflared` **no recarga con SIGHUP: se muere.** Y como `docker kill` cuenta
para Docker como parada manual, `restart: unless-stopped` **no lo relevanta**
(eso dejó los 13 hostnames caídos 40 s el 2026-09-03).

Reiniciá **de a uno**, esperando que el primero levante antes de tocar el
segundo: mientras uno esté arriba, el otro absorbe el tráfico y el corte es
nulo. Reiniciar los dos a la vez sí corta todo.

```bash
ssh srpy-servidor 'docker restart cloudflared-replica2 && sleep 15 && docker restart cloudflared-compras'
```

Si alguno quedó parado:

```bash
ssh srpy-servidor 'docker start cloudflared-replica2'
```

Y antes de dar por bueno un cambio, verificá que **los 13 hostnames** sigan
contestando, no solo el que tocaste:

```bash
for h in compras jac callbot advisor prospectos tasacion gwm; do
  printf "%-12s " "$h"; curl -s -o /dev/null -w "%{http_code}
" "https://$h.santarosa.lat/"
done
```

### La entrada que se agregó

En `/home/santarosa/cloudflared-compras/config.yml`, antes del catch-all
`- service: http_status:404`, respetando la indentación del archivo (guiones a
columna 0):

```yaml
- hostname: gwm.santarosa.lat
  service: http://coolify-proxy:80
```

El directorio se monta **read-only** en `/etc/cloudflared` dentro del container,
así que se edita en el host. Hay backups con fecha ahí mismo
(`config.yml.bak-antes-gwm-*`); seguí la convención antes de tocarlo.

---

## Verificar sin depender del DNS

Todo el camino real menos Cloudflare, pegándole a Traefik con el header `Host`:

```bash
ssh srpy-servidor 'curl -s -o /dev/null -w "%{http_code}\n" -H "Host: gwm.santarosa.lat" http://localhost:80/'
```

Corrida del 2026-09-03, con el container `Up (healthy)`:

| Prueba | Resultado |
|---|---|
| `GET /` | `200` en 6 ms |
| `GET /gracias` | `200` |
| `GET /modelos/poer-plus-24t/hero.webp` | `200` |
| `GET /_next/image?...&w=1200&q=75` | `200`, `image/avif`, 79 KB |
| `<title>` | GWM Paraguay \| H6 GT, TANK 400 y POER PLUS… |
| `<meta robots>` | `noindex, nofollow, nocache` |
| `og:url` | `https://gwm.santarosa.lat` |

---

## Operación

**Desplegar** (el push a `main` también dispara auto-deploy):

```bash
ssh srpy-servidor 'T=$(cat ~/.coolify-token); curl -s -X POST "http://localhost:8090/api/v1/deploy?uuid=x6fsgjdswj0ehatl9jgwd2bo" -H "Authorization: Bearer $T"'
```

Devuelve un `deployment_uuid`. Para seguirlo (`queued` → `in_progress` →
`finished`/`failed`):

```bash
ssh srpy-servidor 'T=$(cat ~/.coolify-token); curl -s -H "Authorization: Bearer $T" "http://localhost:8090/api/v1/deployments/EL-UUID"'
```

**Estado del container:**

```bash
ssh srpy-servidor 'docker ps -a --filter name=x6fsgjdswj0ehatl9jgwd2bo --format "{{.Names}} | {{.Status}}"'
```

**Logs:**

```bash
ssh srpy-servidor 'docker logs --tail 50 $(docker ps --filter name=x6fsgjdswj0ehatl9jgwd2bo --format "{{.Names}}" | head -1)'
```

El token de la API está en `~/.coolify-token` del server (el de
`~/.coolify-api-token` también anda; los dos devuelven 200).

---

## El CNAME

Creado el 2026-09-03 (`id 5a4079c9b52f16dd4e3c57ef4dadaf96`), idéntico al de
`compras`:

| Campo | Valor |
|---|---|
| Tipo | `CNAME` |
| Nombre | `gwm` |
| Destino | `505fc6ac-4f83-4fbe-b490-9110828589ea.cfargotunnel.com` |
| Proxy | **activado** (nube naranja) |
| TTL | automático |
| Zona | `f518fd7cef829a3fd4c49cfbeb8eea1c` |

En el server **no hay con qué crearlo**: `cloudflared` no está instalado como
CLI (solo corre dentro de los containers, que son imágenes sin shell — ni `ls`
ni `find`), y no hay `cert.pem` de login de cuenta. El `.json` que sí está es
la credencial de *conexión* del túnel, que no sirve para tocar DNS.

Se hizo por API con un token de zona (**Zone → DNS → Edit**, acotado a
`santarosa.lat`), contra `POST /client/v4/zones/<zona>/dns_records` con
`{"type":"CNAME","name":"gwm.santarosa.lat","content":"<uuid>.cfargotunnel.com","proxied":true,"ttl":1}`.

> Ese token **no** alcanza para consultar la API de Tunnels ni las page rules
> (devuelve `Authentication error` y `code 9109`). Si hace falta mirar la
> configuración del túnel del lado de Cloudflare, se necesita uno con permiso
> de cuenta `Cloudflare Tunnel`.

Alternativa, desde una máquina que tenga el cert de cuenta:

```bash
cloudflared tunnel route dns --overwrite-dns 505fc6ac-4f83-4fbe-b490-9110828589ea gwm.santarosa.lat
```

El `--overwrite-dns` y el UUID explícito no son opcionales: sin ellos
`cloudflared` toma el túnel por defecto del `config.yml` local y el CNAME
termina apuntando al túnel equivocado (ya pasó con `compras`).

**Ojo: crear el CNAME no alcanzó por sí solo.** El sitio siguió devolviendo 404
durante ~30 minutos hasta reiniciar el connector desactualizado. Si acabás de
crear un hostname y da 404, no esperes a que "propague": andá derecho a la
sección de los dos connectors.

---

## Pendientes del producto

1. **El Google Form no está configurado.** `content/contacto.ts` → `FORM` tiene
   placeholders `entry.<...>`. Publicada así, el formulario le dice "gracias" al
   visitante y **no guarda el lead en ningún lado**. Esto se resuelve antes de
   imprimir el QR, no después.
2. **No hay analítica.** Si la campaña necesita medir la conversión del QR, hay
   que decidir con qué y meterlo en `app/layout.tsx`.
3. **El repo es público.** No tiene secretos, así que no es un problema de
   seguridad, pero es la excepción entre las apps del server. Si se cierra, ver
   la nota de deploy key más arriba.
