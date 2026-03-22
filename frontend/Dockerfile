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

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
