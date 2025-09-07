"use client";

import { useState } from "react";
import PortfolioBreakdown from "./portfolio-breakdown/page";
import DCAModal from "./dca-modal/page";

export default function Portfolio() {
  const [isDCAPaused, setIsDCAPaused] = useState(false);
  const [showDCAModal, setShowDCAModal] = useState(false);

  const handleDCAToggle = () => {
    setShowDCAModal(true);
  };

  const confirmDCAAction = () => {
    setIsDCAPaused(!isDCAPaused);
    setShowDCAModal(false);
  };

  const cancelDCAAction = () => {
    setShowDCAModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Portfolio Overview
        </h1>
        <p className="text-gray-600">
          Secure long-term returns and grow your crypto holdings.
        </p>
      </div>

      {/* Risk Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900">
            Based on your Risk Profile
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500"></div>
              <span className="text-sm">Recurring Investment ON</span>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
              Conservative ETF
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Overview Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Portfolio Overview
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Today&apos;s Realized PnL
            </span>
            <span className="text-sm text-green-600">+0.00 (+0.00%)</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Wallet Balances */}
          <div className="col-span-8">
            <div className="grid grid-cols-3 gap-8 mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Wallet Balance (USDC)
                </div>
                <div className="text-2xl font-bold text-gray-900">1000.56</div>
                <div className="text-sm text-gray-500">≈ $1000</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Wallet Balance (NGN)
                </div>
                <div className="text-2xl font-bold text-gray-900">200,000</div>
                <div className="text-sm text-gray-500">≈ $105.22</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Wallet Balance (USDT)
                </div>
                <div className="text-2xl font-bold text-gray-900">200,000</div>
                <div className="text-sm text-gray-500">≈ $105.22</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Conversion Rate: 1 USD = ₦1,3800
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                Charges
              </button>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="col-span-4 border-l border-gray-200 pl-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Asset Allocation
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* First Column */}
              <div className="space-y-4">
                {[
                  {
                    symbol: "BTC",
                    percent: "45%",
                    value: "$56,631",
                    change: "+8.2%",
                    color: "bg-blue-500",
                  },
                  {
                    symbol: "ETH",
                    percent: "45%",
                    value: "$56,631",
                    change: "+8.2%",
                    color: "bg-orange-500",
                  },
                  {
                    symbol: "LTC",
                    percent: "45%",
                    value: "$56,631",
                    change: "-8.2%",
                    color: "bg-green-500",
                  },
                  {
                    symbol: "XRP",
                    percent: "45%",
                    value: "$56,631",
                    change: "+8.2%",
                    color: "bg-red-500",
                  },
                ].map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${asset.color} rounded-full`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {asset.symbol} ({asset.percent})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.value}
                      </div>
                      <div
                        className={`text-xs ${asset.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {asset.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Second Column */}
              <div className="space-y-4">
                {[
                  {
                    symbol: "SOL",
                    percent: "45%",
                    value: "$56,631",
                    change: "-8.2%",
                    color: "bg-purple-500",
                  },
                  {
                    symbol: "SUI",
                    percent: "45%",
                    value: "$56,631",
                    change: "-8.2%",
                    color: "bg-indigo-500",
                  },
                  {
                    symbol: "CRO",
                    percent: "45%",
                    value: "$56,631",
                    change: "-8.2%",
                    color: "bg-blue-400",
                  },
                  {
                    symbol: "AVAX",
                    percent: "45%",
                    value: "$56,631",
                    change: "-8.2%",
                    color: "bg-red-400",
                  },
                ].map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${asset.color} rounded-full`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {asset.symbol} ({asset.percent})
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {asset.value}
                      </div>
                      <div
                        className={`text-xs ${asset.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {asset.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PortfolioBreakdown />

      {/* DCA Modal */}
      <DCAModal
        isOpen={showDCAModal}
        isDCAPaused={isDCAPaused}
        onConfirm={confirmDCAAction}
        onCancel={cancelDCAAction}
      />
    </div>
  );
}
