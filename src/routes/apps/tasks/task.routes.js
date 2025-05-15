const express = require("express");
const { verifyJWT } = require("../../../middlewares/auth.middlewares.js");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../../../controllers/apps/tasks/task.controller.js");

const router = express.Router();

router.post("/tasks", verifyJWT, createTask);
router.get("/tasks", verifyJWT, getAllTasks);
router.get("/tasks/:id", verifyJWT, getTaskById);
router.put("/tasks/:id", verifyJWT, updateTask);
router.delete("/tasks/:id", verifyJWT, deleteTask);

module.exports = router;
