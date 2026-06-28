import { Plus, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function HealthRecords() {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  // Mock data
  const healthRecords = [
    {
      id: 1,
      animalID: "A1234",
      animalName: "Bella",
      date: "2026-02-28",
      type: "Treatment",
      diagnosis: "Minor infection",
      treatment: "Antibiotic - Penicillin 10ml",
      vet: "Dr. Smith",
      withdrawalPeriod: 7,
      withdrawalEnd: "2026-03-07",
    },
    {
      id: 2,
      animalID: "A1235",
      animalName: "Daisy",
      date: "2026-02-27",
      type: "Treatment",
      diagnosis: "Mastitis",
      treatment: "Anti-inflammatory - Meloxicam 15ml",
      vet: "Dr. Johnson",
      withdrawalPeriod: 5,
      withdrawalEnd: "2026-03-04",
    },
    {
      id: 3,
      animalID: "A1236",
      animalName: "Luna",
      date: "2026-02-26",
      type: "Checkup",
      diagnosis: "Healthy",
      treatment: "None",
      vet: "Dr. Smith",
      withdrawalPeriod: 0,
      withdrawalEnd: null,
    },
    {
      id: 4,
      animalID: "A1237",
      animalName: "Molly",
      date: "2026-02-25",
      type: "Vaccination",
      diagnosis: "Preventive care",
      treatment: "Annual vaccination",
      vet: "Dr. Smith",
      withdrawalPeriod: 0,
      withdrawalEnd: null,
    },
  ];

  const [formData, setFormData] = useState({
    animalID: "",
    date: new Date().toISOString().split("T")[0],
    type: "Checkup",
    diagnosis: "",
    treatment: "",
    vet: "",
    withdrawalPeriod: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding health record:", formData);
    setShowAddForm(false);
    setFormData({
      animalID: "",
      date: new Date().toISOString().split("T")[0],
      type: "Checkup",
      diagnosis: "",
      treatment: "",
      vet: "",
      withdrawalPeriod: 0,
    });
  };

  const filteredRecords = healthRecords.filter((record) => {
    const matchesSearch =
      record.animalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const isWithdrawalActive = (withdrawalEnd: string | null) => {
    if (!withdrawalEnd) return false;
    return new Date(withdrawalEnd) > new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t("health.title")}</h2>
          <p className="text-gray-600 mt-1">{t("health.subtitle")}</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("health.addRecord")}
        </button>
      </div>

      {/* Add Record Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("health.addRecord")}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.animal")} ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.animalID}
                  onChange={(e) => setFormData({ ...formData, animalID: e.target.value })}
                  placeholder="e.g. A1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.date")} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.type")} *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Checkup">{t("health.types.checkup")}</option>
                  <option value="Treatment">{t("health.types.treatment")}</option>
                  <option value="Vaccination">{t("health.types.vaccination")}</option>
                  <option value="Surgery">{t("health.types.surgery")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.veterinarian")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.vet}
                  onChange={(e) => setFormData({ ...formData, vet: e.target.value })}
                  placeholder="e.g. Dr. Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.diagnosis")} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Minor infection"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("medicine.title")}
                </label>
                <input
                  type="text"
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  placeholder="e.g. Antibiotic - Penicillin 10ml"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("health.withdrawal")}
                </label>
                <input
                  type="number"
                  value={formData.withdrawalPeriod}
                  onChange={(e) =>
                    setFormData({ ...formData, withdrawalPeriod: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by animal ID, name, or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="Checkup">Checkup</option>
            <option value="Treatment">Treatment</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Surgery">Surgery</option>
          </select>
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Animal</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Diagnosis
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Treatment
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Veterinarian
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Withdrawal
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{record.date}</td>
                  <td className="py-3 px-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-900">{record.animalName}</div>
                      <div className="text-gray-600">{record.animalID}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {record.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{record.diagnosis}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.treatment}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.vet}</td>
                  <td className="py-3 px-4 text-sm">
                    {record.withdrawalEnd ? (
                      <div className="flex items-center gap-2">
                        {isWithdrawalActive(record.withdrawalEnd) && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                        <span
                          className={
                            isWithdrawalActive(record.withdrawalEnd)
                              ? "text-orange-700 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {record.withdrawalEnd}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">No health records found</p>
        </div>
      )}
    </div>
  );
}
