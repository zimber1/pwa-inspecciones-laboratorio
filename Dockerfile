# syntax=docker/dockerfile:1

# Stage 1: Install dependencies reproducibly from lockfile
FROM node:20.19.6-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

# Stage 2: Build standalone Next.js production bundle
FROM node:20.19.6-alpine AS builder
WORKDIR /app

ARG APP_VERSION=0.1.0
ARG COMMIT_SHA=dev

ENV APP_VERSION=${APP_VERSION}
ENV COMMIT_SHA=${COMMIT_SHA}
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Minimal production runtime with non-root user
FROM node:20.19.6-alpine AS runner
WORKDIR /app

ARG APP_VERSION=0.1.0
ARG COMMIT_SHA=dev

LABEL org.opencontainers.image.title="pwa-inspecciones-laboratorio" \
      org.opencontainers.image.description="PWA de inspecciones y mantenimiento de laboratorios" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${COMMIT_SHA}"

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV APP_VERSION=${APP_VERSION}
ENV COMMIT_SHA=${COMMIT_SHA}
ENV NEXT_PUBLIC_APP_VERSION=${APP_VERSION}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA}

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/health').then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))).then((b) => process.exit(b.status === 'ok' ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]
