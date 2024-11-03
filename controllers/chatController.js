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
exports.clearMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        await Message.deleteMany({ roomId });
        res.status(200).json({ message: 'Messages cleared' });
    } catch (error) {
        console.error('Error clearing messages:', error);
        res.status(500).json({ error: 'Could not clear messages' });
    }
};
