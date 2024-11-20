// archivo: routes/soporteRoutes.js
const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporteController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear una nueva solicitud de soporte
router.post('/', authMiddleware, soporteController.crearSoporte);

module.exports = router;
