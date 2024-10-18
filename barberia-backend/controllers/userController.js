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
    cargo, // Ahora cargo en lugar de rol
  } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const emailExists = await Usuario.findOne({ where: { correo } });
    if (emailExists) {
      return res.status(400).json({ message: 'El correo ya está en uso.' });
    }
    const negocioExists = await Negocio.findOne({ where: { nombre: nombreNegocio } });
     if (negocioExists) {
       return res.status(400).json({ message: 'El nombre del negocio ya está en uso.' });
     }
     
    // Crear el hash de la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contrasena_hash: hashedPassword,
      telefono,
      cargo, // Asegúrate de incluir el rol aquí
    });

    // Verifica si se crea el usuario correctamente
    console.log('Usuario creado:', nuevoUsuario);
    // Verificar si el nombre del negocio ya está en uso
    
    // Crear el negocio relacionado con el usuario
    const nuevoNegocio = await Negocio.create({
      nombre: nombreNegocio,
      telefono: telefonoNegocio,
      direccion: direccionNegocio,
      horario_inicio,
      horario_cierre,
      correo: nuevoUsuario.correo,
      id_dueno: nuevoUsuario.id, 
    });
    

    // Crear la relación entre el usuario y el negocio (dueño de negocio)
    await DuenoNegocio.create({
      id_usuario: nuevoUsuario.id,
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

const getLoggedUser = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id: req.user.id },
      include: {
        model: Negocio,
        as: 'negocio',
        attributes: ['id', 'nombre', 'telefono'],
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      negocio: usuario.negocio || {},
    });
  } catch (error) {
    console.error('Error al obtener el usuario logeado:', error);
    res.status(500).json({ error: 'Error al obtener el usuario logeado' });
  }
};




module.exports = {
  register,
  login,
  getUserById,
  getLoggedUser,
};
