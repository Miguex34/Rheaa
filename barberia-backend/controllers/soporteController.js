// archivo: controllers/soporteController.js
const Soporte = require('../models/Soporte');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');
const path = require('path');

const crearSoporte = async (req, res) => {
    const { asunto, descripcion, prioridad, id_negocio } = req.body;
  
    try {
      // Verificar que `req.user.id` esté disponible y obtener el `id_usuario` del token
      const usuario = await Usuario.findByPk(req.user.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Crear el soporte con los datos proporcionados
      const soporte = await Soporte.create({
        asunto,
        descripcion,
        prioridad,
        id_negocio,
        id_usuario: usuario.id, 
        imagen: req.file ? req.file.filename : null, // Guardar el nombre de archivo de la imagen si está presente
      });
  
      res.status(201).json({ message: 'Solicitud de soporte creada correctamente', soporte });
    } catch (error) {
      console.error('Error al crear solicitud de soporte:', error);
      res.status(500).json({ error: 'Error al procesar la solicitud de soporte' });
    }
  };
  
  module.exports = { crearSoporte };
  