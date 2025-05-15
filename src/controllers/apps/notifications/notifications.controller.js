const Notification = require('../../../models/apps/notifications/notifications.models.js');
const { broadcastNotification } = require('../../../socket/socket.manager.js');
const { validatePayload } = require('../../../utils/validatePayload.js');

exports.postNotification = async function (req, res) {
  const { title, message, type } = req.body;

  const error = validatePayload(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const notification = new Notification({ title, message, type });
    const savedNotification = await notification.save();

    broadcastNotification(savedNotification);

    res.status(201).json({ success: true, notification: savedNotification });
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving notification.' });
  }
};

exports.getHistory = async function (req, res) {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching history.' });
  }
};

exports.totalNotifications = async function (req, res) {
  try {
    const total = await Notification.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching total notifications.' });
  }
};

