// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

const SECRET_KEY = "secret"; 

exports.register = async (req, res) => {
  // Validar los datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, nombre, ciudad, intereses } = req.body;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre: "",
        email,
        password: hashedPassword,
        ciudad: "",
        intereses: "",
      },
    });

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};

// Inicio de sesión de usuario
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Crear el token JWT
    const token = jwt.sign({ userId: usuario.id }, SECRET_KEY, { expiresIn: "10h" });

    res.json({ token, user: { id: usuario.id, nombre: usuario.nombre, intereses: usuario.intereses, foto:usuario.foto, email: usuario.email } });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
};
