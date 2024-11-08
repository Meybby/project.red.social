// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Ruta de registro
router.post(
  '/register',
  register
);

// Ruta de inicio de sesión
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  ],
  login
);

module.exports = router;
