const { Cita } = require('../models/Cita');

exports.createCita = async (req, res) => {
  const { id_cliente, id_negocio, id_empleado, fecha, hora_inicio, estado_pago, medio_pago, estado_cita } = req.body;

  try {
    const cita = await Cita.create({
      id_cliente,
      id_negocio,
      id_empleado,
      fecha,
      hora_inicio,
      estado_pago,
      medio_pago,
      estado_cita,
    });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};

exports.getCitasByNegocio = async (req, res) => {
  try {
    const citas = await Cita.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

exports.getCitaById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
};
