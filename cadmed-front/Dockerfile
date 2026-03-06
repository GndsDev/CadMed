# 1. Estágio de Build (Usa o Node 22 para compilar o Angular)
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# 2. Estágio do Nginx (Pega a pasta dist e serve com o proxy reverso)
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# Copia o nosso arquivo de configuração personalizado do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o Angular compilado.
# ATENÇÃO: Confirme se a sua pasta local gera "browser" no final, senão remova o /browser da linha abaixo.
COPY --from=build /app/dist/cadmed-front/browser /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
