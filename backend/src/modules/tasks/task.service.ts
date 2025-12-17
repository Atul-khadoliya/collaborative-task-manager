import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import * as taskRepo from "./task.repository";

export const createTask = async (
  input: unknown,
  creatorId: string
) => {
  // 1. Validate input
  const data = CreateTaskDto.parse(input);

  // 2. Create task
  return taskRepo.createTask({
    title: data.title,
    description: data.description,
    dueDate: new Date(data.dueDate),
    priority: data.priority,
    status: data.status,
    creatorId,
    assignedToId: data.assignedToId,
  });
};



export const getMyTasks = async (userId: string) => {
  return taskRepo.getTasksForUser(userId);
};


export const updateTask = async (
  taskId: string,
  input: unknown
) => {
  const data = UpdateTaskDto.parse(input);

  const updatePayload: {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: any;
    status?: any;
    assignedToId?: string;
  } = {};

  if (data.title) updatePayload.title = data.title;
  if (data.description) updatePayload.description = data.description;
  if (data.dueDate) updatePayload.dueDate = new Date(data.dueDate);
  if (data.priority) updatePayload.priority = data.priority;
  if (data.status) updatePayload.status = data.status;
  if (data.assignedToId) updatePayload.assignedToId = data.assignedToId;

  return taskRepo.updateTask(taskId, updatePayload);
};

export const deleteTask = async (taskId: string) => {
  return taskRepo.deleteTask(taskId);
};

export const getMyTasksWithFilters = async (
  userId: string,
  filters: {
    status?: string;
    priority?: string;
  }
) => {
  return taskRepo.getTasksWithFilters({
    userId,
    status: filters.status as any,
    priority: filters.priority as any,
  });
};
