const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const { ApiError } = require("../../utils/ApiError.js");

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.statics.findByUser = async (userId) => {
  const tasks = await Task.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] });
  if (!tasks) {
    throw new ApiError(404, "Tasks not found", []);
  }
  return tasks;
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
