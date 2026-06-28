import { Plus, Package, AlertCircle, FileDown } from "lucide-react";
import { useState } from "react";

export function MedicineInventory() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Mock data
  const medicines = [
    {
      id: 1,
      name: "Penicillin G",
      type: "Antibiotic",
      quantity: 15,
      unit: "vials (10ml)",
      lowStockThreshold: 5,
      expiryDate: "2026-08-15",
      withdrawalPeriod: 7,
      location: "Cabinet A",
    },
    {
      id: 2,
      name: "Meloxicam",
      type: "Anti-inflammatory",
      quantity: 8,
      unit: "bottles (100ml)",
      lowStockThreshold: 3,
      expiryDate: "2026-10-20",
      withdrawalPeriod: 5,
      location: "Cabinet A",
    },
    {
      id: 3,
      name: "Ivermectin",
      type: "Antiparasitic",
      quantity: 2,
      unit: "bottles (50ml)",
      lowStockThreshold: 5,
      expiryDate: "2026-06-30",
      withdrawalPeriod: 21,
      location: "Cabinet B",
    },
    {
      id: 4,
      name: "Calcium Gluconate",
      type: "Supplement",
      quantity: 20,
      unit: "bottles (500ml)",
      lowStockThreshold: 10,
      expiryDate: "2027-01-10",
      withdrawalPeriod: 0,
      location: "Cabinet C",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    unit: "",
    lowStockThreshold: "",
    expiryDate: "",
    withdrawalPeriod: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding medicine:", formData);
    setShowAddForm(false);
    setFormData({
      name: "",
      type: "",
      quantity: "",
      unit: "",
      lowStockThreshold: "",
      expiryDate: "",
      withdrawalPeriod: "",
      location: "",
    });
  };

  const isLowStock = (quantity: number, threshold: number) => quantity <= threshold;
  const isExpiringSoon = (expiryDate: string) => {
    const daysUntilExpiry = Math.floor(
      (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 60;
  };

  const generatePDF = () => {
    // In a real app, this would generate a PDF report
    console.log("Generating medicine register PDF...");
    alert("Medicine register PDF generation would happen here");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Medicine Inventory</h2>
          <p className="text-gray-600 mt-1">Manage and track medicine stock</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={generatePDF}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FileDown className="w-5 h-5" />
            Generate PDF
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Medicine
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        {medicines.some((m) => isLowStock(m.quantity, m.lowStockThreshold)) && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-orange-900">Low Stock Alert</p>
              <p className="text-sm text-orange-800 mt-1">
                {medicines.filter((m) => isLowStock(m.quantity, m.lowStockThreshold)).length}{" "}
                medicine(s) below threshold
              </p>
            </div>
          </div>
        )}
        {medicines.some((m) => isExpiringSoon(m.expiryDate)) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Expiry Warning</p>
              <p className="text-sm text-yellow-800 mt-1">
                {medicines.filter((m) => isExpiringSoon(m.expiryDate)).length} medicine(s) expiring
                within 60 days
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">New Medicine</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Penicillin G"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <input
                  type="text"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Antibiotic"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                <input
                  type="text"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g. vials (10ml)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Low Stock Threshold *
                </label>
                <input
                  type="number"
                  required
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({ ...formData, lowStockThreshold: e.target.value })
                  }
                  placeholder="e.g. 5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Period (days) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.withdrawalPeriod}
                  onChange={(e) => setFormData({ ...formData, withdrawalPeriod: e.target.value })}
                  placeholder="e.g. 7"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Cabinet A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Medicine
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicines.map((medicine) => (
          <div key={medicine.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">{medicine.type}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span
                  className={`font-medium ${
                    isLowStock(medicine.quantity, medicine.lowStockThreshold)
                      ? "text-orange-600"
                      : "text-gray-900"
                  }`}
                >
                  {medicine.quantity} {medicine.unit}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Threshold:</span>
                <span className="text-gray-900">{medicine.lowStockThreshold}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expiry:</span>
                <span
                  className={`${
                    isExpiringSoon(medicine.expiryDate) ? "text-yellow-700 font-medium" : "text-gray-900"
                  }`}
                >
                  {medicine.expiryDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Withdrawal:</span>
                <span className="text-gray-900">{medicine.withdrawalPeriod} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Location:</span>
                <span className="text-gray-900">{medicine.location}</span>
              </div>
            </div>

            {(isLowStock(medicine.quantity, medicine.lowStockThreshold) ||
              isExpiringSoon(medicine.expiryDate)) && (
              <div className="flex flex-wrap gap-2">
                {isLowStock(medicine.quantity, medicine.lowStockThreshold) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                    <AlertCircle className="w-3 h-3" />
                    Low Stock
                  </span>
                )}
                {isExpiringSoon(medicine.expiryDate) && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                    <AlertCircle className="w-3 h-3" />
                    Expiring Soon
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
