// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, getUserById, getLoggedUser } = require('../controllers/userController');

// Rutas de usuario
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getLoggedUser); // Ruta /me antes de /:id
router.get('/:id', getUserById);

module.exports = router;
