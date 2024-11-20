const express = require('express');
const router = express.Router();
const transbankController = require('../controllers/transbankController');
// Ruta para iniciar la transacción

router.post('/iniciar', transbankController.iniciarTransaccion);

// Ruta para confirmar la transacción (callback de Transbank)
router.post('/retorno', transbankController.finalizarTransaccion);

module.exports = router;
