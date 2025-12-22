import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "./notification.api";
import { queryClient } from "../lib/queryClient";

export interface Notification {
  id: string;
  type: "TASK_ASSIGNED" | "TASK_UPDATED";
  taskId: string;
  title: string;
  read: boolean;
  createdAt: string; // 🔥 ALWAYS string
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

  /* 🔒 Single source of truth */
  const normalize = (raw: any): Notification => ({
    id: raw.id ?? crypto.randomUUID(),
    type: raw.type,
    taskId: raw.taskId,
    title:
      raw.title ??
      raw.taskTitle ??
      raw.message ??
      "New notification",
    read: Boolean(raw.read),
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
  });

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

    // Persist
    await Promise.all(
      unread.map((n) => markNotificationAsRead(n.id))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    /* 1️⃣ Load stored notifications */
    fetchNotifications()
      .then((data) => {
        setNotifications(data.map(normalize));
      })
      .catch((err) => {
        console.error("Failed to load notifications", err);
      });

    /* 2️⃣ Socket listeners */
    const socket = getSocket();
    if (!socket) return;

    const onTaskAssigned = (payload: any) => {
      addNotification(
        normalize({
          ...payload,
          type: "TASK_ASSIGNED",
          read: false,
        })
      );

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    };

    const onTaskUpdated = (payload: any) => {
      addNotification(
        normalize({
          ...payload,
          type: "TASK_UPDATED",
          read: false,
        })
      );

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
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
