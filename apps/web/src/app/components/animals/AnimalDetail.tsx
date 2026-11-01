import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

export function AnimalDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/animals"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">Animal not found</h2>
          <p className="text-gray-600">{id}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">No animal data loaded yet.</p>
      </div>
    </div>
  );
}
