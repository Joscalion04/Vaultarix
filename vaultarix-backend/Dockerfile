# =======================================
# Dockerfile para Vaultarix Backend (Node.js)
# =======================================

# --- Stage 1: Build ---
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json primero (para cache de dependencias)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código fuente
COPY . .

# --- Stage 2: Production Image ---
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar dependencias desde build
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copiar código fuente
COPY --from=build /usr/src/app ./

# Exponer puerto de la API
EXPOSE 3000

# Variables de entorno por defecto (puedes sobreescribirlas en docker-compose o CLI)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación en modo producción
CMD ["node", "src/index.js"]
