const { User } = require("../../../models/apps/auth/user.models.js");
const { Task } = require("../../../models/apps/tasks/task.model.js");
const { Notification } = require("../../../models/apps/notifications/notifications.models.js");
const { ApiError } = require("../../../utils/ApiError");
const { ApiResponse } = require("../../../utils/ApiResponse");
const { asyncHandler } = require("../../../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
  return res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

const getAllTasks = asyncHandler(async (req, res) => {
  if (!Task) {
    throw new ApiError(500, "Task model not defined");
  }
  const tasks = await Task.find();
  return res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched successfully"));
});

const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find();
  return res.status(200).json(new ApiResponse(200, notifications, "All notifications fetched successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});



module.exports = {
  getAllUsers,
  getAllTasks,
  getAllNotifications,
  getUserById,
};
