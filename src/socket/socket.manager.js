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

  const taskChangeStream = Task.watch([], { fullDocument: 'updateLookup' });
  taskChangeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newTask = change.fullDocument;
      io.emit('new-task', newTask); 
      console.log('Broadcasted new task:', newTask);
    }

    if (change.operationType === 'update') {
      const updatedTask = change.fullDocument;
      io.emit('updated-task', updatedTask); 
      console.log('Broadcasted updated task:', updatedTask);
    }

    if (change.operationType === 'replace') {
      const replacedTask = change.fullDocument;
      io.emit('replaced-task', replacedTask); 
      console.log('Broadcasted replaced task:', replacedTask);
    }

    if (change.operationType === 'delete') {
      const deletedTask = change.documentKey;
      io.emit('deleted-task', deletedTask); 
      console.log('Broadcasted deleted task:', deletedTask);
    }
  });

  User.collection.watch([], { fullDocument: 'updateLookup' })
    .on('change', (change) => {
      if (change.operationType === 'insert') {
        const newUser = change.fullDocument;
        io.emit('new-user', newUser); 
        console.log('Broadcasted new user:', newUser);
      }

      if (change.operationType === 'update') {
        const updatedUser = change.fullDocument;
        io.emit('updated-user', updatedUser); 
        console.log('Broadcasted updated user:', updatedUser);
      }

      if (change.operationType === 'replace') {
        const replacedUser = change.fullDocument;
        io.emit('replaced-user', replacedUser); 
        console.log('Broadcasted replaced user:', replacedUser);
      }

      if (change.operationType === 'delete') {
        const deletedUser = change.documentKey;
        io.emit('deleted-user', deletedUser); 
        console.log('Broadcasted deleted user:', deletedUser);
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

