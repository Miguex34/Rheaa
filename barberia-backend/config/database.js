const { Sequelize } = require('sequelize');
require('dotenv').config(); // Cargar las variables de entorno

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Para evitar problemas con certificados SSL en Railway
    },
  },
  logging: false,
});

module.exports = sequelize;
