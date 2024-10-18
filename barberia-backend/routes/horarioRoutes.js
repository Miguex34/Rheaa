// backend/routes/horarioRoutes.js
const express = require('express');
const router = express.Router();
const { actualizarHorario, getHorariosByNegocio } = require('../controllers/horarioController');

router.get('/negocio/:id_negocio', getHorariosByNegocio);
router.put('/negocio/:id_negocio', actualizarHorario);

module.exports = router;