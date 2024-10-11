// authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Buscar el negocio del usuario y adjuntarlo al req
    const negocio = await Negocio.findOne({ where: { id_dueno: usuario.id } });
    if (!negocio) {
      return res.status(400).json({ message: 'El usuario no tiene un negocio asociado' });
    }

    // Asegúrate de que `id_negocio` se adjunte correctamente
    req.user = { ...usuario.toJSON(), id_negocio: negocio.id };

    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
