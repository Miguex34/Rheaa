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
  
  module.exports = {
    crearCuentaCliente,
    loginCliente,
  };