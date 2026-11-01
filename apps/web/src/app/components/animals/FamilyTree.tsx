interface FamilyTreeProps {
  animalId: string;
}

export function FamilyTree({ animalId: _animalId }: FamilyTreeProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <p className="text-gray-500">No family tree data available yet.</p>
    </div>
  );
}
