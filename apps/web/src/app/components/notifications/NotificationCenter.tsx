import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { getAllNotifications } from "../../utils/notificationService";

const TYPE_LABELS: Record<string, string> = {
  withdrawal: "Karenca",
  deadline: "Rok",
  health: "Zdravje",
  vaccination: "Cepljenje",
  subsidy: "Subvencija",
  fertilization: "Gnojenje",
  inspection: "Inšpekcija",
  medicine: "Zdravilo",
  birth: "Porod",
};

const FILTER_LABELS: Record<string, string> = {
  all: "Vse",
  critical: "Kritično",
  high: "Visoko",
  medium: "Srednje",
  low: "Nizko",
};

export function NotificationCenter() {
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all");
  const allNotifications = getAllNotifications();

  const filteredNotifications =
    filter === "all" ? allNotifications : allNotifications.filter((n) => n.priority === filter);

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

  const priorityStats = {
    critical: allNotifications.filter((n) => n.priority === "critical").length,
    high: allNotifications.filter((n) => n.priority === "high").length,
    medium: allNotifications.filter((n) => n.priority === "medium").length,
    low: allNotifications.filter((n) => n.priority === "low").length,
  };

  const daysLabel = (daysUntil: number, date: string) => {
    if (daysUntil < 0) return date;
    if (daysUntil === 0) return "Danes";
    if (daysUntil === 1) return "Jutri";
    return `Čez ${daysUntil} dni`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Obvestila</h2>
        <p className="text-gray-600 mt-1">
          Bodite obveščeni o prihajajočih rokih in pomembnih dogodkih
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-purple-200">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{allNotifications.length}</p>
              <p className="text-sm text-gray-600">Skupaj</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.critical}</p>
              <p className="text-sm text-gray-600">Kritično</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-orange-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.high}</p>
              <p className="text-sm text-gray-600">Visoko</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-blue-200">
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.medium}</p>
              <p className="text-sm text-gray-600">Srednje</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 border-2 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{priorityStats.low}</p>
              <p className="text-sm text-gray-600">Nizko</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">Sistem pametnih obvestil aktiven</h3>
            <p className="text-sm text-green-800 mt-1">
              Vsi roki in pomembni dogodki so nenehno nadzorovani. Prejeli boste obvestila:
            </p>
            <ul className="text-sm text-green-800 mt-2 space-y-1 list-disc list-inside">
              <li>Roki za subvencije: 30 dni (1 mesec) vnaprej</li>
              <li>Cepljenja: 14 dni (2 tedna) vnaprej</li>
              <li>Inšpekcije in poročila: 14 dni (2 tedna) vnaprej</li>
              <li>Karenca: 10 dni vnaprej</li>
              <li>Pričakovani porodi: 14 dni (2 tedna) vnaprej</li>
              <li>Rok uporabe zdravil: 30 dni vnaprej</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "critical", "high", "medium", "low"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {FILTER_LABELS[f]}
              {f !== "all" && (
                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                  {priorityStats[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Vse opravljeno!</h3>
            <p className="text-gray-600">
              Trenutno ni {FILTER_LABELS[filter].toLowerCase()} obvestil.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 overflow-hidden ${getPriorityColor(
                notification.priority,
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
                            {TYPE_LABELS[notification.type] ?? notification.type}
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
                          {daysLabel(notification.daysUntil, notification.date)}
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
                        Prikaži podrobnosti →
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
