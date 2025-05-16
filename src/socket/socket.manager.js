const { Server } = require('socket.io');
const Notification = require('../models/apps/notifications/notifications.models.js');
const Task = require('../models/apps/tasks/task.model.js');
const User = require('../models/apps/auth/user.models.js');

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

    socket.on('join', (userId) => {
      socket.join(userId);
    });
  });

  // Watch MongoDB collection for inserts using Change Streams
  const changeStream = Notification.watch([], { fullDocument: 'updateLookup' });
  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      const { creator, users } = newNotification;
      const userIds = users.map((user) => user.toString());
      users.forEach((user) => {
        if (user.toString() !== creator.toString() && !userIds.includes(creator.toString())) {
          io.to(user.toString()).emit('new-notification', newNotification); 
          console.log('Broadcasted new notification to user:', user.toString());
        }
      });
    }
  });
};

const broadcastNotification = (data) => {
  if (io) io.emit('notification', data);
};

const broadcastTask = (data) => {
  if (io) io.emit('task', data);
};

const broadcastUserEvent = (event, data) => {
  if (io) io.emit(event, data);
};




const emitClientCount = () => {
  const clientCount = io.engine.clientsCount;
  io.emit('clientCount', clientCount);
};

module.exports = { setupSocket, broadcastNotification };

