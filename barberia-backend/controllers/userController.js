// controllers/userController.js
const Usuario = require('../models/Usuario');
const Negocio = require('../models/Negocio');
const DuenoNegocio = require('../models/DuenoNegocio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un usuario y crear su negocio
const register = async (req, res) => {
  const {
    nombre,
    correo,
    contraseña,
    telefono,
    nombreNegocio,
    telefonoNegocio,
    direccionNegocio,
    horario_inicio,
    horario_cierre,
    rol, // Asegúrate de que el rol esté desestructurado
  } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await Usuario.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Crear el hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contrasena_hash: hashedPassword,
      telefono,
      rol, // Asegúrate de incluir el rol aquí
    });

    // Verifica si se crea el usuario correctamente
    console.log('Usuario creado:', nuevoUsuario);

    // Crear el negocio relacionado con el usuario
    const nuevoNegocio = await Negocio.create({
      nombre: nombreNegocio,
      telefono: telefonoNegocio,
      direccion: direccionNegocio,
      horario_inicio,
      horario_cierre,
      correo: nuevoUsuario.correo,
      id_dueno: nuevoUsuario.id, // Asegúrate de asignar el id_dueno al crear el negocio
    });

    // Crear la relación entre el usuario y el negocio (dueño de negocio)
    await DuenoNegocio.create({
      id_dueno: nuevoUsuario.id,
      id_negocio: nuevoNegocio.id,
    });

    // Generar un token JWT para el usuario recién registrado
    const token = jwt.sign({ id: nuevoUsuario.id, correo: nuevoUsuario.correo }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({ message: 'Usuario y negocio creados con éxito', token });
  } catch (error) {
    console.error('Error al registrar el usuario y crear el negocio:', error);
    console.log('Detalles del error:', error.errors); // Imprimir detalles de errores específicos
    return res.status(500).json({ error: 'Error en el registro', detalle: error.message });
  }
};

// Función para el inicio de sesión
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(contraseña, usuario.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
};

// Función para obtener un usuario por su ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    return res.status(500).json({ error: 'Error al obtener el usuario', detalle: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserById,
};
