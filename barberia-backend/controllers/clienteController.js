const Cliente = require('../models/Cliente');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const crearCuentaCliente = async (req, res) => {
    const { nombre, apellido, email_cliente, password_cliente, celular_cliente } = req.body;
  
    try {
      // Validar si el correo ya está en uso
      const clienteExistente = await Cliente.findOne({ where: { email_cliente } });
      if (clienteExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
      }
  
      // Generar un hash de la contraseña
      const hashedPassword = await bcrypt.hash(password_cliente, 10);
  
      // Crear el cliente
      const nuevoCliente = await Cliente.create({
        nombre,
        apellido,
        email_cliente,
        password_cliente: hashedPassword,
        celular_cliente,
      });
  
      // Generar el token JWT
      const token = jwt.sign(
        {
          id: nuevoCliente.id,
          email: nuevoCliente.email_cliente,
          nombre: nuevoCliente.nombre,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(201).json({
        message: 'Cuenta creada exitosamente.',
        cliente: {
          id: nuevoCliente.id,
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          email_cliente: nuevoCliente.email_cliente,
          celular_cliente: nuevoCliente.celular_cliente,
        },
        token,
      });
    } catch (error) {
      console.error('Error al crear la cuenta del cliente:', error);
      res.status(500).json({ message: 'Error al crear la cuenta del cliente.', error: error.message });
    }
  };

  const loginCliente = async (req, res) => {
    const { correo, contraseña } = req.body;
  
    try {
      // Buscar el cliente en la tabla 'Cliente' utilizando el correo proporcionado
      const cliente = await Cliente.findOne({ where: { email_cliente: correo } });
      if (!cliente) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
  
      // Comparar la contraseña proporcionada con el hash almacenado
      const isPasswordValid = await bcrypt.compare(contraseña, cliente.password_cliente);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar un token JWT para el cliente
      const token = jwt.sign({ id: cliente.id, correo: cliente.email_cliente }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      return res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
    }
  };
  
  const verificarCorreo = async (req, res) => {
    const { email } = req.query; // Recibe el correo por query params

    try {
        // Verificar si el correo ya está registrado
        const cliente = await Cliente.findOne({ where: { email_cliente: email } });

        if (cliente) {
            return res.status(200).json({
                registrado: true,
                message: 'El correo ya está registrado. Por favor, inicia sesión.',
            });
        }

        return res.status(200).json({
            registrado: false,
            message: 'El correo está disponible.',
        });
    } catch (error) {
        console.error('Error al verificar el correo:', error);
        res.status(500).json({ error: 'Error interno al verificar el correo.' });
    }
  };
  
  const crearOActualizarCliente = async (req, res) => {
    const { nombre, email, telefono, is_guest } = req.body;

    try {
        // Verificar si ya existe un cliente con el mismo correo
        let cliente = await Cliente.findOne({ where: { email_cliente: email } });

        if (cliente) {
            return res.status(200).json({
                message: 'El cliente ya existe.',
                clienteId: cliente.id, // Retorna el ID del cliente existente
            });
        }

        // Si no existe, crear un cliente nuevo
        cliente = await Cliente.create({
            nombre,
            email_cliente: email,
            celular_cliente: telefono || null, // Teléfono es opcional
            is_guest: is_guest || true, // Por defecto, es un cliente invitado
            password_cliente: null, // Los clientes invitados no tienen contraseña
            token_recuperacion_cliente: null, // No aplicable para invitados
        });

        return res.status(201).json({
            message: 'Cliente invitado creado exitosamente.',
            clienteId: cliente.id, // Retorna el ID del cliente recién creado
        });
    } catch (error) {
        console.error('Error al crear o actualizar cliente:', error);
        res.status(500).json({ error: 'Error interno al manejar el cliente.' });
    }
  };

  module.exports = {
    crearCuentaCliente,
    loginCliente,
    verificarCorreo,
    crearOActualizarCliente,
  };