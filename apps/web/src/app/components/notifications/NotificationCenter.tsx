import { Bell, X, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  getAllNotifications,
  getUnreadCount,
  type Notification,
} from "../../utils/notificationService";

export function NotificationCenter() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const allNotifications = getAllNotifications();
  const unreadCount = getUnreadCount();

  const filteredNotifications = filter === "all" 
    ? allNotifications 
    : allNotifications.filter(n => n.priority === filter);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "medium":
        return <Info className="w-5 h-5 text-blue-600" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-50 border-red-200";
      case "high":
        return "bg-orange-50 border-orange-200";
      case "medium":
        return "bg-blue-50 border-blue-200";
      case "low":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    return t(`notifications.types.${type}` as const, { defaultValue: type });
  };

  const priorityStats = {
    critical: allNotifications.filter(n => n.priority === "critical").length,
    high: allNotifications.filter(n => n.priority === "high").length,
    medium: allNotifications.filter(n => n.priority === "medium").length,
    low: allNotifications.filter(n => n.priority === "low").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{t("notifications.title")}</h2>
        <p className="text-gray-600 mt-1">{t("notifications.subtitle")}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{allNotifications.length}</p>
              <p className="text-sm text-gray-600">{t("notifications.total")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.critical}</p>
              <p className="text-sm text-gray-600">{t("notifications.critical")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.high}</p>
              <p className="text-sm text-gray-600">{t("notifications.high")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.medium}</p>
              <p className="text-sm text-gray-600">{t("notifications.medium")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.low}</p>
              <p className="text-sm text-gray-600">{t("notifications.low")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">
              {t("notifications.systemActive")}
            </h3>
            <p className="text-sm text-green-800 mt-1">
              {t("notifications.systemDescription")}
            </p>
            <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
              <li>{t("notifications.advanceNotice.subsidy")}</li>
              <li>{t("notifications.advanceNotice.vaccination")}</li>
              <li>{t("notifications.advanceNotice.inspection")}</li>
              <li>{t("notifications.advanceNotice.withdrawal")}</li>
              <li>{t("notifications.advanceNotice.birth")}</li>
              <li>{t("notifications.advanceNotice.medicine")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {["all", "critical", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t(`notifications.${f}` as const)}
              {f !== "all" && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {priorityStats[f as keyof typeof priorityStats]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("notifications.allCaughtUp")}
            </h3>
            <p className="text-gray-600">
              {t("notifications.noNotificationsMessage", {
                filter:
                  filter === "all"
                    ? t("notifications.all").toLowerCase()
                    : t(`notifications.${filter}` as const).toLowerCase(),
              })}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 overflow-hidden ${getPriorityColor(
                notification.priority
              )}`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {getPriorityIcon(notification.priority)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {getTypeLabel(notification.type)}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {notification.module}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              notification.priority === "critical"
                                ? "bg-red-100 text-red-800"
                                : notification.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : notification.priority === "medium"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {notification.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-lg font-bold ${
                            notification.daysUntil <= 2
                              ? "text-red-600"
                              : notification.daysUntil <= 5
                              ? "text-orange-600"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.daysUntil < 0
                            ? notification.date
                            : notification.daysUntil === 0
                            ? t("dashboard.today")
                            : notification.daysUntil === 1
                            ? t("dashboard.tomorrow")
                            : t("dashboard.inDays", { count: notification.daysUntil })}
                        </p>
                        <p className="text-xs text-gray-600">{notification.date}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
                    {notification.actionUrl && (
                      <Link
                        to={notification.actionUrl}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {t("notifications.viewDetails")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
