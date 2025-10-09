FROM node:20-alpine

# Crear carpeta de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Exponer puerto seguro
EXPOSE 443

# Comando para iniciar
CMD ["node", "src/index.js"]
