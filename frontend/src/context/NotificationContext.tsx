import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "./notification.api";
import { queryClient } from "../lib/queryClient";

export interface Notification {
  id?: string;
  type: "TASK_ASSIGNED" | "TASK_UPDATED";
  taskId: string;
  title: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter(
      (n) => !n.read && n.id
    );

    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

    // Persist to backend
    await Promise.all(
      unread.map((n) => markNotificationAsRead(n.id!))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // 1️⃣ Load persisted notifications
    fetchNotifications()
      .then((data) => {
        setNotifications(data);
      })
      .catch((err) => {
        console.error("Failed to load notifications", err);
      });

    // 2️⃣ Socket listeners
    const socket = getSocket();
    if (!socket) return;

    const onTaskAssigned = (payload: any) => {
      // 🔔 Notification
      addNotification({
        type: "TASK_ASSIGNED",
        taskId: payload.taskId,
        title: payload.title,
        read: false,
        createdAt: new Date(),
      });

      // 🔄 Live task update
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    };

    const onTaskUpdated = (payload: any) => {
      // 🔔 Notification
      addNotification({
        type: "TASK_UPDATED",
        taskId: payload.taskId,
        title: payload.title,
        read: false,
        createdAt: new Date(),
      });

      // 🔄 Live task update
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    };

    socket.on("task:assigned", onTaskAssigned);
    socket.on("task:updated", onTaskUpdated);

    return () => {
      socket.off("task:assigned", onTaskAssigned);
      socket.off("task:updated", onTaskUpdated);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }
  return ctx;
};
