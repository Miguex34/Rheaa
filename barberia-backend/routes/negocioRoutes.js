const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');

// Rutas para el negocio
router.post('/', negocioController.createNegocio);
router.get('/', negocioController.getAllNegocios);
router.get('/:id', negocioController.getNegocioById);

module.exports = router;
