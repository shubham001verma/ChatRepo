const Message = require('../models/Message');
const User = require('../models/User');
const io = require('../socket');
const { getIo } = require('../socket'); // Adjust path



exports.saveMessage = async (req, res) => {
    try {
        const { roomId, sender, text,selectedUserId } = req.body;
       const image= req.files['image'] ? req.files['image'].map(file => file.path) : [];
       const     video= req.files['video'] ? req.files['video'].map(file => file.path) : [];
        const    pdf= req.files['pdf'] ? req.files['pdf'].map(file => file.path) : [];
    const recipientUser = await User.findById(selectedUserId);
        if (recipientUser && recipientUser.blockedUsers.includes(sender)) {
            return res.status(403).json({ message: 'Message cannot be sent, the recipient has blocked you' });
        }
        // Create and save the message with uploaded files
        const message = new Message({
            roomId,
            sender,
            text,
            image,  // Store image file paths
            video,  // Store video file paths
            pdf,     // Store PDF file paths
            read: false,
        });

        const savedMessage = await message.save();

        // Emit message over socket to notify clients in the room
        const io = getIo();
        io.to(roomId).emit('message', savedMessage);

        // Respond with the saved message
        res.status(200).json(savedMessage);
    } catch (error) {
        console.error('Error saving message:', error);
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

};


    
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
        
        res.json(notifications);
       
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

