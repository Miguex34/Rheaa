const Reserva = require('../models/Reserva');
const DisponibilidadEmpleado = require('../models/DisponibilidadEmpleado');

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

