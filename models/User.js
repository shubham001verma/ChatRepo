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
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // checks if the number has exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit number!`
        }
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
