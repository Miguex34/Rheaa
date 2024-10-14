// authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token del encabezado
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado.' });
    }

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar al usuario en la base de datos
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // 4. Buscar el negocio del usuario si es necesario
    const negocio = await Negocio.findOne({ where: { id_dueno: usuario.id } });
    if (!negocio) {
      return res.status(400).json({ message: 'El usuario no tiene un negocio asociado.' });
    }

    // 5. Adjuntar el usuario y el negocio al request (req)
    req.user = { ...usuario.toJSON(), id_negocio: negocio.id };

    // 6. Continuar con el siguiente middleware o ruta
    next();
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);

    // 7. Manejar errores de autenticación
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado.' });
    }

    // 8. Error genérico
    res.status(500).json({ message: 'Error de autenticación.' });
  }
};

module.exports = authMiddleware;
