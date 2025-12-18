import { Request, Response } from "express";
import * as taskService from "./task.service";

export const createTask = async (req: Request, res: Response) => {
  try {
    // NOTE: creatorId will come from auth middleware later
    const userId = (req as any).userId as string;


    const task = await taskService.createTask(req.body, userId);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;


    const status =
      typeof req.query.status === "string"
        ? req.query.status.trim()
        : undefined;

    const priority =
      typeof req.query.priority === "string"
        ? req.query.priority.trim()
        : undefined;

    const tasks = await taskService.getMyTasksWithFilters(userId, {
      status: status || undefined,
      priority: priority || undefined,
    });

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const updateTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const userId = (req as any).userId ;
    const task = await taskService.updateTask(taskId, req.body,userId);
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
