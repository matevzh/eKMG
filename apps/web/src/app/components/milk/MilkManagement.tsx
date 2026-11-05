import { Plus, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
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
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [selectedView, setSelectedView] = useState<"sessions" | "deliveries" | "analytics">(
    "sessions",
  );

  const milkSessions: {
    id: number;
    date: string;
    time: string;
    animalID: string;
    animalName: string;
    quantity: number;
  }[] = [];

  const deliveries: {
    id: number;
    date: string;
    quantity: number;
    processor: string;
    status: string;
    price: number;
  }[] = [];

  const weeklyData: { day: string; morning: number; evening: number }[] = [];

  const monthlyTrend: { month: string; total: number }[] = [];

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
          <h2 className="text-2xl font-semibold text-gray-900">Upravljanje mleka</h2>
          <p className="text-gray-600 mt-1">Sledite dnevni proizvodnji in kakovosti mleka</p>
        </div>
      </div>

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
            Proizvodnja
          </button>
          <button
            onClick={() => setSelectedView("deliveries")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "deliveries"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Dostave
          </button>
          <button
            onClick={() => setSelectedView("analytics")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "analytics"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Poročilo o proizvodnji mleka
          </button>
        </div>
      </div>

      {selectedView === "sessions" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSession(!showAddSession)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Dodaj zapis mleka
            </button>
          </div>

          {showAddSession && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj zapis mleka</h3>
              <form onSubmit={handleSessionSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
                    <input
                      type="date"
                      required
                      value={sessionForm.date}
                      onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Čas</label>
                    <select
                      required
                      value={sessionForm.time}
                      onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Morning">Jutro</option>
                      <option value="Evening">Večer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID živali *
                    </label>
                    <input
                      type="text"
                      required
                      value={sessionForm.animalID}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, animalID: e.target.value })
                      }
                      placeholder="npr. A1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Količina (L) *
                    </label>
                    <input
                      type="number"
                      required
                      value={sessionForm.quantity}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, quantity: e.target.value })
                      }
                      placeholder="npr. 28"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Shrani
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSession(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Prekliči
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Datum</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Čas</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Žival</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Količina (L)
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

      {selectedView === "deliveries" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddDelivery(!showAddDelivery)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Zabeleži dostavo
            </button>
          </div>

          {showAddDelivery && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova dostava</h3>
              <form onSubmit={handleDeliverySubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
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
                      Količina (L) *
                    </label>
                    <input
                      type="number"
                      required
                      value={deliveryForm.quantity}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, quantity: e.target.value })
                      }
                      placeholder="npr. 850"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mlekarna *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryForm.processor}
                      onChange={(e) =>
                        setDeliveryForm({ ...deliveryForm, processor: e.target.value })
                      }
                      placeholder="npr. Mlekarna Celeia"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cena na L (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={deliveryForm.price}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, price: e.target.value })}
                      placeholder="npr. 0.42"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Shrani
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDelivery(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Prekliči
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Datum</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Količina (L)
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Mlekarna
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Cena/L
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Skupaj</th>
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

      {selectedView === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Tedenska proizvodnja</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="morning" fill="#10b981" name="Jutro (L)" />
                <Bar dataKey="evening" fill="#059669" name="Večer (L)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Mesečni trend</h3>
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
                  name="Skupaj (L)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">Ta teden</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">5.970 L</p>
              <p className="text-sm text-green-600 mt-1">+2,5 % glede na prejšnji teden</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">Ta mesec</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">23.800 L</p>
              <p className="text-sm text-red-600 mt-1">−8,8 % glede na prejšnji mesec</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-sm text-gray-600">Povprečje na kravo/dan</p>
              <p className="text-3xl font-semibold text-gray-900 mt-2">27 L</p>
              <p className="text-sm text-gray-600 mt-1">Na podlagi 124 živali</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
