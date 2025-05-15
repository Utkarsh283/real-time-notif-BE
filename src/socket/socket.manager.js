const { Server } = require('socket.io');
const Notification = require('../models/apps/notifications/notifications.models.js');

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    emitClientCount();

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      emitClientCount();
    });
  });

  // Watch MongoDB collection for inserts using Change Streams
  const changeStream = Notification.watch([], { fullDocument: 'updateLookup' });
  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      io.emit('new-notification', newNotification); 
      console.log('Broadcasted new notification:', newNotification);
    }
  });
};

const broadcastNotification = (data) => {
  if (io) io.emit('notification', data);
};

const emitClientCount = () => {
  const clientCount = io.engine.clientsCount;
  io.emit('clientCount', clientCount);
};

module.exports = { setupSocket, broadcastNotification };

