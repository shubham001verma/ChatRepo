const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: { type: String, },
    sender: {  type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
