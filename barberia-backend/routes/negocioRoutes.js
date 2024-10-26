const express = require('express');
const router = express.Router();
const { createNegocio, getAllNegocios, getNegocioById, updateNegocio, updateCategoria } = require('../controllers/negocioController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Rutas para el negocio
router.post('/negocio', authMiddleware, createNegocio); // Crear negocio
router.get('/negocios', authMiddleware, getAllNegocios); // Obtener todos los negocios
router.get('/negocios/:id', authMiddleware, getNegocioById); // Obtener un negocio por ID
router.put('/:id', authMiddleware, (req, res) => {
    upload.single('logo')(req, res, (err) => {
      if (err) {
        // Si hay un error relacionado con `multer`, se maneja aquí
        return res.status(400).json({ message: err.message });
      }
  
      // Si no hay error, procede con el controlador `updateNegocio`
      updateNegocio(req, res);
    });
  });  // Para actualizar todo el negocio
router.put('/negocios/:id/categoria', authMiddleware, updateCategoria); // Para actualizar solo la categoría


module.exports = router;
