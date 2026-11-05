import { Plus, MapPin, Sprout } from "lucide-react";
import { useState } from "react";

export function LandManagement() {
  const [selectedView, setSelectedView] = useState<"gerk" | "fertilization" | "subsidies">("gerk");
  const [showAddGerk, setShowAddGerk] = useState(false);
  const [showAddFertilization, setShowAddFertilization] = useState(false);
  const [showAddSubsidy, setShowAddSubsidy] = useState(false);

  const gerkUnits: {
    id: number;
    gerkID: string;
    name: string;
    area: number;
    landUse: string;
    crop: string;
    location: string;
  }[] = [];

  const fertilizations: {
    id: number;
    gerkID: string;
    name: string;
    date: string;
    type: string;
    product: string;
    quantity: number;
    unit: string;
  }[] = [];

  const subsidies: {
    id: number;
    year: number;
    scheme: string;
    gerkIDs: string[];
    totalArea: number;
    amount: number;
    status: string;
    submittedDate: string;
  }[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Zemljišča in subvencije</h2>
          <p className="text-gray-600 mt-1">Upravljajte GERK enote in zahtevke za subvencije</p>
        </div>
      </div>

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
            GERK enote
          </button>
          <button
            onClick={() => setSelectedView("fertilization")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "fertilization"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Gnojenje
          </button>
          <button
            onClick={() => setSelectedView("subsidies")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedView === "subsidies"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Zahtevki za subvencije
          </button>
        </div>
      </div>

      {selectedView === "gerk" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddGerk(!showAddGerk)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Dodaj zemljiško enoto
            </button>
          </div>

          {showAddGerk && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova GERK enota</h3>
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
                      placeholder="npr. GERK-1234"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ime *</label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Spodnji travnik"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Površina (ha) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="npr. 5.2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raba zemljišča *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Pasture">Pašnik</option>
                      <option value="Arable">Njiva</option>
                      <option value="Meadow">Travnik</option>
                      <option value="Forest">Gozd</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pridelek</label>
                    <input
                      type="text"
                      placeholder="npr. Trava, koruza"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokacija</label>
                    <input
                      type="text"
                      placeholder="npr. Parcelna A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Dodaj
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddGerk(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Prekliči
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
                    <span className="text-gray-600">Površina:</span>
                    <span className="text-gray-900 font-medium">{unit.area} ha</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Raba:</span>
                    <span className="text-gray-900">{unit.landUse}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pridelek:</span>
                    <span className="text-gray-900">{unit.crop}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lokacija:</span>
                    <span className="text-gray-900">{unit.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedView === "fertilization" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddFertilization(!showAddFertilization)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Zabeleži gnojenje
            </button>
          </div>

          {showAddFertilization && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nov zapis gnojenja</h3>
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
                      <option value="">Izberi GERK enoto...</option>
                      {gerkUnits.map((unit) => (
                        <option key={unit.id} value={unit.gerkID}>
                          {unit.gerkID} - {unit.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Datum *</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vrsta *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Organic">Organsko</option>
                      <option value="Mineral">Mineralno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sredstvo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="npr. Goveji gnoj"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Količina *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="npr. 15000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Enota *</label>
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
                    Shrani
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddFertilization(false)}
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
                      GERK enota
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Vrsta</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Sredstvo
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      Količina
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

      {selectedView === "subsidies" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddSubsidy(!showAddSubsidy)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nov zahtevek za subvencijo
            </button>
          </div>

          {showAddSubsidy && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Nov zahtevek za subvencijo
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowAddSubsidy(false);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leto *</label>
                    <input
                      type="number"
                      required
                      defaultValue={2026}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Direct Payments">Neposredna plačila</option>
                      <option value="Agri-Environment">Kmetijsko-okoljski ukrepi</option>
                      <option value="Organic Farming">Ekološko kmetovanje</option>
                      <option value="Young Farmer">Mladi kmet</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GERK enote (izberi več)
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
                      Pričakovani znesek (€)
                    </label>
                    <input
                      type="number"
                      placeholder="npr. 8500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Oddaj zahtevek
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSubsidy(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Prekliči
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
                      <p className="text-sm text-gray-600">Leto {subsidy.year}</p>
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
                    <p className="text-sm text-gray-600">GERK enote</p>
                    <p className="font-medium text-gray-900">{subsidy.gerkIDs.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Skupna površina</p>
                    <p className="font-medium text-gray-900">{subsidy.totalArea} ha</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Znesek</p>
                    <p className="font-medium text-gray-900">€{subsidy.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Oddano</p>
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
