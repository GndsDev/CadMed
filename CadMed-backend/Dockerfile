# 1. Qual é o sistema base? (Um Linux ultra-leve com Java 17 instalado)
# Se você estiver usando o Java 21, mude o '17' para '21' na linha abaixo
FROM eclipse-temurin:25-jdk-alpine

# 2. Cria uma pasta chamada /app dentro do contêiner
WORKDIR /app

# 3. Copia o seu arquivo .jar que o Maven gerou para dentro do contêiner
COPY target/*.jar app.jar

# 4. Avisa que este contêiner vai se comunicar pela porta 8080
EXPOSE 8080

# 5. O comando mágico que o Docker vai rodar quando o contêiner ligar
ENTRYPOINT ["java", "-jar", "app.jar"]