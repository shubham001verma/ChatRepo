const socketIO = require('socket.io');
const Message = require('./models/Message');

const socketHandler = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });

        socket.on('sendMessage', async (data) => {
            const { roomId, sender, text } = data;
            const message = new Message({ roomId, sender, text });
            await message.save();

            io.to(roomId).emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

module.exports = socketHandler;
