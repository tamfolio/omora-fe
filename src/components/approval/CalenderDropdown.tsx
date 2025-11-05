import React, { useState, useRef, useEffect, RefObject } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

function CalendarDropdown({
  isOpen,
  onClose,
  onDateRangeSelect,
  initialStartDate = null,
  initialEndDate = null,
  position = "bottom-right", // bottom-right, bottom-left, top-right, top-left
  className = "",
  triggerRef = null
}: {
  isOpen: boolean;
  onClose: () => void;
  onDateRangeSelect: (startDate: Date | null, endDate: Date | null) => void;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  position?: string;
  className?: string;
  triggerRef?: RefObject<HTMLElement | null> | null;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(initialStartDate);
  const [selectedEndDate, setSelectedEndDate] = useState(initialEndDate);
  const [tempStartDate, setTempStartDate] = useState(initialStartDate);
  const [tempEndDate, setTempEndDate] = useState(initialEndDate);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!dropdownRef.current) return;
      
      if (dropdownRef.current.contains(target)) return;
      
      const triggerElement = triggerRef?.current;
      if (triggerElement && (triggerElement as Node).contains(target)) return;
      
      onClose();
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, triggerRef]);

  // Get position classes based on position prop
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "top-full left-0 mt-2";
      case "bottom-right":
        return "top-full right-0 mt-2";
      case "top-left":
        return "bottom-full left-0 mb-2";
      case "top-right":
        return "bottom-full right-0 mb-2";
      default:
        return "top-full right-0 mt-2";
    }
  };

  // Get responsive position classes
  const getResponsivePositionClasses = () => {
    return "absolute z-50";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return <span className="font-semibold text-[#414651]">Today</span>;
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    
    // Create a 6-week calendar (42 days total)
    const days = [];
    
    // Find the Monday of the week containing the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Calculate how many days to go back to get to Monday
    let daysToSubtract;
    if (firstDayOfWeek === 0) {
      daysToSubtract = 6; // If first day is Sunday, go back 6 days to Monday
    } else {
      daysToSubtract = firstDayOfWeek - 1; // Otherwise, go back to Monday
    }
    
    // Start from the Monday of the week containing the first day
    const startDate = new Date(year, month, 1 - daysToSubtract);
    
    // Generate 42 days starting from that Monday
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.toDateString() === today.toDateString();
      
      days.push({
        date: currentDate,
        isCurrentMonth: isCurrentMonth,
        isToday: isToday
      });
    }

    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!tempStartDate && !tempEndDate) return false;
    if (tempStartDate && tempEndDate) {
      return date >= tempStartDate && date <= tempEndDate;
    }
    if (tempStartDate && hoveredDate) {
      const start = tempStartDate < hoveredDate ? tempStartDate : hoveredDate;
      const end = tempStartDate < hoveredDate ? hoveredDate : tempStartDate;
      return date >= start && date <= end;
    }
    return false;
  };


  const isDateSelected = (date: Date) => {
    if (!tempStartDate && !tempEndDate) return false;
    return (tempStartDate && date.toDateString() === tempStartDate.toDateString()) ||
           (tempEndDate && date.toDateString() === tempEndDate.toDateString());
  };

  const handleDateClick = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else {
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleQuickSelect = (range: string) => {
    const today = new Date();
    let startDate, endDate;

    switch (range) {
      case "Last week":
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "Last month":
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "Last year":
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return;
    }

    setTempStartDate(startDate);
    setTempEndDate(endDate);
  };

  const handleApply = () => {
    setSelectedStartDate(tempStartDate);
    setSelectedEndDate(tempEndDate);
    onDateRangeSelect(tempStartDate, tempEndDate);
    onClose();
  };

  const handleCancel = () => {
    setTempStartDate(selectedStartDate);
    setTempEndDate(selectedEndDate);
    onClose();
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const getMonthYear = () => {
    return currentMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute bg-white border border-gray-200 rounded-[8px] shadow-lg py-5 w-[328px] z-50 ${getPositionClasses()} ${className}`}
    >
      <div className="px-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft color="#A4A7AE" className="w-5 h-5" />
          </button>
          <h4 className="text-lg font-semibold text-[#414651]">
            {getMonthYear()}
          </h4>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight color="#A4A7AE" className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Date Range Display */}
        <div className="mb-4 text-[#181D27]">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="border border-[#D5D7DA] py-2 px-3 rounded-[8px] w-full flex justify-center items-center h-10">
              {formatDate(tempStartDate)}
            </span>
            <span>–</span>
            <span className="border border-[#D5D7DA] py-2 px-3 rounded-[8px] w-full flex justify-center items-center h-10">
              {formatDate(tempEndDate)}
            </span>
          </div>
        </div>

        {/* Quick Selection */}
        <div className="mb-3">
          <div className="flex justify-between px-2">
            {["Last week", "Last month", "Last year"].map((option) => (
              <button
                key={option}
                onClick={() => handleQuickSelect(option)}
                className="text-sm text-[#00717D] cursor-pointer font-semibold"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[14px] font-medium text-[#414651] py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const isInRange = isDateInRange(day.date);
            const isSelected = isDateSelected(day.date);
            const isStart =
              tempStartDate &&
              day.date.toDateString() === tempStartDate.toDateString();
            const isEnd =
              tempEndDate &&
              day.date.toDateString() === tempEndDate.toDateString();

            return (
              <button
                key={index}
                onClick={() => handleDateClick(day.date)}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`
                  h-8 w-8 text-sm rounded-full flex items-center justify-center relative
                  ${
                    !day.isCurrentMonth
                      ? "text-[#717680]"
                      : "text-[#414651] hover:text-[#414651] hover:bg-gray-100"
                  }
                  ${isInRange && !isStart && !isEnd ? "bg-[#FAFAFA]" : ""}
                  ${isStart ? "bg-[#008B99] text-white" : ""}
                  ${isEnd ? "bg-[#008B99] text-white" : ""}
                  ${day.isToday && !isSelected ? "bg-[#FAFAFA]" : ""}
                `}
              >
                {day.date.getDate()}
                {/* Current date dot */}
                {day.isToday && (
                  <div className="absolute bottom-0.5 w-1.5 h-1.5 bg-[#008B99] rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 px-6 border-t border-[#E9EAEB] mt-5 pt-4">
        <button
          onClick={handleCancel}
          className="px-4 w-full py-2 text-sm font-semibold cursor-pointer text-[#414651] bg-white border border-[#D5D7DA] rounded-[8px] hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-4 w-full py-2 text-sm font-semibold cursor-pointer text-white bg-[#008B99] rounded-[8px]"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default CalendarDropdown;
