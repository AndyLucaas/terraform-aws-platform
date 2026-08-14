FROM node:24.19.0 AS builder

WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_KEYCLOAK_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL \
    VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM \
    VITE_KEYCLOAK_CLIENT_ID=$VITE_KEYCLOAK_CLIENT_ID

RUN npm run build

FROM nginx:1.30-alpine

RUN addgroup -S DevOps_Group && adduser -S lucas -G DevOps_Group

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html

USER lucas
EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
