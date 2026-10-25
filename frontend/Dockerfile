FROM node:24 AS builder

WORKDIR /build

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=http://api.ticket.local 
RUN npm run build

FROM nginx:1.30.6-alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /build/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO- http://app.itticket.local:8080 || exit 1

CMD ["nginx", "-g", "daemon off;"]
