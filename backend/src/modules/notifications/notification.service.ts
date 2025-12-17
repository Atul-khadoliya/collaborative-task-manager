import * as notificationRepo from "./notification.repository";

export const notifyTaskAssigned = async (params: {
  userId: string;
  taskId: string;
  taskTitle: string;
}) => {
  const { userId, taskId, taskTitle } = params;

  return notificationRepo.createNotification({
    userId,
    taskId,
    type: "TASK_ASSIGNED",
    message: `You have been assigned to task: "${taskTitle}"`,
  });
};
