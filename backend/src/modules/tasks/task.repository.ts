import {TaskPriority, TaskStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";



export const createTask = async (data: {
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: string;
  assignedToId: string;
}) => {
  return prisma.task.create({
    data,
  });
};

export const getTasksForUser = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assignedToId: userId },
      ],
    },
    orderBy: {
      dueDate: "asc",
    },
  });
};

export const updateTask = async (
  taskId: string,
  data: Partial<{
    title: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    status: TaskStatus;
    assignedToId: string;
  }>
) => {
  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

export const deleteTask = async (taskId: string) => {
  return prisma.task.delete({
    where: { id: taskId },
  });
};

export const getTasksWithFilters = async (params: {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}) => {
  const { userId, status, priority } = params;

  return prisma.task.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assignedToId: userId },
      ],
      ...(status && { status }),
      ...(priority && { priority }),
    },
    orderBy: {
      dueDate: "asc",
    },
  });
};
export const getTaskById = (taskId: string) => {
  return prisma.task.findUnique({ where: { id: taskId } });
};
