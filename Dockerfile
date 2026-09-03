# =============================================================================
# GWM Paraguay — landing. Imagen de producción para Coolify (servidor SRPY186).
#
# Build pack en Coolify: **Dockerfile**, no Nixpacks. Nixpacks autodetecta
# Next.js y suele andar, pero deja la decisión de cómo arranca la app fuera del
# repo; con esto el runtime queda versionado junto al código.
#
# Tres etapas para que la imagen final no cargue con las dependencias de build:
# el resultado son ~180 MB en vez de ~1,2 GB.
# =============================================================================

# ── 1. Dependencias ──────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

# Solo el manifiesto: mientras package-lock.json no cambie, esta capa se reusa
# y el build no vuelve a bajar el árbol entero de npm.
COPY package.json package-lock.json ./
RUN npm ci


# ── 2. Build ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sin telemetría: es un server sin salida a internet garantizada y el ping de
# Vercel solo agrega ruido y latencia al build.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# ── 3. Runtime ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Sin esto Next escucha en localhost y el contenedor no responde desde afuera:
# Traefik le pega a la IP del contenedor, no a 127.0.0.1.
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs \
    && adduser -u 1001 -S nextjs -G nodejs

# `output: "standalone"` en next.config.ts deja en .next/standalone un server.js
# con solo las dependencias que el tracer detectó como usadas. Los assets
# estáticos y public/ NO van adentro: hay que copiarlos aparte.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

# Coolify lee este healthcheck para saber si el deploy quedó sano. wget viene en
# busybox, así que no hace falta instalar curl.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
