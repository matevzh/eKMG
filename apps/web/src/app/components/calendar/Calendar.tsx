import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "health" | "withdrawal" | "birth" | "movement" | "milk" | "fertilization" | "subsidy" | "vaccination";
  description?: string;
  animalId?: string;
}

export function Calendar() {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Mock events - in real app this would come from your data
  const allEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Withdrawal ends - Bella",
      date: "2026-03-07",
      type: "withdrawal",
      description: "Penicillin withdrawal period ends",
      animalId: "A1234",
    },
    {
      id: "2",
      title: "Withdrawal ends - Daisy",
      date: "2026-03-04",
      type: "withdrawal",
      description: "Meloxicam withdrawal period ends",
      animalId: "A1235",
    },
    {
      id: "3",
      title: "Health Checkup - Luna",
      date: "2026-03-10",
      type: "health",
      description: "Regular monthly checkup",
      animalId: "A1236",
    },
    {
      id: "4",
      title: "Vaccination - 5 animals",
      date: "2026-03-05",
      type: "vaccination",
      description: "Annual vaccination schedule",
    },
    {
      id: "5",
      title: "Milk Delivery",
      date: "2026-03-02",
      type: "milk",
      description: "Alpine Dairy Co. pickup",
    },
    {
      id: "6",
      title: "Milk Delivery",
      date: "2026-03-06",
      type: "milk",
      description: "Alpine Dairy Co. pickup",
    },
    {
      id: "7",
      title: "Movement Report Due",
      date: "2026-03-03",
      type: "movement",
      description: "CRG compliance deadline",
    },
    {
      id: "8",
      title: "Fertilization - Upper Field",
      date: "2026-03-15",
      type: "fertilization",
      description: "GERK-1235 scheduled fertilization",
    },
    {
      id: "9",
      title: "Subsidy Claim Deadline",
      date: "2026-03-31",
      type: "subsidy",
      description: "Direct Payments submission deadline",
    },
    {
      id: "10",
      title: "Birth - Calf expected",
      date: "2026-03-12",
      type: "birth",
      description: "Expected calving date for Rosie",
      animalId: "A1238",
    },
  ];

  const eventTypes = [
    { value: "all", label: t("calendar.filterAll"), color: "bg-gray-500" },
    { value: "health", label: t("calendar.filterHealth"), color: "bg-blue-500" },
    { value: "withdrawal", label: t("calendar.filterWithdrawal"), color: "bg-orange-500" },
    { value: "vaccination", label: t("calendar.filterVaccination"), color: "bg-purple-500" },
    { value: "birth", label: t("calendar.filterBirth"), color: "bg-pink-500" },
    { value: "movement", label: t("calendar.filterMovement"), color: "bg-indigo-500" },
    { value: "milk", label: t("calendar.filterMilk"), color: "bg-cyan-500" },
    { value: "fertilization", label: t("calendar.filterFertilization"), color: "bg-green-500" },
    { value: "subsidy", label: t("calendar.filterSubsidy"), color: "bg-yellow-500" },
  ];

  const filteredEvents =
    selectedFilter === "all"
      ? allEvents
      : allEvents.filter((event) => event.type === selectedFilter);

  const getEventColor = (type: string) => {
    const eventType = eventTypes.find((t) => t.value === type);
    return eventType?.color || "bg-gray-500";
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    });
  };

  const days = getDaysInMonth();

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{t("calendar.title")}</h2>
          <p className="text-gray-600 mt-1">{t("calendar.subtitle")}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedFilter(type.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedFilter === type.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, "MMMM yyyy")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
              >
                {t("calendar.today")}
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const events = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[80px] p-2 rounded-lg border transition-colors text-left ${
                    !isCurrentMonth
                      ? "bg-gray-50 text-gray-400"
                      : isSelected
                      ? "bg-green-50 border-green-500"
                      : isTodayDate
                      ? "bg-blue-50 border-blue-500"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isTodayDate ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`${getEventColor(
                          event.type
                        )} text-white text-xs px-1.5 py-0.5 rounded truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-600 px-1.5">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}
            </h3>
          </div>

          {selectedDate && selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span
                      className={`${getEventColor(
                        event.type
                      )} w-3 h-3 rounded-full mt-1 flex-shrink-0`}
                    ></span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                      )}
                      {event.animalId && (
                        <p className="text-xs text-gray-500 mt-1">Animal: {event.animalId}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                      event.type === "withdrawal"
                        ? "bg-orange-100 text-orange-800"
                        : event.type === "health"
                        ? "bg-blue-100 text-blue-800"
                        : event.type === "birth"
                        ? "bg-pink-100 text-pink-800"
                        : event.type === "vaccination"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No events scheduled for this date</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Click on a date to view events</p>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Upcoming Events</h4>
            <div className="space-y-2">
              {filteredEvents
                .filter((event) => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <span
                      className={`${getEventColor(event.type)} w-2 h-2 rounded-full flex-shrink-0`}
                    ></span>
                    <span className="text-gray-600 text-xs">
                      {format(parseISO(event.date), "MMM d")}
                    </span>
                    <span className="text-gray-900 text-xs truncate flex-1">
                      {event.title}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Event Types</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {eventTypes.slice(1).map((type) => (
            <div key={type.value} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${type.color}`}></span>
              <span className="text-xs text-gray-700">{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
