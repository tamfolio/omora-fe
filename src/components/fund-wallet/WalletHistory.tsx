"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { IoFilterOutline } from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";

// Transaction type definition
interface Transaction {
  id: number;
  type: string;
  source: string;
  amount: string;
  timestamp: string;
  status: string;
}

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "Funding",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
  },
  {
    id: 2,
    type: "Conversion",
    source: "USDT - Naira",
    amount: "5,000 USDT",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Cancelled",
  },
  {
    id: 3,
    type: "Withdrawal",
    source: "Omora - Stanbic",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Pending",
  },
  {
    id: 4,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
  },
  {
    id: 5,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
  },
  {
    id: 6,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
  },
  {
    id: 7,
    type: "Withdrawal",
    source: "Stanbic - Omora",
    amount: "₦ 50,000",
    timestamp: "12:00pm\n15th July, 2025",
    status: "Complete",
  },
];

const getStatusColor = (status: string): string => {
  return "text-gray-700"; // Removed bg and text color variations
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

// Helper function to check if we need a divider
const needsDivider = (transactions: Transaction[], index: number): boolean => {
  if (index === transactions.length - 1) return false;
  return transactions[index].type !== transactions[index + 1].type;
};

export default function WalletHistory() {
  const [activeFilter, setActiveFilter] = useState<string>("View all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  const filters = ["View all", "Funding", "Conversion", "Withdrawal"] as const;

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesFilter =
      activeFilter === "View all" || transaction.type === activeFilter;
    const matchesSearch =
      transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Wallet History</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filters and Search */}
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
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-64"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                ⌘K
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              <IoFilterOutline className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-y border-gray-200">
              <tr>
                <th className="text-left py-3 pr-6 text-sm text-gray-500 font-medium w-1/2">
                  <div className="flex items-center gap-1">
                    <span>Transaction Type</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="flex items-center gap-1">
                    <span>Source & Destination</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="flex items-center gap-1">
                    <span>Time stamp</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium w-1/8">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <LuChevronsUpDown className="w-3 h-3" />
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

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No transactions found matching your criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">Page 1 of 10</div>
            <div className="flex gap-2">
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}