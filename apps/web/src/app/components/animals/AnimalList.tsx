import { Link } from "react-router";
import { Plus, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function AnimalList() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock data
  const animals: any[] = [

  ];

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || animal.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t("animals.title")}</h2>
          <p className="text-gray-600 mt-1">{t("animals.subtitle")}</p>
        </div>
        <Link
          to="/animals/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t("animals.addNew")}
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t("animals.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">{t("animals.filterAll")}</option>
              <option value="Cow">{t("animals.filterCows")}</option>
              <option value="Heifer">{t("animals.filterHeifers")}</option>
              <option value="Calf">{t("animals.filterCalves")}</option>
              <option value="Bull">{t("animals.filterBulls")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimals.map((animal) => (
          <Link
            key={animal.id}
            to={`/animals/${animal.id}`}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{animal.name}</h3>
                <p className="text-sm text-gray-600">{animal.id}</p>
              </div>
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
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("dashboard.type")}</span>
                <span className="text-gray-900 font-medium">{animal.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("animals.breed")}</span>
                <span className="text-gray-900">{animal.breed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("animals.birthDate")}</span>
                <span className="text-gray-900">{animal.birthDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t("animals.gender")}</span>
                <span className="text-gray-900">
                  {animal.lactating ? t("common.yes") : t("common.no")}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600">{t("common.noResults")}</p>
        </div>
      )}
    </div>
  );
}
