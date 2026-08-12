# --- Stage 1 : build ---
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Couche de cache : les dépendances ne sont retéléchargées que si pom.xml change
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Stage 2 : exécution ---
FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S itdesk && adduser -S itdesk -G itdesk
WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

RUN mkdir -p /var/itdesk/attachments && chown -R itdesk:itdesk /var/itdesk /app
USER itdesk

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --start-period=40s --retries=5 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
