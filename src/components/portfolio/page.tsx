'use client'

import { useState } from 'react'
import { FaRegCirclePause, FaRegCirclePlay } from "react-icons/fa6"
import PortfolioBreakdown from './portfolio-breakdown/page'
import DCAModal from './dca-modal/page'

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState('portfolio-breakdown')
  const [isDCAPaused, setIsDCAPaused] = useState(true)
  const [showDCAModal, setShowDCAModal] = useState(false)

  const handleDCAToggle = () => {
    setShowDCAModal(true)
  }

  const confirmDCAAction = () => {
    setIsDCAPaused(!isDCAPaused)
    setShowDCAModal(false)
  }

  const cancelDCAAction = () => {
    setShowDCAModal(false)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Overview</h1>
        <p className="text-gray-600">Secure long-term returns and grow your crypto holdings.</p>
      </div>

      {/* Risk Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900 font-semibold">Based on your Risk Profile</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDCAToggle}
              className={`flex items-center gap-2 border px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isDCAPaused 
                  ? 'bg-orange-50 border-orange-200 text-orange-700'
                  : 'bg-green-50 border-green-200 text-green-700'
              }`}
            >
              {isDCAPaused ? (
                <FaRegCirclePause className="w-4 h-4 text-orange-500 fill-orange-500" />
              ) : (
                <FaRegCirclePlay className="w-4 h-4 text-green-500 fill-green-500" />
              )}
              <span>DCA {isDCAPaused ? 'Paused' : 'Active'}</span>
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full transition-colors">
              Conservative
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-2 gap-8 divide-x divide-gray-200">
          {/* Left Half - Wallet Balances */}
          <div className="pr-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Overview</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Today's Realized PnL</span>
                <span className="text-sm text-green-600 font-medium">+0.00 (+0.00%)</span>
              </div>
            </div>
            
            {/* Wallet Balances */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Wallet Balance (USDT)</div>
                <div className="text-2xl font-bold text-gray-900">1000.56</div>
                <div className="text-sm text-gray-500">≈ $1000</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Wallet Balance (NGN)</div>
                <div className="text-2xl font-bold text-gray-900">200,000</div>
                <div className="text-sm text-gray-500">≈ $105.22</div>
              </div>
            </div>
            
            {/* Conversion Rate and Charges */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-sm text-gray-600">Conversion Rate: 1 USDT = ₦1,3800</div>
              </div>
              
              <div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Charges</button>
              </div>
            </div>
          </div>

          {/* Right Half - Asset Allocation */}
          <div className="pl-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
            
            <div className="space-y-3">
              {/* BTC */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">BTC (42%)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">$56,631</div>
                  <div className="text-xs text-green-600">+8.2%</div>
                </div>
              </div>

              {/* ETH */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">ETH (45%)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">$56,631</div>
                  <div className="text-xs text-green-600">+8.2%</div>
                </div>
              </div>

              {/* LTC */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">LTC (49%)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">$56,631</div>
                  <div className="text-xs text-green-600">+8.2%</div>
                </div>
              </div>

              {/* XRP */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">XRP (45%)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">$56,631</div>
                  <div className="text-xs text-red-600">-8.2%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Breakdown Section */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('portfolio-breakdown')}
                className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'portfolio-breakdown' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Portfolio Breakdown
              </button>
              <button 
                onClick={() => setActiveTab('investment-activity')}
                className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'investment-activity' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Investment Activity
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Next DCA <span className="font-medium">18h:23m</span>
              </div>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <span>Export</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'portfolio-breakdown' && <PortfolioBreakdown />}
          {activeTab === 'investment-activity' && (
            <div className="text-center py-8 text-gray-500">
              Investment Activity content goes here
            </div>
          )}
        </div>
      </div>

      {/* DCA Modal */}
      <DCAModal 
        isOpen={showDCAModal}
        isDCAPaused={isDCAPaused}
        onConfirm={confirmDCAAction}
        onCancel={cancelDCAAction}
      />
    </div>
  )
}