const prisma = require('../database/prismaClient');

// Enviar solicitud de amistad
exports.enviarSolicitud = async (req, res) => {
  const { usuarioEnviaId, usuarioRecibeId } = req.body;
  console.log(usuarioEnviaId, usuarioRecibeId);

  try {
    const amistadExistente = await prisma.amistad.findFirst({
      where: {
        AND: [
          { usuarioEnviaId: usuarioEnviaId },
          { usuarioRecibeId: usuarioRecibeId },
        ],
      },
    });

    if (amistadExistente) {
      return res.status(400).json({ error: "Ya existe una solicitud de amistad" });
    }

    const nuevaSolicitud = await prisma.amistad.create({
      data: {
        usuarioEnviaId,
        usuarioRecibeId,
        status: "pendiente",
      },
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioEnviaId) } });

    const newNotification = await prisma.notificaciones.create({
      data: {
        notificacion: `El usuario ${usuario.email} te ha enviado una solicitud de amistad`,
        userId: usuarioRecibeId
      },
    });

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ error: "Error al enviar la solicitud de amistad" });
  }
};

// Aceptar solicitud de amistad
exports.aceptarSolicitud = async (req, res) => {
  const { id } = req.params; // id es el ID de la relación de amistad
  try {
    const amistad = await prisma.amistad.update({
      where: { id: Number(id) },
      data: { status: "aceptado" },
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(amistad.usuarioRecibeId) } });
    console.log(usuario);
    console.log(amistad);
    
    
    const newNotification = await prisma.notificaciones.create({
      data: {
        notificacion: `El usuario ${usuario.email} ha aceptado tu solicitud de amistad`,
        userId: amistad.usuarioEnviaId
      },
    });

    res.json(amistad);
  } catch (error) {
    res.status(500).json({ error: "Error al aceptar la solicitud de amistad" });
  }
};

// Rechazar solicitud de amistad
exports.rechazarSolicitud = async (req, res) => {
  const { id } = req.params; // id es el ID de la relación de amistad
  try {
    const amistad = await prisma.amistad.delete({
      where: { id: Number(id) },
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    const newNotification = await prisma.notificaciones.create({
      data: {
        notificacion: `El usuario ${usuario.email} ha rechazado tu solicitud de amistad`,
        userId: amistad.usuarioEnviaId
      },
    });

    res.json({ message: "Solicitud de amistad rechazada", amistad });
  } catch (error) {
    res.status(500).json({ error: "Error al rechazar la solicitud de amistad" });
  }
};

// Listar amigos de un usuario
exports.listarAmigos = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const amigos = await prisma.amistad.findMany({
      where: {
        OR: [
          { usuarioEnviaId: Number(usuarioId), status: "aceptado" },
          { usuarioRecibeId: Number(usuarioId), status: "aceptado" },
        ],
      },
      include: {
        usuarioEnvia: true, // Incluir información del amigo que envió la solicitud
        usuarioRecibe: true, // Incluir información del amigo que recibió la solicitud
      },
    });

    res.json(amigos);
  } catch (error) {
    res.status(500).json({ error: "Error al listar amigos" });
  }
};

// Obtener solicitudes de amistad pendientes
exports.getPendingRequests = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const pendingRequests = await prisma.amistad.findMany({
      where: {
        usuarioRecibeId: Number(usuarioId),
        status: "pendiente",
      },
      include: {
        usuarioEnvia: true, // Incluir información del emisor de la solicitud
      },
    });
    res.json(pendingRequests);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener solicitudes pendientes" });
  }
};
