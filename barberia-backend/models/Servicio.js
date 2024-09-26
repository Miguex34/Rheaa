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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  id_negocio: {
    type: DataTypes.INTEGER,
    references: {
      model: Negocio,
      key: 'id',
    },
    allowNull: false,
  },
}, {
  tableName: 'servicio',  // Nombre correcto en la base de datos
  timestamps: false,
});

module.exports = Servicio;
