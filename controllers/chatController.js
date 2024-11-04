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
exports.deleteMessage = async (req, res) => {
    const { roomId, messageId } = req.params;

    try {
        // Find and delete the message by roomId and messageId
        const deletedMessage = await Message.findOneAndDelete({ _id: messageId, roomId });

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Error deleting message' });
    }




    
exports.updateMessage = async (req, res) => {
    const { roomId, messageId } = req.params;

    try {
        // Find the message by roomId and messageId, and update the `read` field to false
        const updatedMessage = await Message.findOneAndUpdate(
            { _id: messageId, roomId },
            { read: true },
            { new: true } // Return the updated document
        );

        if (!updatedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message updated successfully', updatedMessage });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Error updating message' });
    }
};



exports.notification = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const notifications = await Message.find({ roomId: roomId, read:false });
        
        res.json(notifications.length.toString());
        console.log(notifications.length.toString());
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

