import { CreateTaskDto, UpdateTaskDto } from "./task.dto";
import * as taskRepo from "./task.repository";
import { emitToUser } from "../../server";

import * as notificationService from "../notifications/notification.service";


export const createTask = async (
  input: unknown,
  creatorId: string
) => {
  // 1. Validate input
  const data = CreateTaskDto.parse(input);

  // 2. Create task
  const task = await taskRepo.createTask({
  title: data.title,
  description: data.description,
  dueDate: new Date(data.dueDate),
  priority: data.priority,
  status: data.status,
  creatorId,
  assignedToId: data.assignedToId,
});

// 🔔 Persist notification
  await notificationService.notifyTaskAssigned({
    userId: task.assignedToId,
    taskId: task.id,
    taskTitle: task.title,
  });

// 🔔 Notify assignee on creation
emitToUser(task.assignedToId, "task:assigned", {
  taskId: task.id,
  title: task.title,
});

return task;

};



export const getMyTasks = async (userId: string) => {
  return taskRepo.getTasksForUser(userId);
};


export const updateTask = async (
  taskId: string,
  input: unknown,
  actorId: string
) => {
  const data = UpdateTaskDto.parse(input);

  const existingTask = await taskRepo.getTaskById(taskId);
  if (!existingTask) {
  throw new Error("Task not found");
}
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

 const updatedTask = await taskRepo.updateTask(taskId, updatePayload);

// 🔔 Emit real-time update
// 🔔 Decide who should be notified (actor never gets notified)
const creatorId = existingTask.creatorId;
const assigneeId = updatedTask.assignedToId;

// Helper: who is the "other" user
const notifyUserId =
  actorId === creatorId ? assigneeId : creatorId;

// ---- CASE 1: Status changed ----
if (
  data.status &&
  data.status !== existingTask.status &&
  notifyUserId !== actorId
) {
  emitToUser(notifyUserId, "task:updated", {
    taskId: updatedTask.id,
    status: updatedTask.status,
    title: updatedTask.title,
  });
}

// ---- CASE 2: Assignment changed ----
if (
  data.assignedToId &&
  data.assignedToId !== existingTask.assignedToId
) {
  await notificationService.notifyTaskAssigned({
    userId: updatedTask.assignedToId,
    taskId: updatedTask.id,
    taskTitle: updatedTask.title,
  });

  emitToUser(updatedTask.assignedToId, "task:assigned", {
    taskId: updatedTask.id,
    title: updatedTask.title,
  });
}



return updatedTask;
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
