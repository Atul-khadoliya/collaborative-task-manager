import { Router } from "express";
import * as authController from "./modules/auth/auth.controller";
import * as taskController from "./modules/tasks/task.controller";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Task routes
router.post("/tasks", taskController.createTask);
router.get("/tasks", taskController.getMyTasks);
router.put("/tasks/:taskId", taskController.updateTask);
router.delete("/tasks/:taskId", taskController.deleteTask);

export default router;

