const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const EmpleadoNegocio = require('./EmpleadoNegocio');

const DisponibilidadEmpleado = sequelize.define('DisponibilidadEmpleado', {
  id_empleado: {
    type: DataTypes.INTEGER,
    references: {
      model: EmpleadoNegocio,
      key: 'id',
    },
    allowNull: false,
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
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'disponibilidad_empleado',  // Nombre correcto en la base de datos
  timestamps: false,
});

module.exports = DisponibilidadEmpleado;
