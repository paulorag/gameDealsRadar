# Estágio 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# MUDANÇA AQUI: Como o Dockerfile já está dentro da pasta radar,
# copiamos o diretório atual (.) para o container
COPY . .

RUN mvn clean package -DskipTests

# Estágio 2: Runtime
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]