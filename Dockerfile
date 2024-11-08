# Usa una imagen base oficial de Node.js
FROM node:22

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto en el contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

# Expon los puertos en los que tu aplicación escuchará
EXPOSE 3000
EXPOSE 3001

# Ejecuta el servidor de la aplicación
CMD ["npm", "run", "dev"]
