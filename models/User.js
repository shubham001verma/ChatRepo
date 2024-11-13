const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String,  },
    email: { type: String,  unique: true },
    password: { type: String, },
    uploadImage: {
        type: String, // URL or path to the user's avatar image
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
          mobile: {
        type: Number,
        required: true,
        unique: true,
        min: 1000000000, // minimum 10-digit number (e.g., 1000000000)
    max: 9999999999, // maximum 10-digit number (e.g., 9999999999)      
    
    },
      DateofBirth:{
        type: String,
       
      },
      bio:{
        type: String,
        maxlength: 500,
      },
    // User Schema (add to your existing schema)
blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
