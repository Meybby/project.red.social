const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController'); 

// Obtener todos los mensajes entre dos usuarios
router.get('/:usuarioId1/:usuarioId2',  mensajeController.obtenerMensajes);

// Enviar un nuevo mensaje
router.post('/', mensajeController.enviarMensaje);

// Obtener mensajes enviados y recibidos por un usuario específico
router.get('/usuario/:usuarioId',mensajeController.obtenerMensajesPorUsuario);

// Eliminar un mensaje
router.delete('/:mensajeId', mensajeController.eliminarMensaje);

// Marcar mensaje como leído
router.put('/leido/:mensajeId', mensajeController.marcarComoLeido);

// Obtener chats activos de un usuario
router.get('/activos/:usuarioId', mensajeController.obtenerChatsActivos);

module.exports = router;
