import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

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
