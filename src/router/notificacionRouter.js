const express = require('express');
const controller = require('../controllers/notificacionController');

const router = express.Router();

router.post('/', controller.crearNotificacion);
router.get('/:userId', controller.getNotificationsByUserId);

module.exports = router;
