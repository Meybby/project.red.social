const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  const { contenido, usuarioId } = req.body;
  try {
    const post = await prisma.post.create({
      data: { contenido, autorId: usuarioId },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({ include: { usuario: true, comentarios: true, likes: true } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts" });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: { autor: true, comentarios: {
        select: {
          autor: true,
          contenido: true,
          id: true
        },
      }, likes: true },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el post" });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { contenido } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { contenido },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el post" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({ where: { id: Number(id) } });
    res.json({ message: "Post eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el post" });
  }
};

// Obtener posts de amigos
exports.getFriendsPosts = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const amigos = await prisma.amistad.findMany({
      where: {
        OR: [
          { usuarioEnviaId: Number(usuarioId), status: "aceptado" },
          { usuarioRecibeId: Number(usuarioId), status: "aceptado" },
        ],
      },
      select: {
        usuarioEnvia: true,
        usuarioRecibe: true,
        usuarioEnviaId: true,
        usuarioRecibeId: true,
      },
    });

    const amigosIds = amigos.map(amigo => 
      amigo.usuarioRecibeId === Number(usuarioId) ? amigo.usuarioEnviaId : amigo.usuarioRecibeId
    );

    const posts = await prisma.post.findMany({
      where: { autorId: { in: [...amigosIds,Number(usuarioId)] } },
      include: { autor: true, comentarios: true, likes: true },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts de amigos" });
  }
};
