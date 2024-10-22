const express = require('express');
const router = express.Router();
const { createNegocio, getAllNegocios, getNegocioById, updateNegocio, updateCategoria } = require('../controllers/negocioController');
const authMiddleware = require('../middleware/authMiddleware');
 

// Rutas para el negocio
router.post('/negocio', authMiddleware, createNegocio); // Crear negocio
router.get('/negocios', authMiddleware, getAllNegocios); // Obtener todos los negocios
router.get('/negocio/:id', authMiddleware, getNegocioById); // Obtener un negocio por ID
router.put('/negocio/:id', authMiddleware, updateNegocio); // Actualizar negocio completo
router.put('negocio/:id/categoria', authMiddleware, updateCategoria); // Actualizar solo la categoría

module.exports = router;
