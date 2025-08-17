import React from 'react';

export default function FundWalletComponent() {
  return (
    <>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Omora Wallet</h1>
          <p className="text-gray-600 text-lg">Secure long-term returns and grow your crypto holdings</p>
        </div>

        {/* Wallet Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* USDT Account */}
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">USDT Account</h3>
              <p className="text-xs text-gray-400 mb-4">Current balance</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-gray-900">0</span>
                <span className="text-xl font-semibold text-gray-600 mb-1">USDT</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Withdraw
              </button>
              <button className="flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Convert
              </button>
            </div>
          </div>

          {/* Naira Account */}
          <div className="bg-white rounded-xl p-8 border border-gray-200 relative">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Naira Account</h3>
              <p className="text-xs text-gray-400 mb-4">Current balance</p>
              <div className="flex items-end gap-3">
                <span className="text-xl font-semibold text-gray-600 mb-1">₦</span>
                <span className="text-4xl font-bold text-gray-900">0</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700">
                Fund Wallet
              </button>
              <button className="flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Withdraw
              </button>
              <button className="flex-1 px-4 py-2 text-gray-500 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="mb-16">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Conversion Rate:</span> 1 USDT = ₦1,3800
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">© 2025 OMORA. All rights reserved.</p>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700">
          <span className="text-white font-bold text-lg">J</span>
        </button>
      </div>
    </>
  );
}