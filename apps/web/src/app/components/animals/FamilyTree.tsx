import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

interface Animal {
  id: string;
  name: string;
  earTag: string;
  breed: string;
  birthDate: string;
  gender: "Male" | "Female";
}

interface AnimalWithRelations extends Animal {
  sire?: Animal;
  dam?: Animal;
  offspring?: Animal[];
  siblings?: Animal[];
}

interface FamilyTreeProps {
  animalId: string;
}

export function FamilyTree({ animalId }: FamilyTreeProps) {
  // Mock data - in real app this would come from your database
  const getMockAnimalData = (id: string): AnimalWithRelations | null => {
    const animals: Record<string, AnimalWithRelations> = {
      "1": {
        id: "1",
        name: "Bella",
        earTag: "A1234",
        breed: "Holstein",
        birthDate: "2020-03-15",
        gender: "Female",
        sire: {
          id: "s1",
          name: "Thunder",
          earTag: "B5678",
          breed: "Holstein",
          birthDate: "2017-05-10",
          gender: "Male",
        },
        dam: {
          id: "d1",
          name: "Rosie",
          earTag: "A9876",
          breed: "Holstein",
          birthDate: "2016-08-20",
          gender: "Female",
        },
        offspring: [
          {
            id: "o1",
            name: "Bella Jr",
            earTag: "A2345",
            breed: "Holstein",
            birthDate: "2023-04-10",
            gender: "Female",
          },
          {
            id: "o2",
            name: "Bobby",
            earTag: "A2346",
            breed: "Holstein",
            birthDate: "2024-06-15",
            gender: "Male",
          },
        ],
        siblings: [
          {
            id: "sib1",
            name: "Betsy",
            earTag: "A1233",
            breed: "Holstein",
            birthDate: "2019-02-10",
            gender: "Female",
          },
          {
            id: "sib2",
            name: "Bruno",
            earTag: "A1235",
            breed: "Holstein",
            birthDate: "2021-01-05",
            gender: "Male",
          },
        ],
      },
      "2": {
        id: "2",
        name: "Daisy",
        earTag: "A1235",
        breed: "Jersey",
        birthDate: "2019-06-22",
        gender: "Female",
        sire: {
          id: "s2",
          name: "Duke",
          earTag: "B6789",
          breed: "Jersey",
          birthDate: "2016-03-12",
          gender: "Male",
        },
        dam: {
          id: "d2",
          name: "Dolly",
          earTag: "A8765",
          breed: "Jersey",
          birthDate: "2015-11-30",
          gender: "Female",
        },
        offspring: [
          {
            id: "o3",
            name: "Daphne",
            earTag: "A3456",
            breed: "Jersey",
            birthDate: "2022-08-20",
            gender: "Female",
          },
        ],
        siblings: [],
      },
      "3": {
        id: "3",
        name: "Luna",
        earTag: "A1236",
        breed: "Brown Swiss",
        birthDate: "2021-01-10",
        gender: "Female",
        sire: {
          id: "s3",
          name: "Leo",
          earTag: "B7890",
          breed: "Brown Swiss",
          birthDate: "2018-07-15",
          gender: "Male",
        },
        dam: {
          id: "d3",
          name: "Lucy",
          earTag: "A7654",
          breed: "Brown Swiss",
          birthDate: "2017-09-25",
          gender: "Female",
        },
        offspring: [],
        siblings: [
          {
            id: "sib3",
            name: "Logan",
            earTag: "A1237",
            breed: "Brown Swiss",
            birthDate: "2020-12-05",
            gender: "Male",
          },
        ],
      },
    };

    return animals[id] || null;
  };

  const animal = getMockAnimalData(animalId);

  if (!animal) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Animal not found</p>
      </div>
    );
  }

  const AnimalCard = ({ animal, relationship }: { animal: Animal; relationship: string }) => (
    <Link
      to={`/animals/${animal.id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-500 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <Home className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-medium text-gray-500 uppercase">{relationship}</span>
      </div>
      <h4 className="font-semibold text-gray-900">{animal.name}</h4>
      <p className="text-sm text-gray-600">Ear Tag: {animal.earTag}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
          {animal.breed}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded ${
            animal.gender === "Female"
              ? "bg-pink-100 text-pink-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {animal.gender}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Grandparents - Paternal Side */}
      {animal.sire && (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Paternal Line
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase">Paternal Grandfather</p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Unknown</span>
                </div>
                <p className="text-xs text-blue-700">No record available</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase">Paternal Grandmother</p>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Unknown</span>
                </div>
                <p className="text-xs text-blue-700">No record available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grandparents - Maternal Side */}
      {animal.dam && (
        <div className="bg-gradient-to-b from-pink-50 to-white rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
            Maternal Line
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase">Maternal Grandfather</p>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-900">Unknown</span>
                </div>
                <p className="text-xs text-pink-700">No record available</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase">Maternal Grandmother</p>
              <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Home className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-900">Unknown</span>
                </div>
                <p className="text-xs text-pink-700">No record available</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parents Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Parents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animal.sire ? (
            <AnimalCard animal={animal.sire} relationship="Sire (Father)" />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Sire unknown</p>
            </div>
          )}
          {animal.dam ? (
            <AnimalCard animal={animal.dam} relationship="Dam (Mother)" />
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Home className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Dam unknown</p>
            </div>
          )}
        </div>
      </div>

      {/* Current Animal */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-center justify-center mb-3">
          <ChevronRight className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-900 uppercase mx-2">
            Current Animal
          </span>
          <ChevronRight className="w-5 h-5 text-green-600" />
        </div>
        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="text-center">
            <Home className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{animal.name}</h3>
            <p className="text-gray-600 mb-4">Ear Tag: {animal.earTag}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                {animal.breed}
              </span>
              <span
                className={`px-3 py-1 rounded-lg font-medium ${
                  animal.gender === "Female"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {animal.gender}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                Born: {new Date(animal.birthDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Siblings Section */}
      {animal.siblings && animal.siblings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
            Siblings ({animal.siblings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animal.siblings.map((sibling) => (
              <AnimalCard key={sibling.id} animal={sibling} relationship="Sibling" />
            ))}
          </div>
        </div>
      )}

      {/* Offspring Section */}
      {animal.offspring && animal.offspring.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Offspring ({animal.offspring.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {animal.offspring.map((child) => (
              <AnimalCard key={child.id} animal={child} relationship="Child" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Offspring
          </h3>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Home className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No offspring recorded</p>
          </div>
        </div>
      )}

      {/* Family Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">
              {animal.sire && animal.dam ? "2" : animal.sire || animal.dam ? "1" : "0"}
            </div>
            <div className="text-sm text-gray-600">Parents Known</div>
          </div>
          <div className="text-center p-4 bg-amber-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-700">
              {animal.siblings?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Siblings</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">
              {animal.offspring?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Offspring</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-700">
              {(animal.sire && animal.dam ? 2 : animal.sire || animal.dam ? 1 : 0) +
                (animal.siblings?.length || 0) +
                (animal.offspring?.length || 0)}
            </div>
            <div className="text-sm text-gray-600">Total Relations</div>
          </div>
        </div>
      </div>
    </div>
  );
}
