const Message = require('../models/Message');

exports.saveMessage = async (req, res) => {
    const { roomId, text, sender } = req.body;
    try {
        const message = new Message({ roomId, text, sender });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
