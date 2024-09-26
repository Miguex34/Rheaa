const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

const DuenoNegocio = sequelize.define('DuenoNegocio', {
  id_dueno: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id',
    },
    allowNull: false,
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
  tableName: 'dueno_negocio',  // Nombre correcto en la base de datos
  timestamps: false,
});

module.exports = DuenoNegocio;
