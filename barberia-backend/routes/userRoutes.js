const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de usuario
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);

module.exports = router;
