// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = "secret"; // Mueve esto a una variable de entorno en producción

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Acceso denegado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};
