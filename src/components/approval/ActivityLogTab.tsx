"use client"

import React, { useState, useRef } from 'react';
import { Search, ChevronsUpDown, ChevronUp, ChevronDown, Calendar } from 'lucide-react';
import CalendarDropdown from '@/components/approval/CalenderDropdown';

const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  NONE: 'none'
};

const getSortIcon = (direction: string) => {
  switch (direction) {
    case SORT_DIRECTIONS.ASC:
      return <ChevronUp color='#A4A7AE' className="w-3 h-3" />;
    case SORT_DIRECTIONS.DESC:
      return <ChevronDown color='#A4A7AE' className="w-3 h-3" />;
    default:
      return <ChevronsUpDown color='#A4A7AE' className="w-3 h-3" />;
  }
};

type ActivityLog = {
  id: number;
  user: string;
  role: "operator" | "admin";
  action: string;
  timestamp: Date;
};

const ActivityLogTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: string;
  }>({
    column: null,
    direction: SORT_DIRECTIONS.NONE,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2025, 0, 10));
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date(2025, 0, 16));
  const buttonRef = useRef<HTMLButtonElement>(null);

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return "Select date range";
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    };
    
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const handleDateRangeSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log("Date range selected:", { startDate, endDate });
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // Mock data
  const activities: ActivityLog[] = [
    { id: 1, user: "User A", role: "operator" as const, action: "deposited NGN 5,000,000 into account", timestamp: new Date(2025, 6, 15, 12, 0) },
    { id: 2, user: "User B", role: "admin" as const, action: "approves account status", timestamp: new Date(2025, 6, 14, 15, 30) },
    { id: 3, user: "User C", role: "operator" as const, action: "deposited NGN 2,500,000 into account", timestamp: new Date(2025, 6, 13, 9, 45) },
    { id: 4, user: "User D", role: "admin" as const, action: "declined investment request", timestamp: new Date(2025, 6, 12, 14, 20) },
    { id: 5, user: "User E", role: "operator" as const, action: "approved conversion request", timestamp: new Date(2025, 6, 11, 11, 15) },
    { id: 6, user: "User F", role: "admin" as const, action: "deposited NGN 10,000,000 into account", timestamp: new Date(2025, 6, 10, 16, 45) },
    { id: 7, user: "User G", role: "operator" as const, action: "approved investment request", timestamp: new Date(2025, 6, 9, 10, 30) },
    { id: 8, user: "User H", role: "admin" as const, action: "declined conversion request", timestamp: new Date(2025, 6, 8, 13, 0) },
  ];

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column 
        ? (prev.direction === SORT_DIRECTIONS.NONE 
            ? SORT_DIRECTIONS.ASC 
            : prev.direction === SORT_DIRECTIONS.ASC 
              ? SORT_DIRECTIONS.DESC 
              : SORT_DIRECTIONS.NONE)
        : SORT_DIRECTIONS.ASC,
    }));
  };

  const getSortDirection = (column: string) => {
    return sortConfig.column === column ? sortConfig.direction : SORT_DIRECTIONS.NONE;
  };

  const sortedActivities = React.useMemo(() => {
    if (!sortConfig.column || sortConfig.direction === SORT_DIRECTIONS.NONE) {
      return activities;
    }

    const column = sortConfig.column;

    return [...activities].sort((a, b) => {
      let aValue: any = a[column as keyof typeof a];
      let bValue: any = b[column as keyof typeof b];

      if (column === 'timestamp') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASC ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASC ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig, activities]);

  const filteredActivities = sortedActivities.filter((activity) =>
    activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'user', label: 'User', sortable: true },
    { key: 'role', label: 'Role', sortable: false },
    { key: 'action', label: 'Action', sortable: false },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
  ];

  return (
    <div className="bg-white border border-[#E9EAEB] rounded-[8px]">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-[#E9EAEB]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#181D27]">Activity Log</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[296px] pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleCalendarToggle}
                className="flex gap-2.5 items-center py-2.5 px-3.5 h-10 rounded-[8px] border border-[#D5D7DA] font-semibold text-[#414651] text-sm hover:bg-gray-50 transition-colors"
              >
                <Calendar color="#A4A7AE" />
                {formatDateRange(selectedStartDate, selectedEndDate)}
              </button>

              <CalendarDropdown
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onDateRangeSelect={handleDateRangeSelect}
                initialStartDate={selectedStartDate}
                initialEndDate={selectedEndDate}
                position="bottom-right"
                triggerRef={buttonRef}
                className="mt-2 z-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#E9EAEB]">
            <tr>
              {columns.map(({ key, label, sortable }) => (
                <th 
                  key={key} 
                  className={`px-6 py-3 text-xs font-semibold text-[#717680] tracking-wider ${
                    key === 'timestamp' ? 'text-right' : 'text-left'
                  }`}
                >
                  {sortable ? (
                    <button 
                      onClick={() => handleSort(key)}
                      className={`flex items-center space-x-1 hover:text-gray-700 w-full ${
                        key === 'timestamp' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{label}</span>
                      {getSortIcon(getSortDirection(key))}
                    </button>
                  ) : (
                    <span>{label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <tr 
                key={activity.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-[#181D27] font-semibold">
                  {activity.user}
                </td>
                <td className="px-6 py-4 text-sm capitalize text-[#535862]">
                  {activity.role}
                </td>
                <td className="px-6 py-4 text-sm text-[#535862]">
                  {activity.action}
                </td>
                <td className="px-6 py-4 text-right text-sm text-[#535862]">
                  <div className="text-xs text-[#535862]">
                    {activity.timestamp.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div>
                    {activity.timestamp.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-[#FCFCFC]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Page 1 of 10</span>
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[8px] hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[8px] hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogTab;
