const { EmpleadoNegocio } = require('../models/EmpleadoNegocio');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const sendEmail = require('../utils/sendEmail');

exports.createEmpleado = async (req, res) => {
  const { id_usuario, id_negocio, cargo } = req.body;

  try {
    const empleado = await EmpleadoNegocio.create({
      id_usuario,
      id_negocio,
      cargo,
    });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar empleado' });
  }
};

exports.getEmpleadosByNegocio = async (req, res) => {
  try {
    const empleados = await EmpleadoNegocio.findAll({ where: { id_negocio: req.params.id_negocio } });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

exports.getEmpleadoById = async (req, res) => {
  try {
    const empleado = await EmpleadoNegocio.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });

    res.json(empleado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empleado' });
  }
};

// Funciones para creación de empleados por correo
exports.crearEmpleado = async (req, res) => {
  const { correo, id_negocio } = req.body;
  try {
    // Verificar si el empleado ya tiene una cuenta
    const userExists = await db.query(
      'SELECT * FROM usuario WHERE correo = :correo',
      {
        replacements: { correo },
        type: db.QueryTypes.SELECT
      }
    );
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'El empleado ya tiene una cuenta.' });
    }
    // Crear un token aleatorio para un usuario con nombre generico
    // Crear un token de contraseña hash temporal
    const token = crypto.randomBytes(32).toString('hex');
    const temporaryPasswordHash = await bcrypt.hash('temporal', 10);  // Contraseña temporal
    // Crear un nuevo usuario con el token y la contraseña temporal
    const newUser = await db.query(
      'INSERT INTO usuario (nombre, correo, contrasena_hash, token_registro, cuenta_bloqueada, creado_en) VALUES (:nombre, :correo, :contrasena_hash, :token, :cuenta_bloqueada, NOW())',
      {
        replacements: { 
          nombre: 'Usuario Temporal', // Nombre temporal
          correo,
          contrasena_hash: temporaryPasswordHash, // Contraseña temporal
          token,
          cuenta_bloqueada: true 
        }
      }
    );
    const id_usuario = newUser.insertId;
    // Obtener el nombre del negocio para el correo
    const [negocio] = await db.query('SELECT nombre FROM negocio WHERE id = :id_negocio', {
      replacements: { id_negocio },
      type: db.QueryTypes.SELECT
    });
    const nombreNegocio = negocio.nombre;
    // Enviar correo con el token
    const verificationLink = `http://localhost:5000/api/empleados/registro/${token}`;
    // Datos dinámicos para la plantilla de SendGrid
    const dynamicData = {
      nombre: 'Usuario Temporal',
      nombre_negocio: nombreNegocio, // Nombre del negocio
      link_registro: verificationLink // Enlace de registro
    };
    // ID de la plantilla de SendGrid
    const templateId = 'd-c95ad51a50de4de8bc649de798c7c872';
    // Enviar correo usando la plantilla de SendGrid
    await sendEmail(correo, templateId, dynamicData);
    res.status(200).json({ message: 'Correo enviado al empleado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear empleado.' });
  }
};
exports.mostrarFormularioRegistro = async (req, res) => {
  const { token } = req.params;
  try {
    const [user] = await db.query('SELECT * FROM usuario WHERE token_registro = :token', {
      replacements: { token },
      type: db.QueryTypes.SELECT
    });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido.' });
    }
    res.status(200).json({ message: 'Mostrar el formulario de registro' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar token.' });
  }
};
exports.completarRegistroEmpleado = async (req, res) => {
  const { token } = req.params;
  const { nombre, contraseña, telefono, cargo, id_negocio } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM usuario WHERE token_registro = :token', {
      replacements: { token },
      type: db.QueryTypes.SELECT
    });
    if (!user) {
      return res.status(400).json({ message: 'Token inválido.' });
    }
    const id_usuario = user.id;
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await db.query(
      'UPDATE usuario SET nombre = :nombre, contrasena_hash = :hashedPassword, telefono = :telefono, cargo = :cargo,  cuenta_bloqueada = false WHERE id = :id_usuario',
      {
        replacements: {
          nombre,
          hashedPassword,
          telefono,
          cargo,
          id_usuario,
        }
      }
    );
    await db.query(
      'INSERT INTO empleado_negocio (id_usuario, id_negocio) VALUES (:id_usuario, :id_negocio)',
      {
        replacements: { id_usuario, id_negocio }
      }
    );
    res.status(200).json({ message: 'Registro completado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al completar el registro.' });
  }
};