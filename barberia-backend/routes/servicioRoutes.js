const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

// Rutas para los servicios
router.post('/', servicioController.createServicio);
router.get('/negocio/:id_negocio', servicioController.getServiciosByNegocio);
router.get('/:id', servicioController.getServicioById);

module.exports = router;
