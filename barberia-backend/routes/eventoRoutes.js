const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const authMiddleware = require('../middleware/authMiddleware'); // Asegurarse de importar el middleware si es necesario

// Ruta para crear un evento (requiere autenticación)
router.post('/eventos', authMiddleware, eventoController.createEvento);

// Ruta para obtener todos los eventos de un negocio específico
router.get('/eventos/negocio/:id_negocio', eventoController.getEventos);

// Ruta para actualizar un evento (requiere autenticación)
router.put('/eventos/:id', authMiddleware, eventoController.updateEvento);

// Ruta para eliminar un evento (requiere autenticación)
router.delete('/eventos/:id', authMiddleware, eventoController.deleteEvento);

module.exports = router;
