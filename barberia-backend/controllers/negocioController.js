const { Negocio } = require('../models/Negocio');
const { DuenoNegocio } = require('../models/DuenoNegocio');

exports.createNegocio = async (req, res) => {
  const { nombre, telefono, direccion, horario_inicio, horario_cierre, correo, id_dueno } = req.body;

  try {
    const negocio = await Negocio.create({
      nombre,
      telefono,
      direccion,
      horario_inicio,
      horario_cierre,
      correo,
    });

    await DuenoNegocio.create({
      id_dueno,
      id_negocio: negocio.id,
    });

    res.json(negocio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el negocio' });
  }
};

exports.getAllNegocios = async (req, res) => {
  try {
    const negocios = await Negocio.findAll();
    res.json(negocios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los negocios' });
  }
};

exports.getNegocioById = async (req, res) => {
  try {
    const negocio = await Negocio.findByPk(req.params.id);
    if (!negocio) return res.status(404).json({ error: 'Negocio no encontrado' });

    res.json(negocio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el negocio' });
  }
};

