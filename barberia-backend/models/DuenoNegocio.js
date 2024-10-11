const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

const DuenoNegocio = sequelize.define('DuenoNegocio', {
  id_dueno: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
  id_negocio: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Negocio,
      key: 'id',
    },
  },
}, {
  tableName: 'dueno_negocio',
  timestamps: false,
});

module.exports = DuenoNegocio;
