import { Router } from "express";
import * as authController from "./modules/auth/auth.controller";
import * as taskController from "./modules/tasks/task.controller";
import { authenticate } from "./middleware/auth.middleware";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Task routes
router.post("/tasks", authenticate, taskController.createTask);
router.get("/tasks", authenticate, taskController.getMyTasks);
router.put("/tasks/:taskId", authenticate, taskController.updateTask);
router.delete("/tasks/:taskId", authenticate, taskController.deleteTask);

export default router;

