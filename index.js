const express = require('express');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const {socketHandler} = require('./socket');

const mongoose  = require('mongoose');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
mongoose.connect('mongodb+srv://sshubham123verma:shubham123@cluster0.fbixo.mongodb.net/ChatApp').then(()=>{
    console.log('MongoDB connected...');
});

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Socket.IO
socketHandler(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use('/uploads', express.static('uploads'));
