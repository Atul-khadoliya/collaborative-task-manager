import { Router } from "express";
import * as authController from "./modules/auth/auth.controller";
import * as taskController from "./modules/tasks/task.controller";
import { authenticate } from "./middleware/auth.middleware";
import * as notificationController from "./modules/notifications/notification.controller";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Task routes
router.post("/tasks", authenticate, taskController.createTask);
router.get("/tasks", authenticate, taskController.getMyTasks);
router.put("/tasks/:taskId", authenticate, taskController.updateTask);
router.delete("/tasks/:taskId", authenticate, taskController.deleteTask);

// Notification routes (protected)
router.get(
  "/notifications",
  authenticate,
  notificationController.getMyNotifications
);

router.patch(
  "/notifications/:notificationId/read",
  authenticate,
  notificationController.markAsRead
);

export default router;

