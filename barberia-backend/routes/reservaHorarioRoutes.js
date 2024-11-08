// routes/reservaHorarioRoutes.js
const express = require('express');
const router = express.Router();
const reservaHorarioController = require('../controllers/reservaHorarioController');

// Ruta para obtener el calendario de disponibilidad de un negocio
router.get('/calendario/:negocioId', reservaHorarioController.obtenerCalendarioDisponibilidad);

// Ruta para obtener bloques de horarios disponibles
router.get('/bloques/:negocioId/:servicioId/:fecha', reservaHorarioController.obtenerBloquesDisponibles);

module.exports = router;
