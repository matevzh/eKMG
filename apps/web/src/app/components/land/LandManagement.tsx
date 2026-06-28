import { Plus, MapPin, Sprout } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function LandManagement() {
  const { t } = useTranslation();
  const [selectedView, setSelectedView] = useState<"gerk" | "fertilization" | "subsidies">("gerk");
  const [showAddGerk, setShowAddGerk] = useState(false);
  const [showAddFertilization, setShowAddFertilization] = useState(false);
  const [showAddSubsidy, setShowAddSubsidy] = useState(false);

  // Mock data for GERK units
  const gerkUnits = [
    {
      id: 1,
      gerkID: "GERK-1234",
      name: "Lower Meadow",
      area: 5.2,
      landUse: "Pasture",
      crop: "Grass",
      location: "Plot A",
    },
    {
      id: 2,
      gerkID: "GERK-1235",
      name: "Upper Field",
      area: 8.5,
      landUse: "Arable",
      crop: "Corn",
      location: "Plot B",
    },
    {
      id: 3,
      gerkID: "GERK-1236",
      name: "East Pasture",
      area: 6.3,
      landUse: "Pasture",
      crop: "Grass",
      location: "Plot C",
    },
  ];

  // Mock data for fertilization
  const fertilizations = [
    {
      id: 1,
      gerkID: "GERK-1234",
      name: "Lower Meadow",
      date: "2026-02-15",
      type: "Organic",
      product: "Cattle Manure",
      quantity: 15000,
      unit: "kg",
    },
    {
      id: 2,
      gerkID: "GERK-1235",
      name: "Upper Field",
      date: "2026-02-10",
      type: "Mineral",
      product: "NPK 15-15-15",
      quantity: 500,
      unit: "kg",
    },
  ];

  // Mock data for subsidies
  const subsidies = [
    {
      id: 1,
      year: 2026,
      scheme: "Direct Payments",
      gerkIDs: ["GERK-1234", "GERK-1235", "GERK-1236"],
      totalArea: 20.0,
      amount: 8500,
      status: "Submitted",
      submittedDate: "2026-02-01",
    },
    {
      id: 2,
      year: 2026,
      scheme: "Agri-Environment",
      gerkIDs: ["GERK-1234", "GERK-1236"],
      totalArea: 11.5,
      amount: 3450,
      status: "Approved",
      submittedDate: "2026-01-15",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t("land.title")}</h2>
          <p className="text-gray-600 mt-1">{t("land.subtitle")}</p>
        </div>
      </div>

      {/* View Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedView("gerk")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "gerk"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("land.addUnit")}
          </button>
          <button
            onClick={() => setSelectedView("fertilization")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "fertilization"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("notifications.types.fertilization")}
          </button>
          <button
            onClick={() => setSelectedView("subsidies")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "subsidies"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {t("land.subsidyClaims")}
          </button>
        </div>
      </div>

      {/* GERK Units View */}
      {selectedView === "gerk" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddGerk(!showAddGerk)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add GERK Unit
            </button>
          </div>

          {showAddGerk && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New GERK Unit</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddGerk(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GERK ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GERK-1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lower Meadow"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (ha) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="e.g. 5.2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Use *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Pasture">Pasture</option>
                      <option value="Arable">Arable</option>
                      <option value="Meadow">Meadow</option>
                      <option value="Forest">Forest</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Crop</label>
                    <input
                      type="text"
                      placeholder="e.g. Grass, Corn"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Plot A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Unit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddGerk(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gerkUnits.map((unit) => (
              <div key={unit.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{unit.name}</h3>
                    <p className="text-sm text-gray-600">{unit.gerkID}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Area:</span>
                    <span className="text-gray-900 font-medium">{unit.area} ha</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Land Use:</span>
                    <span className="text-gray-900">{unit.landUse}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Crop:</span>
                    <span className="text-gray-900">{unit.crop}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{unit.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Fertilization View */}
      {selectedView === "fertilization" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddFertilization(!showAddFertilization)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Record Fertilization
            </button>
          </div>

          {showAddFertilization && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Fertilization Record</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddFertilization(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GERK ID *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select GERK unit...</option>
                      {gerkUnits.map((unit) => (
                        <option key={unit.id} value={unit.gerkID}>
                          {unit.gerkID} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Organic">Organic</option>
                      <option value="Mineral">Mineral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cattle Manure"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 15000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                      <option value="m³">m³</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Record
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFertilization(false)}
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
                      GERK Unit
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fertilizations.map((record) => (
                    <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{record.name}</div>
                          <div className="text-gray-600">{record.gerkID}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.type === "Organic"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">{record.product}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {record.quantity} {record.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Subsidies View */}
      {selectedView === "subsidies" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSubsidy(!showAddSubsidy)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Subsidy Claim
            </button>
          </div>

          {showAddSubsidy && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Subsidy Claim</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddSubsidy(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                    <input
                      type="number"
                      required
                      defaultValue={2026}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scheme *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Direct Payments">Direct Payments</option>
                      <option value="Agri-Environment">Agri-Environment</option>
                      <option value="Organic Farming">Organic Farming</option>
                      <option value="Young Farmer">Young Farmer</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GERK Units (select multiple)
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                      {gerkUnits.map((unit) => (
                        <label key={unit.id} className="flex items-center gap-2 mb-2">
                          <input
                            type="checkbox"
                            value={unit.gerkID}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-900">
                            {unit.gerkID} - {unit.name} ({unit.area} ha)
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Amount (€)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 8500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubsidy(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            {subsidies.map((subsidy) => (
              <div key={subsidy.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Sprout className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{subsidy.scheme}</h3>
                      <p className="text-sm text-gray-600">Year {subsidy.year}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      subsidy.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : subsidy.status === "Submitted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subsidy.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">GERK Units</p>
                    <p className="font-medium text-gray-900">{subsidy.gerkIDs.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Area</p>
                    <p className="font-medium text-gray-900">{subsidy.totalArea} ha</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium text-gray-900">€{subsidy.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-medium text-gray-900">{subsidy.submittedDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
