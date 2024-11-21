const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/register', clienteController.crearCuentaCliente);
router.post('/loginc', clienteController.loginCliente);

module.exports = router;
