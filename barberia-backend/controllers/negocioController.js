const { Negocio } = require('../models/Negocio'); // Asegúrate de que la ruta sea correcta
const { DuenoNegocio } = require('../models/DuenoNegocio'); // Tabla intermedia para la relación de Dueño-Negocio
const jwt = require('jsonwebtoken');

// Controlador para crear un nuevo negocio
exports.createNegocio = async (req, res) => {
  try {
    const { nombre, telefono, direccion, horario_inicio, horario_cierre } = req.body;
    const id_dueno = req.user.id; // ID del usuario dueño desde el token
    const correo = req.user.correo; // Obtener el correo del usuario desde el token

    console.log('Correo del usuario:', correo);

    // Verificar si el nombre del negocio ya está en uso
    const negocioExists = await Negocio.findOne({ where: { nombre } });
    if (negocioExists) {
      return res.status(400).json({ message: 'El nombre del negocio ya está en uso.' });
    }

    // Crear el negocio con los datos proporcionados
    const negocio = await Negocio.create({
      nombre,
      telefono,
      direccion,
      horario_inicio,
      horario_cierre,
      correo,
      id_dueno,
    });
    console.log('Negocio creado:', negocio);

    // Relacionar el negocio con el dueño
    const relacionDuenoNegocio = await DuenoNegocio.create({
      id_dueno: req.user.id,
      id_negocio: negocio.id,
    });
    console.log('Relación Dueño-Negocio creada:', relacionDuenoNegocio);

    res.json(negocio); // Devolver el negocio creado en la respuesta
  } catch (error) {
    console.error('Error al crear el negocio:', error);
    res.status(500).json({ error: 'Error al crear el negocio' });
  }
};

// Controlador para obtener todos los negocios
exports.getAllNegocios = async (req, res) => {
  try {
    const negocios = await Negocio.findAll();
    res.json(negocios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los negocios' });
  }
};

// Controlador para obtener un negocio por su ID
exports.getNegocioById = async (req, res) => {
  try {
    const { id } = req.params;
    const negocio = await Negocio.findByPk(id);

    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado' });
    }

    res.status(200).json(negocio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el negocio' });
  }
};

// Controlador para actualizar los datos de un negocio
exports.updateNegocio = async (req, res) => {
  try {
    const { tipoNegocio, numProfesionales, horario } = req.body;
    const negocio = await Negocio.findByPk(req.user.id_negocio); // Usar el ID del negocio asociado al usuario logeado

    if (!negocio) {
      return res.status(404).json({ message: 'Negocio no encontrado' });
    }

    await negocio.update({ tipoNegocio, numProfesionales, horario });
    res.status(200).json({ message: 'Negocio actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el negocio:', error);
    res.status(500).json({ message: 'Error al actualizar el negocio' });
  }
};