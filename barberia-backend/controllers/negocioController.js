const { Negocio } = require('../models/Negocio'); // Asegúrate de que la ruta sea correcta
const { DuenoNegocio } = require('../models/DuenoNegocio'); // Si tienes una tabla intermedia para la relación
const jwt = require('jsonwebtoken');


exports.createNegocio = async (req, res) => {
  try {
    const { nombre, telefono, direccion, horario_inicio, horario_cierre } = req.body;
    const id_dueno = req.user.id; 
    // Obtener el correo del usuario desde el token decodificado
    const correo = req.user.correo;
    console.log('Correo del usuario:', correo); // Log del correo

    // Crear el negocio con el correo del usuario
    const negocio = await Negocio.create({
      nombre,
      telefono,
      direccion,
      horario_inicio,
      horario_cierre,
      correo,
      id_dueno,
    });
    console.log('Negocio creado:', negocio); // Log del negocio creado

    // Relacionar el negocio con el dueño
    const relacionDuenoNegocio = await DuenoNegocio.create({
      id_dueno: req.user.id, // Obtener el ID del usuario logeado
      id_negocio: negocio.id,
    });
    console.log('Relación Dueño-Negocio creada:', relacionDuenoNegocio); // Log de la relación creada
    console.log('Datos del negocio antes de crear:', { nombre, telefono, direccion, horario_inicio, horario_cierre, correo });


    res.json(negocio); // Respuesta con el negocio creado
  } catch (error) {
    console.error('Error al crear el negocio:', error);
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

exports.getNegocioById  = async (req, res) => {
  try {
    // Lógica para obtener los negocios
    res.status(200).json({ message: 'Negocios obtenidos exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los negocios' });
  }
};

exports.createNegocio = async (req, res) => {
  try {
    // Lógica para crear el negocio
    res.status(201).json({ message: 'Negocio creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el negocio' });
  }
};
