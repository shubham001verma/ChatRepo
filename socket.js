const socketIO = require('socket.io');

const cors = require('cors');
const socketHandler = (server) => {
    const io = socketIO(server, {
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
};

module.exports = socketHandler;
