import type { Notification } from "../types/Notification";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ||
  "http://localhost:5000/api";

// =====================================================
// COMMON API REQUEST
// =====================================================

const apiRequest = async <T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    }
  );

  let data: any = {};

  const contentType =
    response.headers.get("content-type");

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data as T;
};

// =====================================================
// GET MY NOTIFICATIONS
// =====================================================

export const getMyNotifications = async (
  token: string
): Promise<Notification[]> => {
  const data = await apiRequest<{
    success: boolean;
    count: number;
    notifications: Notification[];
  }>(
    "/notifications",
    token,
    {
      method: "GET",
    }
  );

  return data.notifications || [];
};

// =====================================================
// GET UNREAD COUNT
// =====================================================

export const getUnreadNotificationCount = async (
  token: string
): Promise<number> => {
  const data = await apiRequest<{
    success: boolean;
    count: number;
  }>(
    "/notifications/unread-count",
    token,
    {
      method: "GET",
    }
  );

  return data.count || 0;
};

// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================

export const markNotificationAsRead = async (
  token: string,
  notificationId: string
): Promise<Notification> => {
  const data = await apiRequest<{
    success: boolean;
    notification: Notification;
  }>(
    `/notifications/${notificationId}/read`,
    token,
    {
      method: "PATCH",
    }
  );

  return data.notification;
};

// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================

export const markAllNotificationsAsRead = async (
  token: string
): Promise<void> => {
  await apiRequest<{
    success: boolean;
    message: string;
  }>(
    "/notifications/read-all",
    token,
    {
      method: "PATCH",
    }
  );
};