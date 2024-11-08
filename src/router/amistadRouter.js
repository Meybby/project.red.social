const express = require('express');
const amistadController = require('../controllers/amistadController');

const router = express.Router();

router.post('/solicitud', amistadController.enviarSolicitud);

router.put('/aceptar/:id', amistadController.aceptarSolicitud);

router.delete('/rechazar/:id', amistadController.rechazarSolicitud);

router.get('/amigos/:usuarioId', amistadController.listarAmigos);

router.get('/pendientes/:usuarioId', amistadController.getPendingRequests);

module.exports = router;
