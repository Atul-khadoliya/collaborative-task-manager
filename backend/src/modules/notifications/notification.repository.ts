import { PrismaClient, NotificationType } from "@prisma/client";

const prisma = new PrismaClient();

export const createNotification = async (data: {
  userId: string;
  taskId: string;
  type: NotificationType;
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
