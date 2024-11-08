const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Define el directorio de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nombra el archivo de manera única
  },
});

const upload = multer({ storage: storage });
module.exports = upload;