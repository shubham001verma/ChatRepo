const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String,  },
    email: { type: String, unique:true },
    password: { type: String, },
    uploadImage: {
        type: String, // URL or path to the user's avatar image
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
          mobile: {
        type: String,
       

    },
      DateofBirth:{
        type: String,
       
      },
      bio:{
        type: String,
        maxlength: 500,
      },
    code: {
  type: String,
  unique: true,
  required: true
},
    // User Schema (add to your existing schema)
blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
