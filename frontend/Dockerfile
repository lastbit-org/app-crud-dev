# Estágio 1: Build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Estágio 2: Serve
FROM nginx:alpine

# Copiar os arquivos gerados no build para pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# COPIAR o nosso arquivo customizado de configuração (Ouvindo na 8080 para Cloud Run)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar entrypoint que injeta variáveis de ambiente em runtime
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080

# Usa entrypoint para injetar config antes de iniciar o nginx
ENTRYPOINT ["/entrypoint.sh"]
