const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");


const authRoutes = require('../src/router/authRouter');
const authMiddleware = require('../src/middlewares/authMiddleware');
const amistadRoutes = require('../src/router/amistadRouter');
const likesRoutes = require('../src/router/likesRouter');
const comentarioRoutes = require('../src/router/comentarioRouter');
const mensajeRoutes = require('../src/router/mensajeRouter');
const postRoutes = require('../src/router/postRouter');
const usuarioRoutes = require('../src/router/usuarioRouter');
const notiRoutes = require('../src/router/notificacionRouter');

const path = require('path');
const prisma = require('./database/prismaClient');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.use('/api/auth', authRoutes);
app.use('/api/amistad', authMiddleware, amistadRoutes);
app.use('/api/likes', authMiddleware, likesRoutes);
app.use('/api/mensajes', authMiddleware, mensajeRoutes);
app.use('/api/user', authMiddleware, usuarioRoutes);
app.use('/api/comentario', authMiddleware, comentarioRoutes);
app.use('/api/post', authMiddleware, postRoutes);
app.use('/api/noti', authMiddleware, notiRoutes);


app.use('/api/uploads', express.static(path.join(__dirname, '..', 'uploads')));


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const connectedClients = {}

io.on('connection', (socket) => {
  console.log("HERE");
  
  // Escuchar mensajes y reenviar al destinatario
  socket.on('enviarMensaje', async (data) => {
    const { senderId, receiverId, text, userId, userReceiveId } = data;
    const destinatarioSocketId = connectedClients[userReceiveId];

    if (destinatarioSocketId) {
      const usuario = await prisma.usuario.findUnique({ where: { id: Number(userId) } });
      
      socket.to(destinatarioSocketId).emit('nuevoMensaje', {
        text,
        from: socket.id,
        fromId: userId,
        senderId: userId,
        name: usuario.nombre || usuario.email
      });

      await prisma.mensaje.create({
        data: {
          contenido: text,
          enviadoPorId: userId,
          recibidoPorId: userReceiveId
        }
      });


    } else {
      console.log('Destinatario no conectado:', userReceiveId);
    }
  });

  //Conectar usuario
  socket.on('getOnlineFriends', (data) => {
    const { id, socketId } = data;
    connectedClients[id] = socket.id;
    console.log(connectedClients);
  });

  // Desconexión de usuario
  socket.on('disconnect', () => {
    for (const username in connectedClients) {
      if (connectedClients[username] === socket.id) {
        delete connectedClients[username];
        break;
      }
    }
    console.log('Cliente desconectado');
  });

});

console.log("SOCKET");

const PORT = 3000 + 1
server.listen(PORT, () => { 
  console.log(PORT);
  
})
module.exports = app;