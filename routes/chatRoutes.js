const express = require('express');
const { saveMessage, getMessages,clearMessages,deleteMessage } = require('../controllers/chatController');
const upload = require('../middleware/Multer')
const router = express.Router();

router.post('/messages',upload.single("image"), saveMessage);
router.get('/messages/:roomId', getMessages);
router.delete('/messages/clear/:roomId',clearMessages);
router.delete('/message/delete/:roomId/:messageId',deleteMessage);

module.exports = router;
