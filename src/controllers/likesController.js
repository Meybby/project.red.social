const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.toggleLike = async (req, res) => {
  const { usuarioId, postId } = req.body;
  try {
    const existingLike = await prisma.like.findFirst({
      where: { usuarioId, postId },
    });

    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    const post = await prisma.post.findUnique({ where: { id: Number(postId) } });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      const newNotification = await prisma.notificaciones.create({
        data: {
          notificacion: `El usuario ${usuario.email} ha removido su like de tu post`,
          userId: post.autorId
        },
      });

      res.status(201).json({ message: "Like eliminado" });
    } else {
      const like = await prisma.like.create({ data: { usuarioId, postId } });
      const newNotification = await prisma.notificaciones.create({
        data: {
          notificacion: `El usuario ${usuario.email} le dado like a tu post`,
          userId: post.autorId
        },
      });

      res.status(201).json({ message: "Like creado" });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Error al gestionar el like" });
  }
};
