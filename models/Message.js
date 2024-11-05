const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: { type: String, },
    sender: {  type: String },
    text: { type: String, },
      image:  { type: [String] } ,
    video: { type: [String ]} ,
    pdf:  { type: [String ]} ,
      read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
