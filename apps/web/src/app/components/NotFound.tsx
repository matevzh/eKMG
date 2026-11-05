import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Stran, ki ste jo iskali, ne obstaja</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          Nadzorna plošča
        </Link>
      </div>
    </div>
  );
}
