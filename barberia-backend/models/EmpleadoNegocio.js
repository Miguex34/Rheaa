const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');

const EmpleadoNegocio = sequelize.define('EmpleadoNegocio', {
  id_usuario: {
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
  cargo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'empleado_negocio',  // Nombre correcto en la base de datos
  timestamps: false,
});

module.exports = EmpleadoNegocio;
