// components/BigCalendar.tsx

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type EventType = {
  title: string;
  day: number;
  color: string;
};

interface BigCalendarProps {
  onDateSelect?: (date: string) => void;
}

const weekDays = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
// const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const events: EventType[] = [];

const BigCalendar = ({ onDateSelect }: BigCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4));

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const cells = [];

  // Previous month
  for (let i = firstDayOfMonth; i > 0; i--) {
    cells.push({
      day: prevMonthDays - i + 1,
      currentMonth: false,
    });
  }

  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      currentMonth: true,
    });
  }

  // Next month
  while (cells.length < 42) {
    cells.push({
      day: cells.length - daysInMonth - firstDayOfMonth + 1,
      currentMonth: false,
    });
  }

  return (
    <div className="w-full bg-transparent text-gray-900 dark:text-white overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 p-4 ">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2 overflow-hidden">
            <button
              onClick={prevMonth}
              className="flex h-10 w-10 rounded-lg items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={nextMonth}
              className="flex h-10 w-10 rounded-lg items-center justify-center bg-gray-100 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 text-gray-900 dark:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Today
          </button> */}
        </div>

        {/* Center */}
        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          {currentDate.toLocaleString("default", {
            month: "long",
          })}{" "}
          {year}
        </h2>
        <div></div>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 bg-gray-100 dark:bg-[#33445f] text-sm text-gray-700 dark:text-gray-300">
        {weekDays.map((day) => (
          <div
            key={day}
            className="border-r border-gray-200 dark:border-white/10 py-4 text-center last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="grid grid-cols-7">
        {cells.map((cell, index) => {
          const dayEvents = events.filter((event) => event.day === cell.day);

          const handleDateClick = () => {
            if (cell.currentMonth && onDateSelect) {
              const monthFormatted = String(month + 1).padStart(2, "0");
              const dayFormatted = String(cell.day).padStart(2, "0");
              const formattedDate = `${year}-${monthFormatted}-${dayFormatted}`;
              onDateSelect(formattedDate);
            }
          };

          return (
            <div
              key={index}
              onClick={handleDateClick}
              className={`relative h-30 border border-b border-gray-200 dark:border-white/10 p-2 cursor-pointer
                ${
                  cell.day === todayDay &&
                  month === todayMonth &&
                  year === todayYear &&
                  cell.currentMonth
                    ? "bg-blue-500 dark:bg-blue-600 text-white font-semibold hover:bg-blue-600 dark:hover:bg-blue-700"
                    : "bg-white dark:bg-[#0d1621] hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {/* DAY NUMBER */}
              <div
                className={`text-right text-xl
                  ${
                    cell.day === todayDay &&
                    month === todayMonth &&
                    year === todayYear &&
                    cell.currentMonth
                      ? "text-white"
                      : cell.currentMonth
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-300 dark:text-gray-500"
                  }
                `}
              >
                {cell.day}
              </div>

              {/* EVENTS */}
              <div className="mt-4 space-y-1">
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`${event.color} rounded px-2 py-1 text-center text-sm`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BigCalendar;
