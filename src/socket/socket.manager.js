const { Server } = require('socket.io');
const Notification = require('../models/apps/notifications/notifications.models.js');

let io;

const setupSocket = (server) => {
  if (!server) throw new Error('Server is required to setup socket.io');

  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    if (!socket) throw new Error('Socket is required for connection event');

    console.log(`Client connected: ${socket.id}`);
    emitClientCount();

    // Join user-specific room using MongoDB _id
    socket.on('join', (userId) => {
      if (!userId) {
        console.warn('User ID missing in join event');
        return;
      }
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      emitClientCount();
    });
  });

  // MongoDB Change Stream for new notifications
  const changeStream = Notification.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', (change) => {
    if (change.operationType !== 'insert') return;

    const newNotification = change.fullDocument;
    const { users } = newNotification;

    if (!users || users.length === 0) {
      console.warn('Notification has no target users');
      return;
    }

    users.forEach((userId) => {
      if (!userId) return;
      io.to(userId.toString()).emit('new-notification', newNotification);
      console.log(`📨 Notification sent to user: ${userId}`);
    });
  });
};

// Emit notification only to mentioned users
const broadcastNotification = (notification) => {
  if (!io || !notification || !notification.users) {
    console.warn('Invalid notification or socket.io not setup');
    return;
  }

  try {
    notification.users.forEach((userId) => {
      if (!userId) return;
      io?.to(userId.toString())?.emit('notification', notification);
    });
    console.log(`  Notification broadcasted to ${notification.users.length} users`);
  } catch (error) {
    console.error('Error broadcasting notification:', error);
  }
};

// Optional global task broadcast
const broadcastTask = (data) => {
  if (!io) {
    console.warn('Socket.io is not initialized');
    return;
  }

  io.emit('task', data);
};

// Emit custom user events
const broadcastUserEvent = (event, data) => {
  if (!io) {
    console.warn('Socket.io is not initialized');
    return;
  }

  io.emit(event, data);
};

// Emit number of connected clients
const emitClientCount = () => {
  if (!io) return;

  const clientCount = io.engine.clientsCount;
  io.emit('clientCount', clientCount);
};

module.exports = {
  setupSocket,
  broadcastNotification,
  broadcastTask,
  broadcastUserEvent,
};
