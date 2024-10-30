const socketIO = require('socket.io');

let io;

const socketHandler = (server) => {
    if (!io) {  // Initialize only if io is undefined
        io = socketIO(server, {
            cors: {
                origin: '*',
            },
        });

        io.on('connection', (socket) => {
            socket.on('joinRoom', (roomId) => {
                socket.join(roomId);
            });

            socket.on('leaveRoom', (roomId) => {
                socket.leave(roomId);
            });

            socket.on('sendMessage', (message) => {
                io.to(message.roomId).emit('message', message);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });
    }
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized! Call socketHandler first.");
    }
    return io;
};

module.exports = { socketHandler, getIo };
