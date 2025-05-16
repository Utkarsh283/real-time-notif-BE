const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'error'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {Notification};

