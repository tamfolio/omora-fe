"use client"
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { CiBank } from "react-icons/ci";
import { useState } from 'react';
import NavBar from '@/components/fund-wallet/Navbar';

export default function CompleteYourDeposit() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '1,000,000';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br 8 from-slate-50 via-white to-teal-50">
      {/* Navigation */}
      <NavBar />
      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-4">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 animate-fade-in-up">
          {/* Title */}
          <div className=" mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Complete your deposit</h1>
            <p className="text-sm text-gray-600">Use the following details to complete your payment.</p>
          </div>

          {/* Bank Transfer Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg flex items-center justify-center">
                 <CiBank className='w-6 h-6' /> 
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Bank Transfer</h3>
                  <p className="text-xs text-gray-600">Secure payment</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total to pay</span>
                <p className="font-bold text-base text-gray-900">NGN {parseFloat(amount).toLocaleString()}.00</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1">Account number</label>
                <div className="relative">
                  <input
                    type="text"
                    value="3456789010"
                    readOnly
                    className="w-full  py-2 text-gray-900 font-mono text-sm  transition-colors duration-200"
                  />
                  <button 
                    onClick={() => handleCopy('3456789010', 'account')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                  >
                    {copiedField === 'account' ? (
                      <FiCheck className="w-3 h-3 text-green-600" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1">Bank</label>
                <div className="relative">
                  <input
                    type="text"
                    value="Stanbic IBTC Bank"
                    readOnly
                    className="w-full py-2 text-gray-900 text-sm  transition-colors duration-200"
                  />
                  <button 
                    onClick={() => handleCopy('Stanbic IBTC Bank', 'bank')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                  >
                    {copiedField === 'bank' ? (
                      <FiCheck className="w-3 h-3 text-green-600" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1">Account name</label>
                <div className="relative">
                  <input
                    type="text"
                    value="Anita Odeka"
                    readOnly
                    className="w-full py-2 text-gray-900 text-sm  transition-colors duration-200"
                  />
                  <button 
                    onClick={() => handleCopy('Anita Odeka', 'name')}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-all duration-200"
                  >
                    {copiedField === 'name' ? (
                      <FiCheck className="w-3 h-3 text-green-600" />
                    ) : (
                      <FiCopy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <h4 className="font-semibold text-center text- text-gray-900 mb-2 text-sm">Instructions</h4>
            <div className="rounded-lg p-3">
              <p className="text-xs text-center font-medium mb-1 text-gray-800">
                The payment details are only valid for this deposit. Ensure to complete your payment before it expires.
              </p>
              <p className="text-xs text-center text-gray-600">
                In case of any issues or concerns, please contact our support team.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white py-2.5 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200">
            I've sent the money
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center py-3">
          <p className="text-xs text-gray-500">© 2025 OMORA. All rights reserved.</p>
        </footer>
      </main>

      {/* Floating Chat Button */}
       <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700">
          <span className="text-white font-bold text-lg">J</span>
        </button>
      </div>
    </div>
  );
}