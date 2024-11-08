const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentarioController');

router.post('/', comentarioController.createComentario);
router.get('/', comentarioController.getComentarios);
router.delete('/:id', comentarioController.eliminarComentario);
router.put('/:id', comentarioController.actualizarComentario);
router.get('/post/:postId', comentarioController.getComentariosByPost);

module.exports = router;
