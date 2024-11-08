const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createComentario = async (req, res) => {
  const { contenido, usuarioId, postId } = req.body;
  try {
    const comentario = await prisma.comentario.create({
      data: { contenido, autorId: usuarioId, postId },
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    const post = await prisma.post.findUnique({ where: { id: Number(postId) } });
    const newNotification = await prisma.notificaciones.create({
      data: {
        notificacion: `El usuario ${usuario.email} ha comentado tu post`,
        userId: post.autorId
      },
    });

    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el comentario" });
  }
};

exports.getComentarios = async (req, res) => {
  try {
    const comentarios = await prisma.comentario.findMany({ include: { usuario: true, post: true } });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los comentarios" });
  }
};

exports.getComentariosByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const comentarios = await prisma.comentario.findMany({
      where: { postId: Number(postId) },
      include: { usuario: true },
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios del post" });
  }
};

exports.eliminarComentario = async (req, res) => {
  const { id } = req.params;
  try {
    const comentarios = await prisma.comentario.delete({
      where: { id: Number(id) },
    });

    res.status(201).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios del post" });
  }
};

exports.actualizarComentario = async (req, res) => {
  const { id } = req.params;
  const { contenido } = req.body;

  try {
    const comentarios = await prisma.comentario.update({
      where: { id: Number(id) },
      data: {contenido}
    });

    res.status(201).json(comentarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener comentarios del post" });
  }
};

