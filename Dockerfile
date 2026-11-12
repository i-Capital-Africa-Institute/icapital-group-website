# ---- deps ----
FROM node:24-bookworm-slim AS deps

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build ----
FROM node:24-bookworm-slim AS build

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* is inlined at build time — pass production values as build args.
ARG NEXT_PUBLIC_DOMAIN
ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_DATA
ARG NEXT_PUBLIC_EAFS_API
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ARG NEXT_PUBLIC_CONTACT_EMAIL
ARG NEXT_PUBLIC_SOCKET

ENV NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}
ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}
ENV NEXT_PUBLIC_DATA=${NEXT_PUBLIC_DATA}
ENV NEXT_PUBLIC_EAFS_API=${NEXT_PUBLIC_EAFS_API}
ENV NEXT_PUBLIC_MAPBOX_TOKEN=${NEXT_PUBLIC_MAPBOX_TOKEN}
ENV NEXT_PUBLIC_CONTACT_EMAIL=${NEXT_PUBLIC_CONTACT_EMAIL}
ENV NEXT_PUBLIC_SOCKET=${NEXT_PUBLIC_SOCKET}
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- runtime ----
FROM node:24-bookworm-slim AS runtime

RUN apt-get update -y \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid 1001 nextjs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
