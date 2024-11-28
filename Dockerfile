# Etapa 1: Construcción del frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY barberia-frontend/package*.json ./
RUN npm install
COPY barberia-frontend/ ./
RUN npm run build

# Etapa 2: Configuración del backend
FROM node:18
WORKDIR /app
COPY barberia-backend/package*.json ./
RUN npm install
COPY barberia-backend/ ./
COPY --from=frontend-build /app/frontend/build ./public

# Exponer el puerto del backend
EXPOSE 5000
CMD ["npm", "start"]
