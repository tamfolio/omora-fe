"use client";
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CalendarDatePickerProps {
  onApply: (start: Date, end: Date) => void;
  onCancel: () => void;
}

export default function CalendarDatePicker({
  onApply,
  onCancel,
}: CalendarDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    return { daysInMonth, startingDayOfWeek: adjustedStartDay };
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate < startDate) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else {
      setEndDate(clickedDate);
    }
  };

  const isDateInRange = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!startDate) return false;
    const compareEnd = hoverDate && !endDate ? hoverDate : endDate;
    if (!compareEnd) return false;
    return date > startDate && date < compareEnd;
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === endDate.toDateString();
  };

  const handleQuickSelect = (type: "week" | "month" | "year") => {
    const end = new Date();
    const start = new Date();
    switch (type) {
      case "week":
        start.setDate(start.getDate() - 7);
        break;
      case "month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingDays = Array.from({ length: startingDayOfWeek }, (_, i) => null);

  const formatDateShort = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <FiChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() =>
            setCurrentMonth(
              new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
            )
          }
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <FiChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Date Range Display */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 px-2 py-1.5 bg-gray-50 rounded text-xs text-gray-700 text-center border border-gray-200">
          {startDate ? formatDateShort(startDate) : "Start Date"}
        </div>
        <span className="text-gray-400 text-xs">-</span>
        <div className="flex-1 px-2 py-1.5 bg-gray-50 rounded text-xs text-gray-700 text-center border border-gray-200">
          {endDate ? formatDateShort(endDate) : "End Date"}
        </div>
      </div>

      {/* Quick Select */}
      <div className="flex gap-1.5 mb-3">
        <button
          onClick={() => handleQuickSelect("week")}
          className="px-2 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded transition-colors font-medium"
        >
          Last week
        </button>
        <button
          onClick={() => handleQuickSelect("month")}
          className="px-2 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded transition-colors font-medium"
        >
          Last month
        </button>
        <button
          onClick={() => handleQuickSelect("year")}
          className="px-2 py-1 text-xs text-teal-600 hover:bg-teal-50 rounded transition-colors font-medium"
        >
          Last year
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="mb-3">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] font-medium text-gray-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-0.5">
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="aspect-square" />
          ))}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              onMouseEnter={() =>
                setHoverDate(
                  new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day
                  )
                )
              }
              onMouseLeave={() => setHoverDate(null)}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-full transition-colors relative
                ${
                  isStartDate(day) || isEndDate(day)
                    ? "bg-teal-600 text-white font-semibold"
                    : isDateInRange(day)
                    ? "bg-teal-50 text-teal-900"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {day}
              {(isStartDate(day) || isEndDate(day)) && (
                <div className="absolute bottom-0.5 w-0.5 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (startDate && endDate) {
              onApply(startDate, endDate);
            }
          }}
          disabled={!startDate || !endDate}
          className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}