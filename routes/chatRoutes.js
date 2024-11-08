const express = require('express');
const { saveMessage, getMessages,clearMessages,deleteMessage ,updateMessage,notification} = require('../controllers/chatController');
const upload = require('../middleware/Multer')
const router = express.Router();

router.post('/messages', upload.fields([
    { name: 'image', maxCount: 10 },
    { name: 'video', maxCount: 10 },
    { name: 'pdf', maxCount: 10 }
]),saveMessage);
router.get('/messages//:roomId/:userId', getMessages);
router.delete('/messages/clear/:roomId',clearMessages);
router.delete('/message/delete/:roomId/:messageId',deleteMessage);
router.get('/notification/:roomId',notification);
router.put('/message/update/:roomId/:messageId',updateMessage);

module.exports = router;
