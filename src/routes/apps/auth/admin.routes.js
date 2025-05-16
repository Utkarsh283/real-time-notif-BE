const { Router } = require("express");
const { verifyJWT, verifyPermission , verifyAdmin } = require("../../../middlewares/auth.middlewares.js");

const {
  getAllUsers,
  getAllTasks,
  getAllNotifications,
  getUserById,
} = require("../../../controllers/apps/auth/admin.controllers.js");

const adminRouter = Router();

// Admin routes
adminRouter.get("/users", verifyJWT, verifyAdmin, getAllUsers);
adminRouter.get("/tasks", verifyJWT, verifyAdmin ,getAllTasks);
adminRouter.get("/notifications", verifyJWT, verifyAdmin, getAllNotifications);

module.exports = adminRouter;

