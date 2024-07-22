# Usa una imagen oficial de Node.js como imagen base
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el package.json y el package-lock.json al contenedor de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación al contenedor de Docker
COPY . .

# Compila la aplicación NestJS
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:dev"]
