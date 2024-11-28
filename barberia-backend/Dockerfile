# Usa Node.js como imagen base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de tu proyecto
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Expone el puerto del backend (asegúrate de que coincida con el que usa tu servidor)
EXPOSE 5000

# Inicia el servidor
CMD ["npm", "start"]
