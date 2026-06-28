import { Plus, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function MilkManagement() {
  const { t } = useTranslation();
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [selectedView, setSelectedView] = useState<"sessions" | "deliveries" | "analytics">(
    "sessions"
  );

  // Mock data for milk sessions
  const milkSessions = [
    {
      id: 1,
      date: "2026-02-28",
      time: "Morning",
      animalID: "A1234",
      animalName: "Bella",
      quantity: 28,
    },
    {
      id: 2,
      date: "2026-02-28",
      time: "Evening",
      animalID: "A1234",
      animalName: "Bella",
      quantity: 26,
    },
    {
      id: 3,
      date: "2026-02-28",
      time: "Morning",
      animalID: "A1235",
      animalName: "Daisy",
      quantity: 25,
    },
    {
      id: 4,
      date: "2026-02-28",
      time: "Evening",
      animalID: "A1235",
      animalName: "Daisy",
      quantity: 24,
    },
  ];

  // Mock data for deliveries
  const deliveries = [
    {
      id: 1,
      date: "2026-02-27",
      quantity: 850,
      processor: "Alpine Dairy Co.",
      status: "Delivered",
      price: 0.42,
    },
    {
      id: 2,
      date: "2026-02-25",
      quantity: 845,
      processor: "Alpine Dairy Co.",
      status: "Delivered",
      price: 0.42,
    },
    {
      id: 3,
      date: "2026-02-23",
      quantity: 860,
      processor: "Alpine Dairy Co.",
      status: "Delivered",
      price: 0.42,
    },
  ];

  // Mock data for analytics
  const weeklyData = [
    { day: "Mon", morning: 420, evening: 410 },
    { day: "Tue", morning: 430, evening: 415 },
    { day: "Wed", morning: 425, evening: 420 },
    { day: "Thu", morning: 435, evening: 425 },
    { day: "Fri", morning: 440, evening: 430 },
    { day: "Sat", morning: 425, evening: 420 },
    { day: "Sun", morning: 420, evening: 415 },
  ];

  const monthlyTrend = [
    { month: "Sep", total: 25200 },
    { month: "Oct", total: 25800 },
    { month: "Nov", total: 24900 },
    { month: "Dec", total: 25500 },
    { month: "Jan", total: 26100 },
    { month: "Feb", total: 23800 },
  ];

  const [sessionForm, setSessionForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "Morning",
    animalID: "",
    quantity: "",
  });

  const [deliveryForm, setDeliveryForm] = useState({
    date: new Date().toISOString().split("T")[0],
    quantity: "",
    processor: "",
    price: "",
  });

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding milk session:", sessionForm);
    setShowAddSession(false);
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding delivery:", deliveryForm);
    setShowAddDelivery(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t("milk.title")}</h2>
          <p className="text-gray-600 mt-1">{t("milk.subtitle")}</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView("sessions")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "sessions"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("milk.production")}
          </button>
          <button
            onClick={() => setSelectedView("deliveries")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "deliveries"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("milk.deliveries")}
          </button>
          <button
            onClick={() => setSelectedView("analytics")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "analytics"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("reports.milkProduction")}
          </button>
        </div>
      </div>

      {/* Milk Sessions View */}
      {selectedView === "sessions" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSession(!showAddSession)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t("milk.addRecord")}
            </button>
          </div>

          {showAddSession && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("milk.addRecord")}
              </h3>
              <form onSubmit={handleSessionSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("milk.date")} *
                    </label>
                    <input
                      type="date"
                      required
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("milk.time", { defaultValue: "Time" })}
                    </label>
                    <select
                      required
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Morning">{t("milk.morning")}</option>
                      <option value="Evening">{t("milk.evening")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animal ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.animalID}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, animalID: e.target.value })
                      }
                      placeholder="e.g. A1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (L) *
                    </label>
                    <input
                      type="number"
                      required
                      value={sessionForm.quantity}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, quantity: e.target.value })
                      }
                      placeholder="e.g. 28"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSession(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Animal
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Quantity (L)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {milkSessions.map((session) => (
                    <tr key={session.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{session.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{session.time}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{session.animalName}</div>
                          <div className="text-gray-600">{session.animalID}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {session.quantity} L
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Deliveries View */}
      {selectedView === "deliveries" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddDelivery(!showAddDelivery)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Record Delivery
            </button>
          </div>

          {showAddDelivery && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Delivery</h3>
              <form onSubmit={handleDeliverySubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      value={deliveryForm.date}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity (L) *
                    </label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.quantity}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, quantity: e.target.value })
                      }
                      placeholder="e.g. 850"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processor *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.processor}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, processor: e.target.value })
                      }
                      placeholder="e.g. Alpine Dairy Co."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per L (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={deliveryForm.price}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, price: e.target.value })}
                      placeholder="e.g. 0.42"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDelivery(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Quantity (L)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Processor
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Price/L
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{delivery.date}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {delivery.quantity} L
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{delivery.processor}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">€{delivery.price}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        €{(delivery.quantity * delivery.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Analytics View */}
      {selectedView === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weekly Production</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="morning" fill="#10b981" name="Morning (L)" />
                <Bar dataKey="evening" fill="#059669" name="Evening (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">5,970 L</p>
              <p className="text-sm text-green-600 mt-1">+2.5% vs last week</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">23,800 L</p>
              <p className="text-sm text-red-600 mt-1">-8.8% vs last month</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">Avg per Cow/Day</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">27 L</p>
              <p className="text-sm text-gray-600 mt-1">Based on 124 animals</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
