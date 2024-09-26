const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Cita = require('./Cita');

const Pago = sequelize.define('Pago', {
  id_cita: {
    type: DataTypes.INTEGER,
    references: {
      model: Cita,
      key: 'id',
    },
    allowNull: false,
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM('exitoso', 'fallido'),
    allowNull: false,
  },
}, {
  tableName: 'pago',  // Cambia el nombre a singular
  timestamps: false,
});

module.exports = Pago;
