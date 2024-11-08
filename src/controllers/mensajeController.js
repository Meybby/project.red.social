const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Obtener todos los mensajes entre dos usuarios
exports.obtenerMensajes = async (req, res) => {
    const { usuarioId1, usuarioId2 } = req.params;

    try {
        const mensajes = await prisma.mensaje.findMany({
            where: {
                OR: [
                    { enviadoPorId: parseInt(usuarioId1), recibidoPorId: parseInt(usuarioId2) },
                    { enviadoPorId: parseInt(usuarioId2), recibidoPorId: parseInt(usuarioId1) }
                ]
            },
            include: { enviadoPor: true, recibidoPor: true },
            orderBy: {
                createdAt: 'asc'
            }
        });
        return res.json(mensajes);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Enviar un mensaje
exports.enviarMensaje = async (req, res) => {
    const { contenido, recibidoPorId } = req.body;
    const enviadoPorId = req.user.id; // Asumiendo que tienes el ID del usuario en req.user tras la autenticación

    try {
        const nuevoMensaje = await prisma.mensaje.create({
            data: {
                contenido,
                enviadoPorId,
                recibidoPorId
            }
        });
        return res.status(201).json(nuevoMensaje);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Obtener mensajes por usuario
exports.obtenerMensajesPorUsuario = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const mensajesEnviados = await prisma.mensaje.findMany({
            where: { enviadoPorId: parseInt(usuarioId) }
        });

        const mensajesRecibidos = await prisma.mensaje.findMany({
            where: { recibidoPorId: parseInt(usuarioId) }
        });

        return res.json({
            enviados: mensajesEnviados,
            recibidos: mensajesRecibidos
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Eliminar un mensaje
exports.eliminarMensaje = async (req, res) => {
    const { mensajeId } = req.params;

    try {
        const mensaje = await prisma.mensaje.findUnique({
            where: { id: parseInt(mensajeId) }
        });
        if (!mensaje) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        await prisma.mensaje.delete({
            where: { id: parseInt(mensajeId) }
        });
        return res.status(204).send(); // Sin contenido
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Marcar mensaje como leído
exports.marcarComoLeido = async (req, res) => {
    const { mensajeId } = req.params;

    try {
        const mensaje = await prisma.mensaje.findUnique({
            where: { id: parseInt(mensajeId) }
        });
        if (!mensaje) {
            return res.status(404).json({ error: 'Mensaje no encontrado' });
        }

        // Aquí puedes agregar la lógica para marcar el mensaje como leído si es necesario
        // Ejemplo: mensaje.leido = true; (asegurándote de que el modelo tenga este campo)
        await prisma.mensaje.update({
            where: { id: parseInt(mensajeId) },
            data: {
                // Asumiendo que hay un campo `leido` en tu modelo de Mensaje
                // leido: true
            }
        });

        return res.json(mensaje);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Obtener chats activos
exports.obtenerChatsActivos = async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const mensajesRecibidos = await prisma.mensaje.findMany({
            where: { recibidoPorId: parseInt(usuarioId) },
            select: {
                enviadoPorId: true
            },
            distinct: ['enviadoPorId']
        });

        const chatsActivos = mensajesRecibidos.map(m => m.enviadoPorId);
        return res.json(chatsActivos);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
