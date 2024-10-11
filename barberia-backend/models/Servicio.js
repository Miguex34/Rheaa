// models/Servicio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Negocio = require('./Negocio');

const Servicio = sequelize.define('Servicio', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duracion: {
    type: DataTypes.INTEGER, // duración en minutos
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  id_negocio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Negocio,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'servicio',
  timestamps: false,
});

module.exports = Servicio;
