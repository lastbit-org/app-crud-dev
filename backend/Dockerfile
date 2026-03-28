FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

# Cloud Run utiliza por padrão a porta 8080
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "run", "prod"]
