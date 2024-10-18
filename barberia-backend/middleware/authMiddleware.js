const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token no proporcionado o mal formado.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca al usuario e incluye su negocio
    const usuario = await Usuario.findOne({
      where: { id: decoded.id },
      include: { model: Negocio, as: 'negocio', attributes: ['id', 'nombre'] },
    });

    if (!usuario) {
      console.error('Usuario no encontrado.');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (!usuario.negocio) {
      console.error('Negocio no encontrado para el usuario:', usuario);
      return res.status(404).json({ message: 'El usuario no tiene un negocio asociado.' });
    }

    // Adjuntar los datos al objeto req.user
    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      id_negocio: usuario.negocio ? usuario.negocio.id : null,
      negocio: usuario.negocio ? {
        id: usuario.negocio.id,
        nombre: usuario.negocio.nombre,
        telefono: usuario.negocio.telefono,
      } : {},
    };

    console.log('Usuario autenticado:', req.user); // Verificar los datos
    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    res.status(500).json({ message: 'Error de autenticación.' });
  }
};

module.exports = authMiddleware;




