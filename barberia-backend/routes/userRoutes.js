const express = require('express');
const router = express.Router();
const { register, login, getUserById } = require('../controllers/userController');

// Rutas de usuario
router.post('/register', register); // Asegúrate de que `register` esté correctamente importado
router.post('/login', login);
router.get('/:id', getUserById);

module.exports = router;