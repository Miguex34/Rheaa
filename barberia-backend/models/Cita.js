const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');
const EmpleadoNegocio = require('./EmpleadoNegocio');

const Cita = sequelize.define('Cita', {
  id_cliente: {
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
  id_empleado: {
    type: DataTypes.INTEGER,
    references: {
      model: EmpleadoNegocio,
      key: 'id',
    },
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  hora_fin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  estado_pago: {
    type: DataTypes.ENUM('pendiente', 'pagado'),
    defaultValue: 'pendiente',
  },
  medio_pago: {
    type: DataTypes.ENUM('online', 'local'),
    defaultValue: 'local',
  },
  estado_cita: {
    type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
    defaultValue: 'pendiente',
  },
}, {
  tableName: 'cita',  // Nombre correcto en la base de datos
  timestamps: false,
});

module.exports = Cita;
