# Base image con Node.js (alpine para tamaño reducido)
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Instalar bibliotecas necesarias del sistema para libsodium/argon2 si se requieren
# Alpine: instalar build tools sólo si es necesario (en producción usar prebuilds)
RUN apk add --no-cache build-base python3

# Copiar package files y instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY . .

# Puerto (solo expone el contenedor, el host debe mapearlo en docker-compose)
EXPOSE 3000

# Recomendación: ejecutar con entornos en producción
CMD ["node", "src/index.js"]
