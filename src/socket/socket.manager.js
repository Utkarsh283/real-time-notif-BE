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

    if (change.operationType === 'update') {
      const updatedNotification = change.fullDocument;
      io.emit('updated-notification', updatedNotification); 
      console.log('Broadcasted updated notification:', updatedNotification);
    }

    if (change.operationType === 'replace') {
      const replacedNotification = change.fullDocument;
      io.emit('replaced-notification', replacedNotification); 
      console.log('Broadcasted replaced notification:', replacedNotification);
    }

    if (change.operationType === 'delete') {
      const deletedNotification = change.documentKey;
      io.emit('deleted-notification', deletedNotification); 
      console.log('Broadcasted deleted notification:', deletedNotification);
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

