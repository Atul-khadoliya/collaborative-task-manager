import { Router } from "express";
import * as authController from "./modules/auth/auth.controller";

const router = Router();

// Auth routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

export default router;
