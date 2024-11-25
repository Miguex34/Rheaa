const Reserva = require('../models/Reserva');
const DisponibilidadEmpleado = require('../models/DisponibilidadEmpleado');
const db = require('../config/database');
const { Sequelize } = require('sequelize');
const EmpleadoNegocio = require('../models/EmpleadoNegocio');
const Usuario = require('../models/Usuario');

exports.createReserva = async (req, res) => {
  try {
    const { id_cliente, id_servicio, id_empleado, fecha, hora } = req.body;

    // Verificar disponibilidad del empleado
    const disponibilidad = await DisponibilidadEmpleado.findOne({
      where: {
        id_usuario: id_empleado,
        dia_semana: fecha.getDay(), // Obtener el día de la semana (0-6)
        hora_inicio: { [Op.lte]: hora },
        hora_fin: { [Op.gte]: hora },
        disponible: 1,
      },
    });

    if (!disponibilidad) {
      return res.status(400).json({ error: 'El empleado no está disponible en el horario seleccionado.' });
    }

    // Verificar que el horario no esté ya reservado
    const existingReserva = await Reserva.findOne({
      where: { id_empleado, fecha, hora },
    });

    if (existingReserva) {
      return res.status(400).json({ error: 'Este horario ya está reservado.' });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      id_cliente,
      id_servicio,
      id_empleado,
      fecha,
      hora,
      id_negocio: req.body.id_negocio,
    });

    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva.' });
  }
};
exports.getDisponibilidad = async (req, res) => {
  try {
    const { id_servicio, fecha } = req.params;

    // Obtener empleados que pueden realizar el servicio
    const empleadosDisponibles = await DisponibilidadEmpleado.findAll({
      where: {
        id_negocio: req.body.id_negocio,
        dia_semana: fecha.getDay(),
        disponible: 1,
      },
    });

    if (empleadosDisponibles.length === 0) {
      return res.status(404).json({ error: 'No hay empleados disponibles para este servicio.' });
    }

    res.status(200).json(empleadosDisponibles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la disponibilidad.' });
  }
};

exports.obtenerReservacionesPorEmpleado = async (req, res) => {
  const { id_negocio } = req.user; // Obtener el id_negocio del middleware

  if (!id_negocio) {
      return res.status(400).json({ message: 'No se encontró un negocio asociado al usuario.' });
  }

  try {
      const empleadosReservas = await Reserva.findAll({
          where: {
              id_negocio,
          },
          attributes: [
              [Sequelize.col('Reserva.id_empleado'), 'id_empleado'],
              [Sequelize.fn('COUNT', Sequelize.col('Reserva.id')), 'total_reservaciones'],
          ],
          include: [
              {
                  model: EmpleadoNegocio,
                  as: 'empleadoNegocio',
                  attributes: ['id', 'id_usuario'],
                  include: {
                      model: Usuario,
                      as: 'Usuario',
                      attributes: ['nombre'],
                  },
              },
          ],
          group: ['Reserva.id_empleado', 'empleadoNegocio.id', 'empleadoNegocio.Usuario.id'],
          order: [[Sequelize.fn('COUNT', Sequelize.col('Reserva.id')), 'DESC']],
      });

      if (!empleadosReservas || empleadosReservas.length === 0) {
          return res.status(404).json({ message: 'No se encontraron reservaciones para este negocio.' });
      }

      const resultado = empleadosReservas.map((reserva) => ({
          empleado: reserva.empleadoNegocio.Usuario.nombre,
          total_reservaciones: reserva.dataValues.total_reservaciones,
      }));

      res.json(resultado);
  } catch (error) {
      console.error('Error al obtener reservaciones por empleado:', error);
      res.status(500).json({ error: 'Error al obtener reservaciones por empleado.' });
  }
};


