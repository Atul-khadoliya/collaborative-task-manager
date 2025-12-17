import { Request, Response } from "express";
import * as notificationRepo from "./notification.repository";

export const getMyNotifications = async (req: Request, res: Response) => {
  const userId = (req as any).userId as string;

  const notifications = await notificationRepo.getUnreadNotifications(userId);

  return res.json(notifications);
};

export const markAsRead = async (req: Request, res: Response) => {
  const { notificationId } = req.params;

  await notificationRepo.markNotificationAsRead(notificationId);

  return res.status(204).send();
};
