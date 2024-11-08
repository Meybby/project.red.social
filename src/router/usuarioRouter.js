const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const upload = require('../upload/storage'); 

router.get('/search', usuarioController.searchUsuarios);
router.get("/searchfriends",usuarioController.searchNonFriendUsuarios)
router.post('/', usuarioController.createUsuario);
router.get('/', usuarioController.getUsuarios);
router.get('/:id', usuarioController.getUsuarioById);
router.put('/:id', upload.single('foto'), usuarioController.updateUsuario);
router.delete('/:id', usuarioController.deleteUsuario);

module.exports = router;
