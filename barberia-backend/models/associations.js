// backend/models/associations.js
const Usuario = require('./Usuario');
const Negocio = require('./Negocio');
const Servicio = require('./Servicio');
const HorarioNegocio = require('./HorarioNegocio');
const DisponibilidadEmpleado = require('./DisponibilidadEmpleado');
const EmpleadoNegocio = require('./EmpleadoNegocio');
const Cita = require('./Cita');
const DuenoNegocio = require('./DuenoNegocio');
const Pago = require('./Pago');

// Asociación: Un Usuario tiene un Negocio
Usuario.hasOne(Negocio, { foreignKey: 'id_dueno', as: 'negocio' });
Negocio.belongsTo(Usuario, { foreignKey: 'id_dueno', as: 'dueno' });

// Asociación: Un Negocio tiene muchos Servicios
Negocio.hasMany(Servicio, { foreignKey: 'id_negocio', as: 'servicios' });
Servicio.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Negocio tiene muchos Horarios
Negocio.hasMany(HorarioNegocio, { foreignKey: 'id_negocio', as: 'horarios' });
HorarioNegocio.belongsTo(Negocio, { foreignKey: 'id_negocio', as: 'negocio' });

// Asociación: Un Usuario tiene Disponibilidad de Empleado
Usuario.hasMany(DisponibilidadEmpleado, { foreignKey: 'id_empleado', as: 'disponibilidades' });
DisponibilidadEmpleado.belongsTo(Usuario, { foreignKey: 'id_empleado' });

// Asociación: Un Negocio tiene muchos Empleados
Negocio.hasMany(EmpleadoNegocio, { foreignKey: 'id_negocio', as: 'empleados' });
EmpleadoNegocio.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Usuario pertenece a muchos Negocios (Dueño)
Usuario.belongsToMany(Negocio, { through: DuenoNegocio, as: 'negocios', foreignKey: 'id_dueno' });
Negocio.belongsToMany(Usuario, { through: DuenoNegocio, as: 'duenos', foreignKey: 'id_negocio' });

// Asociación: Un Servicio puede estar asociado a una Cita
Servicio.hasMany(Cita, { foreignKey: 'id_servicio', as: 'citas' });
Cita.belongsTo(Servicio, { foreignKey: 'id_servicio' });

// Asociación: Un Usuario puede tener muchas Citas
Usuario.hasMany(Cita, { foreignKey: 'id_cliente', as: 'citas' });
Cita.belongsTo(Usuario, { foreignKey: 'id_cliente' });

// Asociación: Un Negocio tiene muchas Citas
Negocio.hasMany(Cita, { foreignKey: 'id_negocio', as: 'citas' });
Cita.belongsTo(Negocio, { foreignKey: 'id_negocio' });

// Asociación: Un Empleado puede estar en una Cita
EmpleadoNegocio.hasMany(Cita, { foreignKey: 'id_empleado', as: 'citas' });
Cita.belongsTo(EmpleadoNegocio, { foreignKey: 'id_empleado' });

// Asociación: Un Pago está asociado a una Cita
Cita.hasOne(Pago, { foreignKey: 'id_cita', as: 'pago' });
Pago.belongsTo(Cita, { foreignKey: 'id_cita' });

module.exports = {
  Usuario,
  Negocio,
  Servicio,
  HorarioNegocio,
  DisponibilidadEmpleado,
  EmpleadoNegocio,
  Cita,
  DuenoNegocio,
  Pago,
};
