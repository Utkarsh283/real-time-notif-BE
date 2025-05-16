const { Notification } = require('../../../models/apps/notifications/notifications.models.js');
const { broadcastNotification } = require('../../../socket/socket.manager.js');
const { validatePayload } = require('../../../utils/validatePayload.js');
const { User } = require('../../../models/apps/auth/user.models.js');

exports.postNotification = async function (req, res) {
  const { title, message, type, users } = req.body;

  const error = validatePayload(req.body);
  if (error) return res.status(400).json({ error });

  try {
    const userRefs = users === 'ALL' 
      ? await User.find().select('_id') 
      : users && users.length > 0 
        ? await User.find({ username: { $in: users } }).select('_id') 
        : [];

    const notification = new Notification({ title, message, type, creator: req.user._id, users: userRefs.map(user => user._id) });
    const savedNotification = await notification.save();

    broadcastNotification(savedNotification);

    res.status(201).json({ success: true, notification: savedNotification });
  } catch (err) {
    res.status(500).json({ error: 'Server error while saving notification.' });
  }
};




exports.getHistory = async function (req, res) {
  const { role } = req.user;
  const isAdmin = role === UserRolesEnum.ADMIN;

  try {
    const query = isAdmin ? {} : { users: req.user._id };
    const notifications = await Notification.find(query);
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

