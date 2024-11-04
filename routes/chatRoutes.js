const express = require('express');
const { saveMessage, getMessages,clearMessages,deleteMessage ,updateMessage,notification} = require('../controllers/chatController');
const upload = require('../middleware/Multer')
const router = express.Router();

router.post('/messages',upload.single("image"), saveMessage);
router.get('/messages/:roomId', getMessages);
router.delete('/messages/clear/:roomId',clearMessages);
router.delete('/message/delete/:roomId/:messageId',deleteMessage);
router.get('/notification/:roomId',notification);
router.put('/message/update/:roomId/:messageId',updateMessage);

module.exports = router;
