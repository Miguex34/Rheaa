const { DisponibilidadEmpleado } = require('../models/DisponibilidadEmpleado');

// Crear disponibilidad de empleado
exports.createDisponibilidad = async (req, res) => {
  const { id_empleado, fecha, hora_inicio, hora_fin, disponible } = req.body;
  
  try {
    const disponibilidad = await DisponibilidadEmpleado.create({
      id_empleado,
      fecha,
      hora_inicio,
      hora_fin,
      disponible
    });

    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear disponibilidad' });
  }
};

// Obtener disponibilidad por empleado
exports.getDisponibilidadByEmpleado = async (req, res) => {
  try {
    const disponibilidades = await DisponibilidadEmpleado.findAll({
      where: { id_empleado: req.params.id_empleado }
    });
    res.json(disponibilidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};
