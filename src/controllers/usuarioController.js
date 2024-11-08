const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');

exports.createUsuario = async (req, res) => {
  const { nombre, email, password, ciudad, intereses, foto } = req.body;
  try {
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password, ciudad, intereses, foto },
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  let { nombre, intereses, foto } = req.body;

  foto = req.file ? path.join('uploads', req.file.filename) : null;

  try {
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nombre, intereses, foto },
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.usuario.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};


// Buscar usuarios por nombre o intereses
exports.searchUsuarios = async (req, res) => {
  const { query, userId } = req.query;
  try {
    const usuarios = await prisma.usuario.findMany({
      where: {
        AND: [
          {
            id: {
              not: parseInt(userId, 10), // Convierte userId a un número
            },
          },
          {
            OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { intereses: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios" });
  }
};


exports.searchNonFriendUsuarios = async (req, res) => {
  const { query, userId } = req.query;

  try {
    const amigosIds = await prisma.amistad.findMany({
      where: {
        OR: [
          { usuarioEnviaId: parseInt(userId, 10), status: "aceptado" },
          { usuarioRecibeId: parseInt(userId, 10), status: "aceptado" },
          { usuarioEnviaId: parseInt(userId, 10), status: "pendiente" },
          { usuarioRecibeId: parseInt(userId, 10), status: "pendiente" }
          
        ]
      },
      select: {
        usuarioEnviaId: true,
        usuarioRecibeId: true
      }
    });

    const amigosIdsArray = amigosIds.map(amistad => 
      amistad.usuarioEnviaId === parseInt(userId, 10)
        ? amistad.usuarioRecibeId
        : amistad.usuarioEnviaId
    );


    const usuarios = await prisma.usuario.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: [...amigosIdsArray, parseInt(userId, 10)]
            }
          },
          {
            OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { intereses: { contains: query, mode: "insensitive" } }
            ]
          }
        ]
      }
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar usuarios no amigos" });
  }
};