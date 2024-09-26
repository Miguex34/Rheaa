const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Negocio = sequelize.define('Negocio', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horario_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horario_cierre: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'negocio',  // Nombre correcto de la tabla
  timestamps: false,
});

module.exports = Negocio;

module.exports = Negocio;
