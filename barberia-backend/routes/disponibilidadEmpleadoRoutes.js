const express = require('express');
const router = express.Router();
const disponibilidadController = require('../controllers/disponibilidadEmpleadoController');

// Rutas para la disponibilidad de empleados
router.post('/', disponibilidadController.createDisponibilidad);
router.get('/empleado/:id_empleado', disponibilidadController.getDisponibilidadByEmpleado);
router.get('/:id', disponibilidadController.getDisponibilidadById);

module.exports = router;
