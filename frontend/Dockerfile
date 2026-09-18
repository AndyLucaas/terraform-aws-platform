# --- Stage 1 : build ---
FROM node:20-alpine AS builder

WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Les variables VITE_* sont figées dans le bundle à ce moment précis du build,
# jamais relues au runtime par Nginx — elles doivent donc être passées ici.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# --- Stage 2 : service statique ---
# Image officielle conçue pour tourner intégralement en non-root — évite
# l'alerte Trivy/Sonar "container may run as root" que nginx:alpine standard
# déclenche (son processus maître démarre en root avant de dépriviligier les
# workers). Écoute sur 8080 : les ports <1024 sont interdits à un utilisateur
# non-root.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO- http://app.itticket.local:8080 || exit 1

CMD ["nginx", "-g", "daemon off;"]
