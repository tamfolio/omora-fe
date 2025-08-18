"use client"
import React, { useState } from 'react';
import { FiSearch, FiFilter, FiMoreHorizontal } from 'react-icons/fi';
import { LuChevronsUpDown } from "react-icons/lu";

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    type: 'Funding',
    source: 'Stanbic - Omora',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Complete'
  },
  {
    id: 2,
    type: 'Conversion',
    source: 'USDT - Naira',
    amount: '5,000 USDT',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Cancelled'
  },
  {
    id: 3,
    type: 'Withdrawal',
    source: 'Omora - Stanbic',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Pending'
  },
  {
    id: 4,
    type: 'Withdrawal',
    source: 'Stanbic - Omora',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Complete'
  },
  {
    id: 5,
    type: 'Withdrawal',
    source: 'Stanbic - Omora',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Complete'
  },
  {
    id: 6,
    type: 'Withdrawal',
    source: 'Stanbic - Omora',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Complete'
  },
  {
    id: 7,
    type: 'Withdrawal',
    source: 'Stanbic - Omora',
    amount: '₦ 50,000',
    timestamp: '12:00pm\n15th July, 2025',
    status: 'Complete'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Complete':
      return 'text-green-600 bg-green-50';
    case 'Pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'Cancelled':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function WalletHistory() {
  const [activeFilter, setActiveFilter] = useState('View all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['View all', 'Funding', 'Conversion', 'Withdrawal'];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesFilter = activeFilter === 'View all' || transaction.type === activeFilter;
    const matchesSearch = transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Wallet History</h2>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          {filters.map((filter, index) => (
            <React.Fragment key={filter}>
              <button
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-gray-300 text-gray-900'
                    : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
              {index < filters.length - 1 && (
                <div className="border-r border-gray-200"></div>
              )}
            </React.Fragment>
          ))}
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
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘K</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <FiFilter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-4 pr-6 text-sm text-gray-500 font-medium w-2/5 border-r border-gray-100">
                <div className="flex items-center gap-1">
                  <span>Transaction Type</span>
                  <LuChevronsUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left pb-4 pl-6 text-sm text-gray-500 font-medium w-1/6">
                <div className="flex items-center gap-1">
                  <span>Source & Destination</span>
                  <LuChevronsUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left pb-4 text-sm text-gray-500 font-medium w-1/8">
                <div className="flex items-center gap-1">
                  <span>Amount</span>
                  <LuChevronsUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left pb-4 text-sm text-gray-500 font-medium w-1/6">
                <div className="flex items-center gap-1">
                  <span>Time stamp</span>
                  <LuChevronsUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left pb-4 text-sm text-gray-500 font-medium w-1/8">
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <LuChevronsUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                <td className="py-4 pr-6 text-sm text-gray-900 border-r border-gray-50">
                  {transaction.type}
                </td>
                <td className="py-4 pl-6 text-sm text-gray-600">
                  {transaction.source}
                </td>
                <td className="py-4 text-sm text-gray-900 font-medium">
                  {transaction.amount}
                </td>
                <td className="py-4 text-sm text-gray-600">
                  <div className="whitespace-pre-line">{transaction.timestamp}</div>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center text-xs font-medium ${
                    transaction.status === 'Complete' ? 'text-green-600' : 
                    transaction.status === 'Pending' ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${transaction.status === 'Complete' ? 'bg-green-600' : transaction.status === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'}`}></div>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex justify-end">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <FiMoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Page 1 of 10
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}