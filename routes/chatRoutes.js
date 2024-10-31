const express = require('express');
const { saveMessage, getMessages } = require('../controllers/chatController');
const upload = require('../middleware/Multer')
const router = express.Router();

router.post('/messages',upload.single("image"), saveMessage);
router.get('/messages/:roomId', getMessages);

module.exports = router;
