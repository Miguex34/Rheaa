// backend/models/DisponibilidadEmpleado.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DisponibilidadEmpleado = sequelize.define('Disponibilidad_Empleado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_empleado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dia_semana: {
    type: DataTypes.STRING(15),
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
}, {
  timestamps: false,
  tableName: 'Disponibilidad_Empleado',
});

module.exports = DisponibilidadEmpleado;
