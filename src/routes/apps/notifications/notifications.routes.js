const express = require('express');
const { postNotification, totalNotifications, getHistory } = require('../../../controllers/apps/notifications/notifications.controller.js');

const notificationRouter = express.Router();
notificationRouter.post('/', postNotification);
notificationRouter.get('/', totalNotifications);
notificationRouter.get('/', getHistory);


module.exports = notificationRouter;

