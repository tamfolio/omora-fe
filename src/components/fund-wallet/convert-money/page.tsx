"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import Logo from "@/components/ui/Logo";
import AuthenticatorModal from './authenticator-modal/page';

// Mock conversion rates - replace with API call later
const CONVERSION_RATES: Record<string, number> = {
  'NGN-USDT': 0.00063738, // 1 NGN = 0.00063738 USDT
  'USDT-NGN': 1568.50,    // 1 USDT = 1568.50 NGN  
  'NGN-USDC': 0.00063,    // 1 NGN = 0.00063 USDC
  'USDT-USDC': 0.9988,    // 1 USDT = 0.9988 USDC
  'USDC-USDT': 1.0012     // 1 USDC = 1.0012 USDT
};

const CURRENCIES = [
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'USDT', name: 'Tether USD', symbol: 'USDT' },
  { code: 'USDC', name: 'USD Coin', symbol: 'USDC' }
];

const CONVERSION_FEE_PERCENTAGE = 0.5; // 0.5% fee

export default function ConvertMoney() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the initial currency from URL params
  const initialCurrency = searchParams.get('from') || 'NGN';
  
  const [fromCurrency, setFromCurrency] = useState(initialCurrency);
  const [toCurrency, setToCurrency] = useState(
    initialCurrency === 'NGN' ? 'USDT' : 
    initialCurrency === 'USDT' ? 'NGN' : 
    'USDT' // Default for USDC → USDT
  );
  const [fromAmount, setFromAmount] = useState('12000');
  const [toAmount, setToAmount] = useState('7.57');
  const [conversionRate, setConversionRate] = useState(0);
  const [conversionFee, setConversionFee] = useState(0);
  const [amountToConvert, setAmountToConvert] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Calculate conversion when currencies or amount change
  useEffect(() => {
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const rate = CONVERSION_RATES[rateKey] || 0;
    const amount = parseFloat(fromAmount) || 0;
    
    if (rate && amount) {
      const convertedAmount = amount * rate;
      const fee = amount * (CONVERSION_FEE_PERCENTAGE / 100);
      const finalAmount = fromCurrency === 'NGN' ? convertedAmount : convertedAmount - (fee * rate);
      
      setToAmount(finalAmount.toFixed(2));
      setConversionRate(rate);
      setConversionFee(fee);
      setAmountToConvert(amount - (fromCurrency === 'NGN' ? fee : 0));
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const handleCurrencySwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  const getAvailableToCurrencies = (from: string) => {
    switch (from) {
      case 'NGN':
        return CURRENCIES.filter(c => c.code === 'USDT' || c.code === 'USDC');
      case 'USDT':
        return CURRENCIES.filter(c => c.code === 'NGN' || c.code === 'USDC');
      case 'USDC':
        return CURRENCIES.filter(c => c.code === 'USDT'); // Only USDC → USDT allowed
      default:
        return [];
    }
  };

  const handleVerify = (code: string) => {
    // Handle authentication verification
    console.log('Verifying code:', code);
    console.log('Converting...', { fromCurrency, toCurrency, fromAmount, toAmount });
    
    // Navigate to review transaction page with conversion data
    const params = new URLSearchParams({
      from: fromCurrency,
      to: toCurrency,
      amount: fromAmount,
      toAmount: toAmount
    });
    
    router.push(`/dashboard/fund-wallet/convert-money/review-transaction?${params.toString()}`);
  };

  const formatAmount = (amount: number, currency: string) => {
    const currencyData = CURRENCIES.find(c => c.code === currency);
    return `${currencyData?.symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <Logo width={120} height={32} />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Step 1/2</p>
              <h2 className="text-lg font-semibold text-gray-700">Enter Details</h2>
            </div>
            {/* Circular Progress */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                {/* Progress circle (40% = 144 degrees) */}
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeDasharray="40, 100"
                  strokeLinecap="round"
                />
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">40%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Convert Money</h1>
            <p className="text-gray-600">Enter amount and select currency to convert to</p>
          </div>

          {/* From Currency Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to convert <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex">
                <div className="relative">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-3 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {CURRENCIES.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-right font-medium"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bal: {fromCurrency} 1,567,192
              </p>
            </div>

            {/* Conversion Details */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Conversion Fee:</span>
                <span>{conversionFee.toFixed(0)} {fromCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount we'll convert:</span>
                <span>{formatAmount(amountToConvert, fromCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Today's Rate:</span>
                <span>₦1 = ${conversionRate.toFixed(12)}</span>
              </div>
            </div>
          </div>

          {/* To Currency Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount you'll receive <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex">
                <div className="relative">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-300 rounded-l-lg px-4 py-3 pr-8 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    {getAvailableToCurrencies(fromCurrency).map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={toAmount}
                  readOnly
                  className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-right font-medium text-gray-900"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Bal: ${toCurrency} 0.00
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition-colors"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Continue
          </button>
        </div>
      </main>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-500">© 2025 OMORA. All rights reserved.</p>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <span className="text-white font-bold text-lg">J</span>
        </button>
      </div>

      {/* Authenticator Modal */}
      <AuthenticatorModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onVerify={handleVerify}
        conversionData={{
          fromCurrency,
          toCurrency,
          fromAmount,
          toAmount
        }}
      />
    </div>
  );
}