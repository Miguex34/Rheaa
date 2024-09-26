const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Rutas para las citas
router.post('/', citaController.createCita);
router.get('/negocio/:id_negocio', citaController.getCitasByNegocio);
router.get('/:id', citaController.getCitaById);

module.exports = router;
