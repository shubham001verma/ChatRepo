const Message = require('../models/Message');
const io = require('../socket');
const { getIo } = require('../socket'); // Adjust path



exports.saveMessage = async (req, res) => {
    try {
        const { roomId, sender, text } = req.body;
          const image=  req.file ? req.file.path : null
        const newMessage = new Message({ roomId, sender, text,image });
        await newMessage.save();

        const io = getIo();  // Retrieve the initialized io instance
        io.to(roomId).emit('message', newMessage); // Broadcast message to the room
        res.json(newMessage); 
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.roomId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};
