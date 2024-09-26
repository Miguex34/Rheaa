const { Servicio } = require('../models/Servicio');

exports.createServicio = async (req, res) => {
  const { nombre, descripcion, duracion, precio, disponible, id_negocio, id_empleado } = req.body;

  try {
    const servicio = await Servicio.create({
      nombre,
      descripcion,
      duracion,
      precio,
      disponible,
      id_negocio,
      id_empleado,
    });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

exports.getServiciosByNegocio = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

exports.getServicioById = async (req, res) => {
  try {
    const servicio = await Servicio.findByPk(req.params.id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};
