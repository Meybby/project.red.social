const prisma = require('../database/prismaClient');

// Controlador para crear una notificación
exports.crearNotificacion = async (req, res) => {
    const { notificacion, userId } = req.body;

    if (!notificacion) {
        return res.status(400).json({ error: 'El campo notificacion es requerido.' });
    }

    try {
        const newNotification = await prisma.notificaciones.create({
            data: {
                notificacion,
                userId
            },
        });

        return res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error al crear la notificación:', error);
        return res.status(500).json({ error: 'Error al crear la notificación.' });
    }
};

exports.getNotificationsByUserId = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'El campo userId es requerido.' });
    }
    try {
        const notifications = await prisma.notificaciones.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { id: 'desc' }, 
        });
        return res.status(200).json(notifications);
    } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        return res.status(500).json({ error: 'Error al obtener notificaciones.' });
    }
};