const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likesController');

router.post('/toggle', likeController.toggleLike);

module.exports = router;
