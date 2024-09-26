const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Rutas de empleados
router.post('/', empleadoController.createEmpleado);
router.get('/negocio/:id_negocio', empleadoController.getEmpleadosByNegocio);
router.get('/:id', empleadoController.getEmpleadoById);

module.exports = router;
