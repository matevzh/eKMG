import { AlertCircle, Home, Heart, Droplet, Bell } from "lucide-react";
import { Link } from "react-router";
import { getUrgentNotifications, getNotificationCount } from "../utils/notificationService";

export function Dashboard() {
  // Get real notifications from service
  const urgentNotifications = getUrgentNotifications();
  const totalNotificationCount = getNotificationCount();

  const stats = [
    {
      label: "Skupno število živali",
      value: "0",
      icon: Home,
      color: "bg-blue-500",
    },
    {
      label: "Aktivna zdravila",
      value: "0",
      icon: Heart,
      color: "bg-red-500",
    },
    {
      label: "Današnje mleko",
      value: "0",
      icon: Droplet,
      color: "bg-cyan-500",
    },
    {
      label: "Obvestila",
      value: totalNotificationCount.toString(),
      icon: AlertCircle,
      color: "bg-yellow-500",
    },
  ];

  const recentAnimals: { id: string; name: string; type: string; status: string; lastCheck: string }[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Nadzorna plošča</h2>
        <p className="text-gray-600 mt-1">Pregled stanja in aktivnosti na vašem storitvu</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Urgentna obvestila
          </h3>
          <Link to="/notifications" className="text-sm text-green-600 hover:text-green-700">
            Pregled vseh
          </Link>
        </div>
        {urgentNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">Ni nobenih obvestil</p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentNotifications.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  alert.priority === "critical"
                    ? "bg-red-50 border-red-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.priority === "critical" ? "text-red-500" : "text-orange-600"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {alert.daysUntil < 0
                      ? alert.date
                      : alert.daysUntil === 0
                      ? "Danes"
                      : alert.daysUntil === 1
                      ? "Jutri"
                      : `Za ${alert.daysUntil} dni`}
                    {" • "}
                    {alert.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Animals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Nedavne živali</h3>
          <Link to="/animals" className="text-sm text-green-600 hover:text-green-700">
            Pregled vseh →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ime</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tip</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Zadnji pregled
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAnimals.map((animal) => (
                <tr key={animal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    <Link
                      to={`/animals/${animal.id}`}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {animal.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{animal.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{animal.type}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        animal.status === "Healthy"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {animal.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">{animal.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}