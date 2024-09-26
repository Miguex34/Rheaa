const { EmpleadoNegocio } = require('../models/EmpleadoNegocio');

exports.createEmpleado = async (req, res) => {
  const { id_usuario, id_negocio, cargo } = req.body;

  try {
    const empleado = await EmpleadoNegocio.create({
      id_usuario,
      id_negocio,
      cargo,
    });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar empleado' });
  }
};

exports.getEmpleadosByNegocio = async (req, res) => {
  try {
    const empleados = await EmpleadoNegocio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await EmpleadoNegocio.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
};
