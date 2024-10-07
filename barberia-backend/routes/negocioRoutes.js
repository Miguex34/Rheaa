const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocioController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Rutas para el negocio
router.post('/crear', authMiddleware, negocioController.createNegocio); // POST para crear negocio
router.get('/', negocioController.getAllNegocios); // GET para obtener todos los negocios
router.get('/:id', negocioController.getNegocioById); // GET para obtener negocio por ID

module.exports = router;
