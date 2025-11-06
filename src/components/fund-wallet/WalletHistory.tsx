"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiDownloadCloud, FiSearch, FiCalendar } from "react-icons/fi";
import { LuChevronsUpDown } from "react-icons/lu";
import CalendarDatePicker from "./Calender";

interface Transaction {
  id: number;
  type: string;
  source: string;
  amount: string;
  timestamp: string;
  status: string;
  date: Date;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "Funding",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
    date: new Date("2025-07-15T12:00:00"),
  },
  {
    id: 2,
    type: "Conversion",
    source: "USDT - Naira",
    amount: "5,000 USDT",
    timestamp: "12:00pm\n10th July, 2025",
    status: "Cancelled",
    date: new Date("2025-07-10T12:00:00"),
  },
  {
    id: 3,
    type: "Withdrawal",
    source: "Omora - Stanbic",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n5th July, 2025",
    status: "Pending",
    date: new Date("2025-07-05T12:00:00"),
  },
  {
    id: 4,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n1st July, 2025",
    status: "Complete",
    date: new Date("2025-07-01T12:00:00"),
  },
  {
    id: 5,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n25th June, 2025",
    status: "Complete",
    date: new Date("2025-06-25T12:00:00"),
  },
  {
    id: 6,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n20th June, 2025",
    status: "Complete",
    date: new Date("2025-06-20T12:00:00"),
  },
  {
    id: 7,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th June, 2025",
    status: "Complete",
    date: new Date("2025-06-15T12:00:00"),
  },
];

const getStatusColor = (status: string): string => {
  return "text-gray-700";
};

const getStatusDotColor = (status: string): string => {
  switch (status) {
    case "Complete":
      return "bg-green-600";
    case "Pending":
      return "bg-yellow-600";
    case "Cancelled":
      return "bg-red-600";
    default:
      return "bg-gray-600";
  }
};

const needsDivider = (transactions: Transaction[], index: number): boolean => {
  if (index === transactions.length - 1) return false;
  return transactions[index].type !== transactions[index + 1].type;
};

export default function WalletHistory() {
  const [activeFilter, setActiveFilter] = useState<string>("View all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const filters = ["View all", "Funding", "Conversion", "Withdrawal"] as const;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTypeDropdown(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesFilter =
      activeFilter === "View all" || transaction.type === activeFilter;
    const matchesSearch =
      transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (startDate && endDate) {
      const transactionDate = transaction.date;
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = transactionDate >= start && transactionDate <= end;
    }

    const matchesType = selectedType ? transaction.type === selectedType : true;
    const matchesStatus = selectedStatus ? transaction.status === selectedStatus : true;

    return matchesFilter && matchesSearch && matchesDate && matchesType && matchesStatus;
  });

  const handleDownloadStatement = () => {
    const headers = [
      "Transaction Type",
      "Source & Destination",
      "Amount",
      "Timestamp",
      "Status",
    ];

    const csvRows = [
      headers.join(","),
      ...filteredTransactions.map((transaction) => {
        const cleanTimestamp = transaction.timestamp.replace(/\n/g, " ");
        return [
          transaction.type,
          `"${transaction.source}"`,
          `"${transaction.amount}"`,
          `"${cleanTimestamp}"`,
          transaction.status,
        ].join(",");
      }),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split("T")[0];
    const filename = `wallet-statement-${date}.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApplyDateFilter = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
  };

  const handleClearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Wallet History</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="bg-gray-50 p-1 rounded-xl border border-gray-200">
            <div className="flex rounded-lg overflow-hidden">
              {filters.map((filter, index) => (
                <React.Fragment key={filter}>
                  <button
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${
                      activeFilter === filter
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {filter}
                  </button>
                  {index < filters.length - 1 && <div className="mx-1"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                ⌘K
              </span>
            </div>
            <button
              onClick={handleDownloadStatement}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiDownloadCloud className="w-4 h-4" />
              Download Statement
            </button>
          </div>
        </div>

        {startDate && endDate && (
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-teal-50 text-teal-700 border border-teal-200">
              <FiCalendar className="w-3.5 h-3.5 mr-1.5" />
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              <button
                onClick={handleClearDateFilter}
                className="ml-2 text-teal-600 hover:text-teal-800"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {(selectedType || selectedStatus) && (
          <div className="mb-4 flex items-center gap-2">
            {selectedType && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-teal-50 text-teal-700 border border-teal-200">
                Type: {selectedType}
                <button
                  onClick={() => setSelectedType(null)}
                  className="ml-2 text-teal-600 hover:text-teal-800"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-teal-50 text-teal-700 border border-teal-200">
                Status: {selectedStatus}
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="ml-2 text-teal-600 hover:text-teal-800"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-y border-gray-200">
              <tr>
                <th className="text-left py-3 pr-6 text-sm text-gray-500 font-medium w-1/2">
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Transaction Type</span>
                      <LuChevronsUpDown className="w-3 h-3" />
                    </button>
                    
                    {showTypeDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedType(null);
                              setShowTypeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!selectedType ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            All Types
                          </button>
                          <button
                            onClick={() => {
                              setSelectedType("Funding");
                              setShowTypeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedType === "Funding" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Funding
                          </button>
                          <button
                            onClick={() => {
                              setSelectedType("Conversion");
                              setShowTypeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedType === "Conversion" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Conversion
                          </button>
                          <button
                            onClick={() => {
                              setSelectedType("Withdrawal");
                              setShowTypeDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedType === "Withdrawal" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Withdrawal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <span>Source & Destination</span>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <span>Amount</span>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="relative" ref={datePickerRef}>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Time stamp</span>
                      <LuChevronsUpDown className="w-3 h-3" />
                    </button>

                    {showDatePicker && (
                      <div className="absolute top-full right-0 mt-2 z-50">
                        <CalendarDatePicker
                          onApply={handleApplyDateFilter}
                          onCancel={() => setShowDatePicker(false)}
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="relative" ref={statusDropdownRef}>
                    <button
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Status</span>
                      <LuChevronsUpDown className="w-3 h-3" />
                    </button>
                    
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setSelectedStatus(null);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${!selectedStatus ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            All Statuses
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStatus("Complete");
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedStatus === "Complete" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStatus("Pending");
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedStatus === "Pending" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStatus("Cancelled");
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedStatus === "Cancelled" ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}`}
                          >
                            Cancelled
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <tr className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                    <td className="py-2 pr-6 text-sm text-gray-900">
                      {transaction.type}
                    </td>
                    <td className="py-2 px-6 text-sm text-gray-600">
                      {transaction.source}
                    </td>
                    <td className="py-2 px-6 text-sm text-gray-900 font-medium">
                      {transaction.amount}
                    </td>
                    <td className="py-2 px-6 text-sm text-gray-600">
                      <div className="whitespace-pre-line">
                        {transaction.timestamp}
                      </div>
                    </td>
                    <td className="py-2 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(transaction.status)}`}
                        ></div>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                  {needsDivider(filteredTransactions, index) && (
                    <tr>
                      <td colSpan={5} className="py-1">
                        <div className="border-t border-gray-200"></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No transactions found matching your criteria.
            </p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">Page 1 of 10</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}