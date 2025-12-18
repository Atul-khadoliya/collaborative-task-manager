import { prisma } from "../../lib/prisma";


export const createNotification = async (data: {
  userId: string;
  taskId: string;
  type: "TASK_ASSIGNED";
  message: string;
}) => {
  return prisma.notification.create({
    data,
  });
};

export const getUnreadNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      userId,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};
