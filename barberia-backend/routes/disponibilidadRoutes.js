const express = require('express');
const router = express.Router();
const disponibilidadController = require('../controllers/disponibilidadController'); // Asegúrate de que el controlador esté en la carpeta correcta

// Rutas para la disponibilidad de empleados
router.post('/', disponibilidadController.createDisponibilidad);
router.get('/:id_empleado', disponibilidadController.getDisponibilidadByEmpleado);

module.exports = router;
