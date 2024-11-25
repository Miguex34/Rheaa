const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/register', clienteController.crearCuentaCliente);
router.post('/login', clienteController.loginCliente);
router.get('/verificar-correo', clienteController.verificarCorreo);
router.post('/invitado', clienteController.crearOActualizarCliente);

module.exports = router;
