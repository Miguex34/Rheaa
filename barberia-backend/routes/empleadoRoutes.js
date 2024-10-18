const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

// Rutas de empleados
router.post('/', empleadoController.createEmpleado);
router.get('/negocio/:id_negocio', empleadoController.getEmpleadosByNegocio);
router.get('/:id', empleadoController.getEmpleadoById);

// Rutas para la creación de empleados por correo
router.post('/crear', empleadoController.crearEmpleado);  // Ruta para enviar correo
router.get('/registro/:token', empleadoController.mostrarFormularioRegistro); // Mostrar formulario
router.post('/registro/:token', empleadoController.completarRegistroEmpleado); // Completar registro

module.exports = router;
