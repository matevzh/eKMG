// Notification Service - Calculates and manages all farm notifications

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "withdrawal" | "deadline" | "health" | "vaccination" | "subsidy" | "fertilization" | "inspection" | "medicine" | "birth";
  priority: "critical" | "high" | "medium" | "low";
  date: string; // The date of the actual event
  daysUntil: number;
  module: string; // Which module this notification is from
  actionUrl?: string; // Link to relevant page
  animalId?: string;
}

export const getAllNotifications = (): Notification[] => {
  return [];
};

export const getNotificationsByPriority = (priority: "critical" | "high" | "medium" | "low") => {
  return getAllNotifications().filter((n) => n.priority === priority);
};

export const getUrgentNotifications = (): Notification[] => {
  return getAllNotifications().filter((n) => n.priority === "critical" || n.priority === "high");
};

export const getNotificationCount = (): number => {
  return getAllNotifications().length;
};

export const getUnreadCount = (): number => {
  return getUrgentNotifications().length;
};
