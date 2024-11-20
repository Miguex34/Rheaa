const WebpayPlus = require('../config/transbankConfig');
const uuid = require('uuid');

// Iniciar transacción
const iniciarTransaccion = async (req, res) => {
  try {
    const { monto, sessionId, buyOrder, returnUrl } = req.body;

    // Inicia la transacción usando Webpay Plus SDK
    const response = await WebpayPlus.create(buyOrder, sessionId, monto, returnUrl);
    
    res.status(200).json({
      url: response.url,
      token: response.token,
    });
  } catch (error) {
    console.error('Error al iniciar la transacción:', error);
    res.status(500).json({ message: 'Error al iniciar la transacción' });
  }
};

// Confirmar transacción
const finalizarTransaccion = async (req, res) => {
  const { token_ws } = req.body;

  try {
    const commitResponse = await WebpayPlus.Transaction.commit(token_ws);

    if (commitResponse.status === 'AUTHORIZED') {
      res.json({
        message: 'Pago exitoso',
        transaction: commitResponse
      });
    } else {
      res.json({
        message: 'Pago no autorizado',
        transaction: commitResponse
      });
    }
  } catch (error) {
    console.error('Error al finalizar la transacción:', error);
    res.status(500).json({ error: 'Error al finalizar la transacción con Transbank' });
  }
};

module.exports = {
  iniciarTransaccion,
  finalizarTransaccion,
};
