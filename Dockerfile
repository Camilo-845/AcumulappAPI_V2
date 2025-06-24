# Dockerfile de tu servidor
FROM node:lts-alpine

# Crear el directorio de la app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Instalar dependencias de la app
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm ci --silent

# Copiar el código fuente
COPY . /usr/src/app

# Compilar TypeScript a JavaScript
RUN npm run build


# Verificar el contenido del directorio
RUN ls -la /usr/src/app

# Exponer el puerto de la app
EXPOSE 8080

# Comando para ejecutar la app, usando wait-for-it
CMD ["node", "dist/server.js"]
