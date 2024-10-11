// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Negocio = require('./Negocio'); // Importa el modelo Negocio correctamente

// Define el modelo Usuario
const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  intentos_fallidos: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  cuenta_bloqueada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'dueño', // Añade un valor predeterminado para asegurar que siempre haya un valor
  },
}, {
  timestamps: false,
  tableName: 'usuario',
});

// Definir la relación "uno a muchos" entre Usuario y Negocio
Usuario.hasMany(Negocio, { foreignKey: 'id_dueno' });
Negocio.belongsTo(Usuario, { foreignKey: 'id_dueno' }); // Relación inversa

module.exports = Usuario;
