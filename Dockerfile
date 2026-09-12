# Multi-stage Docker build for Spring Boot on Render (Root Level)
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app/timetracker

# Copy maven wrapper and pom.xml
COPY timetracker/mvnw .
COPY timetracker/.mvn .mvn
COPY timetracker/pom.xml .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy backend source code and build jar
COPY timetracker/src src
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/timetracker/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
