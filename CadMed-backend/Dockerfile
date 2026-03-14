# ==========================================
# FASE 1: Construção (Gerar o .jar/snapshot)
# ==========================================
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /app

# Copia o arquivo de dependências primeiro
COPY pom.xml .
# Copia todo o código fonte
COPY src ./src

# Pede pro Maven gerar o arquivo .jar (ignorando os testes)
RUN mvn -B clean package -DskipTests -Dhttps.protocols=TLSv1.2,TLSv1.3 -Dmaven.wagon.http.retryHandler.count=3

# ==========================================
# FASE 2: Execução (Rodar o projeto)
# ==========================================
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copia APENAS o .jar gerado na Fase 1 para esta imagem final
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta que o Spring Boot usa
EXPOSE 8080

# Comando para rodar o seu sistema
ENTRYPOINT ["java", "-jar", "app.jar"]