const Message = require('../models/Message');
const io = require('../socket');

exports.saveMessage = async (req, res) => {
    try {
        const { roomId, sender, text } = req.body;
        const newMessage = new Message({ roomId, sender, text });
        await newMessage.save();

        io.to(roomId).emit('message', newMessage); // Emit to all clients in the room
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
