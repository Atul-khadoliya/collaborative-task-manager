const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchNotifications = async () => {
  const res = await fetch(`${API_URL}/notifications`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
};

export const markNotificationAsRead = async (
  notificationId: string
) => {
  const res = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PATCH",
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }
};
