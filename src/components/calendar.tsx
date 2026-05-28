import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchHolidays, type Holiday } from "../utils/holidays";

interface CalendarProps {
  onDateSelect?: (date: string) => void;
}


// const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const days = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];

const Calendar = ({ onDateSelect }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4)); // May 2026
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  useEffect(() => {
    fetchHolidays().then((data) => {
      setHolidays(data);
    });
  }, []);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  // Fonction pour vérifier si un jour est férié
  const isHoliday = (day: number) => {
    const monthFormatted = String(month + 1).padStart(2, "0");
    const dayFormatted = String(day).padStart(2, "0");
    const fullDate = `${year}-${monthFormatted}-${dayFormatted}`;
    
    return holidays.find((holiday) => holiday.date === fullDate);
  };

  const calendarDays = [];

  // Previous month days
  for (let i = firstDayOfMonth; i > 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i + 1,
      currentMonth: false,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      currentMonth: true,
    });
  }

  // Next month days
  while (calendarDays.length < 42) {
    calendarDays.push({
      day: calendarDays.length - daysInMonth - firstDayOfMonth + 1,
      currentMonth: false,
    });
  }

  return (
    <div className="w-full rounded-lg bg-white dark:bg-[#172033] p-5 text-gray-900 dark:text-white  border border-gray-200 dark:border-gray-800 transition-colors">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </h2>

        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Days Header */}
      <div className="mb-4 grid grid-cols-7 text-center text-sm font-semibold text-blue-500 dark:text-blue-400">
        {days.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center">
        {calendarDays.map((item, index) => {
          const isToday =
            item.currentMonth &&
            item.day === todayDay &&
            month === todayMonth &&
            year === todayYear;

          const holiday = item.currentMonth && isHoliday(item.day);

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;

          const handleDateClick = () => {
            if (item.currentMonth && onDateSelect) {
              // Format: YYYY-MM-DD
              const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;
              onDateSelect(formattedDate);
            }
          };

          return (
            <div key={index} className="relative group">
              <div
                onClick={handleDateClick}
                onMouseEnter={() => holiday && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium transition-all
                  ${
                    item.currentMonth
                      ? "text-gray-900 dark:text-white cursor-pointer"
                      : "text-gray-400 dark:text-gray-600"
                  }
                  ${
                    holiday
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-100 font-semibold hover:bg-emerald-300 dark:hover:bg-emerald-900/50"
                      : isToday
                      ? "bg-blue-500 dark:bg-blue-600 text-white font-semibold hover:bg-blue-600 dark:hover:bg-blue-700"
                      : "hover:bg-gray-100 dark:hover:bg-white/10"
                  }
                `}
              >
                {item.day}
              </div>

              {/* Popover pour les jours fériés */}
              {holiday && hoveredDate === dateStr && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap">
                  <div className="bg-gray-900 dark:bg-gray-800 text-white dark:text-white text-xs py-2 px-3 rounded-lg shadow-lg">
                    <div className="font-semibold">{holiday.localName || holiday.name}</div>
                    <div className="text-gray-300">Toute la journée</div>
                    {/* Petite flèche vers le bas */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
