// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, getUserById, getLoggedUser,updateUser, uploadProfileImage } = require('../controllers/userController');
const upload = require('../middleware/upload');

// Rutas de usuario
router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getLoggedUser); // Ruta /me antes de /:id
router.get('/:id', getUserById);
router.put('/update', authMiddleware, updateUser);
router.post('/upload-profile-image', authMiddleware, (req, res) => {
    upload.single('profileImage')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      // Llama al controlador si no hay errores
      uploadProfileImage(req, res);
    });
  });
  
module.exports = router;
