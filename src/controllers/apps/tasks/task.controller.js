/*************  ✨ Windsurf Command 🌟  *************/
const { asyncHandler } = require("../../../utils/asyncHandler.js");
const { Task } = require("../../../models/apps/tasks/task.model.js");
const { ApiError } = require("../../../utils/ApiError.js");
const { ApiResponse } = require("../../../utils/ApiResponse.js");

const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).populate("createdBy", "-password -refreshToken -emailVerificationToken -emailVerificationExpiry").populate("assignedTo", "-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate("createdBy", "-password -refreshToken -emailVerificationToken -emailVerificationExpiry").populate("assignedTo", "-password -refreshToken -emailVerificationToken -emailVerificationExpiry");
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task deleted successfully"));
});

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
module.exports = { getAllTasks };

/*******  d11a38a9-2760-4451-a6cb-adb970bc4090  *******/