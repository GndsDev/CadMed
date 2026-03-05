# 1. Qual é o sistema base? (Um servidor Nginx ultra-leve)
FROM nginx:alpine

# 2. Apaga a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# 3. Copia a configuração que criamos para o Nginx
COPY dist/cadmed-front/browser /usr/share/nginx/html

# 4. Copia os arquivos que o Angular gerou na pasta dist para dentro do servidor
# ATENÇÃO: Troque "dist/cadmed" para o caminho exato onde o seu index.html foi gerado no Passo 1!
COPY dist/cadmed-front /usr/share/nginx/html

# 5. Avisa que este contêiner vai rodar na porta 80
EXPOSE 80

# 6. Comando para iniciar o Nginx e mantê-lo rodando
CMD ["nginx", "-g", "daemon off;"]
