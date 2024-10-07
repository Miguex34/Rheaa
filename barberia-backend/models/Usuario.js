const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importa el modelo Negocio correctamente
const Negocio = require('./Negocio');

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
  },
}, {
  timestamps: false,
  tableName: 'usuario',
});

// Definir la relación "uno a muchos" entre Usuario y Negocio
Usuario.hasMany(Negocio, { foreignKey: 'id_dueno' });
Negocio.belongsTo(Usuario, { foreignKey: 'id_dueno' });  // Relación inversa

module.exports = Usuario;
