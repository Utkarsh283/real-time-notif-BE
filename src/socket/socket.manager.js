const { Server } = require('socket.io');
const Notification = require('../models/apps/notifications/notifications.models.js');
const Task = require('../models/apps/tasks/task.model.js');
const User = require('../models/apps/auth/user.models.js');

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  // Client connection handler
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    emitClientCount();

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      emitClientCount();
    });
  });

  // MongoDB Change Stream for new notifications
  const changeStream = Notification.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newNotification = change.fullDocument;
      const { users } = newNotification;

      // Emit only to the users mentioned in the notification
      users.forEach((user) => {
        const userId = user.toString();
        io.to(userId).emit('new-notification', newNotification);
        console.log(`Broadcasted new notification to user: ${userId}`);
      });
    }
  });
};

// Optional: You can still use this if you want to broadcast general data
const broadcastNotification = (data) => {
  if (io) {
    // Uncomment only if you want to broadcast to all (not per-user):
    // io.emit('notification', data);
  }
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

module.exports = { setupSocket, broadcastNotification, broadcastTask, broadcastUserEvent };
