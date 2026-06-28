import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { AnimalList } from "./components/animals/AnimalList";
import { AnimalDetail } from "./components/animals/AnimalDetail";
import { AnimalForm } from "./components/animals/AnimalForm";
import { HealthRecords } from "./components/health/HealthRecords";
import { MedicineInventory } from "./components/health/MedicineInventory";
import { MilkManagement } from "./components/milk/MilkManagement";
import { LandManagement } from "./components/land/LandManagement";
import { Reports } from "./components/reports/Reports";
import { Calendar } from "./components/calendar/Calendar";
import { NotificationCenter } from "./components/notifications/NotificationCenter";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: Dashboard },
            { path: "animals", Component: AnimalList },
            { path: "animals/new", Component: AnimalForm },
            { path: "animals/:id", Component: AnimalDetail },
            { path: "animals/:id/edit", Component: AnimalForm },
            { path: "health", Component: HealthRecords },
            { path: "medicine", Component: MedicineInventory },
            { path: "milk", Component: MilkManagement },
            { path: "land", Component: LandManagement },
            { path: "calendar", Component: Calendar },
            { path: "notifications", Component: NotificationCenter },
            { path: "reports", Component: Reports },
            { path: "*", Component: NotFound },
        ],
    },
]);
