import { useParams, Link, useNavigate } from "react-router";
import {
  Edit,
  ArrowLeft,
  Calendar,
  Activity,
  FileText,
  Trash2,
  AlertCircle,
  TreeDeciduous,
} from "lucide-react";
import { useState } from "react";
import { FamilyTree } from "./FamilyTree";

export function AnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "family">("overview");

  // Mock data
  const animal = {
    id: id || "A1234",
    name: "Bella",
    type: "Cow",
    breed: "Holstein",
    birthDate: "2022-03-15",
    status: "Healthy",
    lactating: true,
    weight: "650 kg",
    motherID: "A0987",
    fatherID: "B0543",
    location: "Barn A - Stall 12",
  };

  const healthHistory = [
    {
      id: 1,
      date: "2026-02-27",
      type: "Checkup",
      description: "Regular health inspection",
      vet: "Dr. Smith",
    },
    {
      id: 2,
      date: "2026-02-15",
      type: "Treatment",
      description: "Antibiotic treatment for minor infection",
      vet: "Dr. Johnson",
    },
    {
      id: 3,
      date: "2026-01-20",
      type: "Vaccination",
      description: "Annual vaccination",
      vet: "Dr. Smith",
    },
  ];

  const movements = [
    {
      id: 1,
      date: "2026-02-10",
      from: "Barn B - Stall 5",
      to: "Barn A - Stall 12",
      reason: "Group reorg",
    },
    {
      id: 2,
      date: "2025-11-15",
      from: "Pasture 2",
      to: "Barn B - Stall 5",
      reason: "Winter housing",
    },
  ];

  const milkRecords = [
    { id: 1, date: "2026-02-28", morning: "28 L", evening: "26 L", total: "54 L" },
    { id: 2, date: "2026-02-27", morning: "27 L", evening: "27 L", total: "54 L" },
    { id: 3, date: "2026-02-26", morning: "29 L", evening: "25 L", total: "54 L" },
  ];

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${animal.name}?`)) {
      // In a real app, this would delete from the database
      navigate("/animals");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/animals"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">{animal.name}</h2>
          <p className="text-gray-600">{animal.id}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/animals/${animal.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6 pt-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-green-600 text-green-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab("family")}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === "family"
                  ? "border-green-600 text-green-600 font-medium"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <TreeDeciduous className="w-4 h-4" />
                Family Tree
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" ? (
        <>
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <p className="text-gray-900 font-medium">{animal.type}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Breed</label>
                <p className="text-gray-900 font-medium">{animal.breed}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Birth Date</label>
                <p className="text-gray-900 font-medium">{animal.birthDate}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    animal.status === "Healthy"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {animal.status}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Weight</label>
                <p className="text-gray-900 font-medium">{animal.weight}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Lactating</label>
                <p className="text-gray-900 font-medium">{animal.lactating ? "Yes" : "No"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Mother ID</label>
                <p className="text-gray-900 font-medium">{animal.motherID}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Father ID</label>
                <p className="text-gray-900 font-medium">{animal.fatherID}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-600">Current Location</label>
                <p className="text-gray-900 font-medium">{animal.location}</p>
              </div>
            </div>
          </div>

          {/* Health History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Health History
              </h3>
              <Link to="/health" className="text-sm text-green-600 hover:text-green-700">
                Add Record →
              </Link>
            </div>
            <div className="space-y-3">
              {healthHistory.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.type}
                        </span>
                        <span className="text-sm text-gray-600">{record.date}</span>
                      </div>
                      <p className="text-gray-900 mt-2">{record.description}</p>
                      <p className="text-sm text-gray-600 mt-1">Veterinarian: {record.vet}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movement History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Movement History
            </h3>
            <div className="space-y-3">
              {movements.map((movement) => (
                <div key={movement.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{movement.date}</span>
                    <span className="text-xs text-gray-600">{movement.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span>{movement.from}</span>
                    <span>→</span>
                    <span>{movement.to}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Milk Records (if lactating) */}
          {animal.lactating && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Milk Records
                </h3>
                <Link to="/milk" className="text-sm text-green-600 hover:text-green-700">
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                        Morning
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">
                        Evening
                      </th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {milkRecords.map((record) => (
                      <tr key={record.id} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm text-gray-900">{record.date}</td>
                        <td className="py-2 px-3 text-sm text-gray-700">{record.morning}</td>
                        <td className="py-2 px-3 text-sm text-gray-700">{record.evening}</td>
                        <td className="py-2 px-3 text-sm font-medium text-gray-900">{record.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <FamilyTree animalId={id || "1"} />
      )}
    </div>
  );
}