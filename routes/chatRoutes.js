const express = require('express');
const { saveMessage, getMessages } = require('../controllers/chatController');
const router = express.Router();

router.post('/messages', saveMessage);
router.get('/messages/:roomId', getMessages);

module.exports = router;
