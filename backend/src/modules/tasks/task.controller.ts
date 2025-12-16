import { Request, Response } from "express";
import * as taskService from "./task.service";

export const createTask = async (req: Request, res: Response) => {
  try {
    // NOTE: creatorId will come from auth middleware later
    const creatorId = req.headers["x-user-id"] as string;

    const task = await taskService.createTask(req.body, creatorId);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    const tasks = await taskService.getMyTasks(userId);
    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await taskService.updateTask(taskId, req.body);
    res.status(200).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    await taskService.deleteTask(taskId);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
