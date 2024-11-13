const Evento = require('../models/Evento');

// Crear un nuevo evento
exports.createEvento = async (req, res) => {
  try {
    const { titulo, inicio, fin, descripcion, categoria, id_negocio } = req.body;

    // Obtener el id del usuario autenticado
    const id_usuario = req.user.id;

    const nuevoEvento = await Evento.create({
      titulo,
      inicio,
      fin,
      descripcion,
      categoria,
      id_negocio,
      id_usuario,
    });
    
    res.status(201).json(nuevoEvento);
  } catch (error) {
    console.error('Error al crear el evento:', error);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
};

// Obtener todos los eventos de un negocio específico
exports.getEventos = async (req, res) => {
  try {
    const { id_negocio } = req.params;

    const eventos = await Evento.findAll({
      where: { id_negocio },
      include: [{ model: Usuario, as: 'creador', attributes: ['id', 'nombre'] }],
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
};

// Actualizar un evento
exports.updateEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, inicio, fin, descripcion, categoria } = req.body;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.update({
      titulo,
      inicio,
      fin,
      descripcion,
      categoria,
    });

    res.status(200).json(evento);
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    res.status(500).json({ error: 'Error al actualizar el evento' });
  }
};

// Eliminar un evento
exports.deleteEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.status(200).json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el evento:', error);
    res.status(500).json({ error: 'Error al eliminar el evento' });
  }
};