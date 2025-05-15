const Task = require("../../../models/apps/tasks/task.model.js");

exports.createTask = async (req, res) => {
    const { title, description } = req.body;

    try {
        const task = await Task.create({ title, description, user: req.user._id });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to create task", error: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch task", error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Failed to update task", error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (!task.user.equals(req.user._id)) return res.status(403).json({ message: "Unauthorized to delete task" });
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        if (error.name === "CastError") return res.status(400).json({ message: "Invalid task id" });
        console.error("Error deleting task", error);
        res.status(500).json({ message: "Failed to delete task", error: error.message });
    }
};
