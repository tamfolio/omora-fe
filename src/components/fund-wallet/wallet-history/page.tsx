"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMoreVertical } from 'react-icons/fi';
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

const getStatusColor = (status: string): string => {
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

const getStatusDotColor = (status: string): string => {
  switch (status) {
    case 'Complete':
      return 'bg-green-600';
    case 'Pending':
      return 'bg-yellow-600';
    case 'Cancelled':
      return 'bg-red-600';
    default:
      return 'bg-gray-600';
  }
};

export default function WalletHistory() {
  const [activeFilter, setActiveFilter] = useState<string>('View all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const filters = ['View all', 'Funding', 'Conversion', 'Withdrawal'] as const;

  const handleViewReceipt = (transaction: Transaction): void => {
    // Determine currency for withdrawal transactions
    const currency = transaction.source.includes('USDT') ? 'USDT' : 'NGN';
    
    // Navigate to transaction receipt with appropriate parameters
    const params = new URLSearchParams({
      type: transaction.type.toLowerCase(),
      id: transaction.id.toString(),
      ...(transaction.type === 'Withdrawal' && { currency })
    });
    
    router.push(`/dashboard/fund-wallet/transaction-receipt?${params.toString()}`);
  };

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesFilter = activeFilter === 'View all' || transaction.type === activeFilter;
    const matchesSearch = transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {filter}
                  </button>
                  {index < filters.length - 1 && (
                    <div className="mx-1"></div>
                  )}
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
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘K</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-y border-gray-200">
              <tr>
                <th className="text-left py-3 pr-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Transaction Type</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Source & Destination</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Amount</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Time stamp</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left py-3 px-6 text-sm text-gray-500 font-medium">
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <LuChevronsUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                  <td className="py-4 pr-6 text-sm text-gray-900">
                    {transaction.type}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {transaction.source}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {transaction.amount}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="whitespace-pre-line">{transaction.timestamp}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDotColor(transaction.status)}`}></div>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleViewReceipt(transaction)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Receipt"
                        aria-label={`View receipt for ${transaction.type} transaction`}
                      >
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page 1 of 10
            </div>
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