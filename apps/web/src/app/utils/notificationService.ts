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

// Helper to calculate days until a date
const getDaysUntil = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper to determine priority based on days until event
const calculatePriority = (daysUntil: number, type: string): "critical" | "high" | "medium" | "low" => {
  // Critical: 0-2 days for critical items, overdue
  if (daysUntil < 0) return "critical";
  if (daysUntil <= 2 && (type === "withdrawal" || type === "deadline" || type === "inspection")) return "critical";
  
  // High: 3-5 days
  if (daysUntil <= 5) return "high";
  
  // Medium: 6-14 days (1-2 weeks)
  if (daysUntil <= 14) return "medium";
  
  // Low: 15+ days
  return "low";
};

// Mock data generators (in real app, these would fetch from database/state)
const getWithdrawalNotifications = (): Notification[] => {
  const withdrawals = [
    { animalId: "A1234", animalName: "Bella", medicine: "Penicillin", endDate: "2026-03-07" },
    { animalId: "A1235", animalName: "Daisy", medicine: "Meloxicam", endDate: "2026-03-04" },
    { animalId: "A1236", animalName: "Luna", medicine: "Cephalexin", endDate: "2026-03-10" },
    { animalId: "A1237", animalName: "Rosie", medicine: "Tylosin", endDate: "2026-03-15" },
  ];

  return withdrawals
    .map((w, index) => {
      const daysUntil = getDaysUntil(w.endDate);
      // Only show notifications 10 days before until it ends
      if (daysUntil > 10 || daysUntil < -1) return null;
      
      return {
        id: `withdrawal-${index}`,
        title: "Withdrawal Period Ending",
        message: `${w.animalName} (${w.animalId}) - ${w.medicine} withdrawal ends in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        type: "withdrawal" as const,
        priority: calculatePriority(daysUntil, "withdrawal"),
        date: w.endDate,
        daysUntil,
        module: "Health Records",
        actionUrl: "/health",
        animalId: w.animalId,
      };
    })
    .filter((n): n is Notification => n !== null);
};

const getVaccinationNotifications = (): Notification[] => {
  const vaccinations = [
    { animalId: "A1238", animalName: "Misty", vaccine: "Annual Vaccination", dueDate: "2026-03-08" },
    { animalId: "A1239", animalName: "Clover", vaccine: "Annual Vaccination", dueDate: "2026-03-09" },
    { animalId: "A1240", animalName: "Honey", vaccine: "Annual Vaccination", dueDate: "2026-03-12" },
    { animalId: "A1241", animalName: "Poppy", vaccine: "Booster Shot", dueDate: "2026-03-18" },
    { animalId: "A1242", animalName: "Buttercup", vaccine: "Annual Vaccination", dueDate: "2026-03-20" },
  ];

  return vaccinations
    .map((v, index) => {
      const daysUntil = getDaysUntil(v.dueDate);
      // Show notifications 14 days before (2 weeks)
      if (daysUntil > 14 || daysUntil < -1) return null;
      
      return {
        id: `vaccination-${index}`,
        title: "Vaccination Due",
        message: `${v.animalName} (${v.animalId}) - ${v.vaccine} due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        type: "vaccination" as const,
        priority: calculatePriority(daysUntil, "health"),
        date: v.dueDate,
        daysUntil,
        module: "Health Records",
        actionUrl: "/health",
        animalId: v.animalId,
      };
    })
    .filter((n): n is Notification => n !== null);
};

const getSubsidyNotifications = (): Notification[] => {
  const subsidies = [
    { name: "Direct Payments 2026", deadline: "2026-03-31", amount: "€3,450.00" },
    { name: "Greening Premium", deadline: "2026-03-31", amount: "€2,300.00" },
    { name: "ARSKTRP Land Use Report", deadline: "2026-04-15", amount: "N/A" },
  ];

  return subsidies
    .map((s, index) => {
      const daysUntil = getDaysUntil(s.deadline);
      // Show notifications 30 days before (1 month) for subsidies
      if (daysUntil > 30 || daysUntil < 0) return null;
      
      return {
        id: `subsidy-${index}`,
        title: "Subsidy Deadline Approaching",
        message: `${s.name} deadline in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} (${s.amount})`,
        type: "subsidy" as const,
        priority: calculatePriority(daysUntil, "deadline"),
        date: s.deadline,
        daysUntil,
        module: "Land & Subsidies",
        actionUrl: "/land",
      };
    })
    .filter((n): n is Notification => n !== null);
};

const getInspectionNotifications = (): Notification[] => {
  const inspections = [
    { type: "CRG Movement Report", deadline: "2026-03-05" },
    { type: "Veterinary Inspection", deadline: "2026-03-15" },
    { type: "Dairy Quality Check", deadline: "2026-03-22" },
  ];

  return inspections
    .map((i, index) => {
      const daysUntil = getDaysUntil(i.deadline);
      // Show notifications 14 days before (2 weeks)
      if (daysUntil > 14 || daysUntil < 0) return null;
      
      return {
        id: `inspection-${index}`,
        title: "Inspection/Report Due",
        message: `${i.type} due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        type: "deadline" as const,
        priority: calculatePriority(daysUntil, "deadline"),
        date: i.deadline,
        daysUntil,
        module: "Reports",
        actionUrl: "/reports",
      };
    })
    .filter((n): n is Notification => n !== null);
};

const getMedicineNotifications = (): Notification[] => {
  const medicines = [
    { name: "Ivermectin", status: "Low Stock", currentStock: 30, minStock: 40 },
    { name: "Vitamin B Complex", status: "Expiring Soon", expiryDate: "2026-03-25" },
  ];

  const notifications: Notification[] = [];

  // Low stock notifications
  medicines.forEach((m, index) => {
    if (m.status === "Low Stock") {
      notifications.push({
        id: `medicine-stock-${index}`,
        title: "Medicine Low Stock",
        message: `${m.name} is below minimum stock level (${m.currentStock}/${m.minStock} units)`,
        type: "medicine" as const,
        priority: "high",
        date: new Date().toISOString().split('T')[0],
        daysUntil: 0,
        module: "Medicine Inventory",
        actionUrl: "/medicine",
      });
    }
  });

  // Expiring medicine notifications
  medicines.forEach((m, index) => {
    if (m.status === "Expiring Soon" && m.expiryDate) {
      const daysUntil = getDaysUntil(m.expiryDate);
      if (daysUntil >= 0 && daysUntil <= 30) {
        notifications.push({
          id: `medicine-expiry-${index}`,
          title: "Medicine Expiring Soon",
          message: `${m.name} expires in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
          type: "medicine" as const,
          priority: calculatePriority(daysUntil, "medicine"),
          date: m.expiryDate,
          daysUntil,
          module: "Medicine Inventory",
          actionUrl: "/medicine",
        });
      }
    }
  });

  return notifications;
};

const getBirthNotifications = (): Notification[] => {
  const expectedBirths = [
    { animalId: "A1237", animalName: "Rosie", dueDate: "2026-03-20" },
    { animalId: "A1250", animalName: "Maple", dueDate: "2026-04-05" },
  ];

  return expectedBirths
    .map((b, index) => {
      const daysUntil = getDaysUntil(b.dueDate);
      // Show notifications 14 days before (2 weeks)
      if (daysUntil > 14 || daysUntil < -7) return null;
      
      return {
        id: `birth-${index}`,
        title: "Expected Birth",
        message: `${b.animalName} (${b.animalId}) expected to give birth in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        type: "birth" as const,
        priority: calculatePriority(daysUntil, "health"),
        date: b.dueDate,
        daysUntil,
        module: "Animals",
        actionUrl: `/animals/${b.animalId}`,
        animalId: b.animalId,
      };
    })
    .filter((n): n is Notification => n !== null);
};

const getFertilizationNotifications = (): Notification[] => {
  const fertilizations = [
    { gerkId: "GERK-1235", type: "Pasture", lastDate: "2025-10-15", nextDate: "2026-03-15" },
    { gerkId: "GERK-1238", type: "Hay Field", lastDate: "2025-11-20", nextDate: "2026-04-01" },
  ];

  return fertilizations
    .map((f, index) => {
      const daysUntil = getDaysUntil(f.nextDate);
      // Show notifications 10 days before
      if (daysUntil > 10 || daysUntil < -1) return null;
      
      return {
        id: `fertilization-${index}`,
        title: "Fertilization Due",
        message: `${f.gerkId} (${f.type}) fertilization recommended in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`,
        type: "fertilization" as const,
        priority: calculatePriority(daysUntil, "fertilization"),
        date: f.nextDate,
        daysUntil,
        module: "Land Management",
        actionUrl: "/land",
      };
    })
    .filter((n): n is Notification => n !== null);
};

// Main function to get all notifications
export const getAllNotifications = (): Notification[] => {
  const allNotifications = [
    ...getWithdrawalNotifications(),
    ...getVaccinationNotifications(),
    ...getSubsidyNotifications(),
    ...getInspectionNotifications(),
    ...getMedicineNotifications(),
    ...getBirthNotifications(),
    ...getFertilizationNotifications(),
  ];

  // Sort by priority (critical first) then by days until event
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allNotifications.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.daysUntil - b.daysUntil;
  });

  return allNotifications;
};

// Get notifications by priority
export const getNotificationsByPriority = (priority: "critical" | "high" | "medium" | "low") => {
  return getAllNotifications().filter(n => n.priority === priority);
};

// Get critical and high priority notifications for dashboard
export const getUrgentNotifications = (): Notification[] => {
  return getAllNotifications().filter(n => n.priority === "critical" || n.priority === "high");
};

// Get notification count
export const getNotificationCount = (): number => {
  return getAllNotifications().length;
};

// Get unread count (in real app, this would track which have been seen)
export const getUnreadCount = (): number => {
  return getUrgentNotifications().length;
};
