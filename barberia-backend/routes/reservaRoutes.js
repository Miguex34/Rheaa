const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Ruta para crear una reserva (disponible para cualquier usuario)
router.post('/reservas', reservaController.createReserva);

// Ruta para obtener disponibilidad de un servicio en una fecha específica
router.get('/disponibilidad/:id_servicio/:fecha', reservaController.getDisponibilidad);

module.exports = router;
