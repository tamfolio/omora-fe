'use client'

import { useState } from 'react'

const cryptoAssets = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    iconBg: 'bg-orange-500',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    iconBg: 'bg-blue-600',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'XRP',
    symbol: 'XRP',
    icon: 'X',
    iconBg: 'bg-gray-800',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    icon: 'S',
    iconBg: 'bg-purple-600',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    icon: 'D',
    iconBg: 'bg-yellow-500',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    icon: 'A',
    iconBg: 'bg-blue-500',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    icon: 'A',
    iconBg: 'bg-red-500',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    icon: 'L',
    iconBg: 'bg-gray-600',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    icon: 'U',
    iconBg: 'bg-pink-500',
    date: '01/01/2025',
    amount: '$118,792',
    fxRate: '$118,792'
  }
]

export default function PortfolioBreakdown() {
  const [activeTimeframe, setActiveTimeframe] = useState('all-time')

  return (
    <div>
      {/* Time Filter Tabs */}
      <div className="flex items-center gap-1 mb-6">
        <button 
          onClick={() => setActiveTimeframe('all-time')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTimeframe === 'all-time' 
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All Time
        </button>
        <button 
          onClick={() => setActiveTimeframe('daily')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTimeframe === 'daily' 
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Daily
        </button>
        <button 
          onClick={() => setActiveTimeframe('mtd')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTimeframe === 'mtd' 
              ? 'bg-blue-50 text-blue-600 border border-blue-200' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Month-to-date (MTD)
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Token Purchased</th>
              <th className="text-left text-sm font-medium text-gray-600 pb-3">Date</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Amount per Token</th>
              <th className="text-right text-sm font-medium text-gray-600 pb-3">Fx Rate Used</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cryptoAssets.map((asset, index) => (
              <tr key={index} className="group hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${asset.iconBg} flex items-center justify-center text-white text-sm font-bold`}>
                      {asset.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{asset.name}</div>
                      <div className="text-sm text-gray-500">{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-600">{asset.date}</td>
                <td className="py-4 text-right text-gray-900 font-medium">{asset.amount}</td>
                <td className="py-4 text-right text-gray-600">{asset.fxRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}