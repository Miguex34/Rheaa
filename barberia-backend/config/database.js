const { Sequelize } = require('sequelize');
require('dotenv').config(); // Para cargar las variables de entorno del archivo .env

const sequelize = new Sequelize(
  process.env.DB_NAME || 'negocio_db', // Cambia el nombre aquí
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);


module.exports = sequelize;