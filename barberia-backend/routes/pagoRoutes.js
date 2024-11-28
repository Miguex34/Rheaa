// pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Ruta para crear un nuevo pago
router.post('/pagos', pagoController.createPago);

router.post('/completado', pagoController.completePago);


// Ruta para obtener todos los pagos
router.get('/pagos', pagoController.getPagos);

// Ruta para obtener un pago por ID
router.get('/pagos/:id', pagoController.getPagoById);

// Ruta para actualizar un pago (cambiar estado)
router.put('/pagos/:id', pagoController.updatePago);

module.exports = router;
