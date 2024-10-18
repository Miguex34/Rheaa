// backend/models/associations.js
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');
const Servicio = require('./Servicio');
const HorarioNegocio = require('./HorarioNegocio');
const DisponibilidadEmpleado = require('./DisponibilidadEmpleado');
const EmpleadoNegocio = require('./EmpleadoNegocio');
const Reserva = require('./Reserva');
const DuenoNegocio = require('./DuenoNegocio');
const Pago = require('./Pago');
const Cliente = require('./Cliente');

// Asociación: Un Usuario tiene un Negocio
Usuario.hasOne(Negocio, { foreignKey: 'id_dueno', as: 'negocio' });
Negocio.belongsTo(Usuario, { foreignKey: 'id_dueno', as: 'dueno' });

// Asociación: Un Negocio tiene muchos Servicios
Negocio.hasMany(Servicio, { foreignKey: 'id_negocio', as: 'servicios' });
Servicio.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Negocio tiene muchos Horarios
Negocio.hasMany(HorarioNegocio, { foreignKey: 'id_negocio', as: 'horarios' });
HorarioNegocio.belongsTo(Negocio, { foreignKey: 'id_negocio', as: 'negocio' });

// Asociación: Un Usuario tiene Disponibilidad de Empleado (cambio id_empleado -> id_usuario)
Usuario.hasMany(DisponibilidadEmpleado, { foreignKey: 'id_usuario', as: 'disponibilidades' });
DisponibilidadEmpleado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Asociación: Un Negocio tiene muchos Empleados
Negocio.hasMany(EmpleadoNegocio, { foreignKey: 'id_negocio', as: 'empleados' });
EmpleadoNegocio.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Usuario pertenece a muchos Negocios (Dueño)
Usuario.belongsToMany(Negocio, { through: DuenoNegocio, as: 'negocios', foreignKey: 'id_dueno' });
Negocio.belongsToMany(Usuario, { through: DuenoNegocio, as: 'duenos', foreignKey: 'id_negocio' });

// Asociación: Un Servicio puede estar asociado a una Cita
Servicio.hasMany(Reserva, { foreignKey: 'id_servicio', as: 'citas' });
Reserva.belongsTo(Servicio, { foreignKey: 'id_servicio' });

// Asociación: Un Usuario puede tener muchas Citas
Usuario.hasMany(Reserva, { foreignKey: 'id_cliente', as: 'citas' });
Reserva.belongsTo(Usuario, { foreignKey: 'id_cliente' });

// Asociación: Un Negocio tiene muchas Citas
Negocio.hasMany(Reserva, { foreignKey: 'id_negocio', as: 'citas' });
Reserva.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Empleado puede estar en una Cita
EmpleadoNegocio.hasMany(Reserva, { foreignKey: 'id_empleado', as: 'citas' });
Reserva.belongsTo(EmpleadoNegocio, { foreignKey: 'id_empleado' });

// Asociación: Un Pago está asociado a una Cita
Reserva.hasOne(Pago, { foreignKey: 'id_reserva', as: 'pago' });
Pago.belongsTo(Reserva, { foreignKey: 'id_reserva' });

// Asociación: Un Cliente puede tener muchas Reservas
Cliente.hasMany(Reserva, { foreignKey: 'id_cliente', as: 'reservas' });
Reserva.belongsTo(Cliente, { foreignKey: 'id_cliente' });

module.exports = {
  Usuario,
  Negocio,
  Servicio,
  HorarioNegocio,
  DisponibilidadEmpleado,
  EmpleadoNegocio,
  Reserva,
  DuenoNegocio,
  Pago,
  Cliente
};

