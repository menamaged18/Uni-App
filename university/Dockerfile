# --- build stage ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace

# copy pom + wrapper + .mvn first to cache dependencies
COPY pom.xml ./
COPY mvnw mvnw
COPY .mvn .mvn
RUN mvn -B -f pom.xml dependency:go-offline

# copy sources and build
COPY src ./src
RUN mvn -B -DskipTests package

# --- run stage ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# copy jar produced by the build stage
COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
