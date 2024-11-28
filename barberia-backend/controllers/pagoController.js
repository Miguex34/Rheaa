const { WebpayPlus, Options, Environment } = require('transbank-sdk');
const Pago = require('../models/Pago');
const Reserva = require('../models/Reserva');

// Configuración del SDK de Transbank
const options = new Options(
  '597055555532', // Código de comercio para pruebas
  '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C' // API Key
);
const transaction = new WebpayPlus.Transaction(options, Environment.Integration);

// Crear un pago
exports.createPago = async (req, res) => {
  try {
    const { id_reserva, monto, metodo_pago } = req.body;

    // Validaciones
    if (!id_reserva || !monto || !metodo_pago) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    if (typeof monto !== 'number' || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser un número positivo.' });
    }

    if (metodo_pago !== 'Transbank') {
      return res.status(400).json({ message: 'Método de pago no válido.' });
    }

    const reserva = await Reserva.findByPk(id_reserva);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    // Crear la transacción
    const buyOrder = `Reserva-${id_reserva}-${Date.now()}`;
    const sessionId = `Session-${id_reserva}-${Date.now()}`;
    const returnUrl = 'http://localhost:5000/api/pagos/completado';

    console.log('Parámetros enviados a Transbank:');
    console.log('buyOrder:', buyOrder);
    console.log('sessionId:', sessionId);
    console.log('monto:', monto);
    console.log('returnUrl:', returnUrl);

    const response = await transaction.create(buyOrder, sessionId, monto, returnUrl);

    if (!response.token || !response.url) {
      throw new Error('Error al generar la transacción con Transbank');
    }

    // Guardar el pago en la base de datos
    const pago = await Pago.create({
      id_reserva,
      monto,
      metodo_pago,
      fecha: new Date(),
      estado: 'Pendiente',
      codigo_transaccion: response.token,
      url_transaccion: response.url,
    });

    res.status(201).json({
      message: 'Pago creado con éxito',
      pago,
      url: response.url,
    });
  } catch (error) {
    console.error('Error al crear el pago:', error.message);
    res.status(500).json({ message: 'Error al crear el pago', error: error.message });
  }
};



// Completar el pago después de la respuesta de Transbank
exports.completePago = async (req, res) => {
  try {
    const { token_ws } = req.body;

    if (!token_ws) {
      return res.status(400).json({ message: 'Token de transacción no proporcionado.' });
    }

    // Confirmar la transacción con Transbank
    const response = await WebpayPlus.Transaction.commit(token_ws);

    const { status } = response;

    // Buscar el pago en la base de datos
    const pago = await Pago.findOne({ where: { codigo_transaccion: token_ws } });
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado en la base de datos.' });
    }

    // Actualizar el estado del pago
    pago.estado = status === 'AUTHORIZED' ? 'Completado' : 'Rechazado';
    await pago.save();

    // Actualizar la reserva asociada si el pago fue autorizado
    if (status === 'AUTHORIZED' && pago.id_reserva) {
      const reserva = await Reserva.findByPk(pago.id_reserva);
      if (reserva) {
        reserva.id_pago = pago.id;
        await reserva.save();
      }
    }

    res.status(200).json({
      message: `Pago ${status === 'AUTHORIZED' ? 'autorizado' : 'rechazado'}`,
      pago,
    });
  } catch (error) {
    console.error('Error al completar el pago:', error.message);
    res.status(500).json({ message: 'Error al completar el pago', error: error.message });
  }
};


// Obtener todos los pagos
exports.getPagos = async (req, res) => {
  try {
    const pagos = await Pago.findAll();
    res.status(200).json(pagos);
  } catch (error) {
    console.error('Error al obtener los pagos:', error);
    res.status(500).json({ message: 'Error al obtener los pagos', error });
  }
};

// Obtener un pago por ID
exports.getPagoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id);

    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.status(200).json(pago);
  } catch (error) {
    console.error('Error al obtener el pago:', error);
    res.status(500).json({ message: 'Error al obtener el pago', error });
  }
};

// Actualizar un pago
exports.updatePago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto, metodo_pago, estado } = req.body;

    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    pago.monto = monto || pago.monto;
    pago.metodo_pago = metodo_pago || pago.metodo_pago;
    pago.estado = estado || pago.estado;

    await pago.save();
    res.status(200).json({ message: 'Pago actualizado con éxito', pago });
  } catch (error) {
    console.error('Error al actualizar el pago:', error);
    res.status(500).json({ message: 'Error al actualizar el pago', error });
  }
};

// Eliminar un pago
exports.deletePago = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await Pago.findByPk(id);

    if (!pago) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    await pago.destroy();
    res.status(200).json({ message: 'Pago eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar el pago:', error);
    res.status(500).json({ message: 'Error al eliminar el pago', error });
  }
};
