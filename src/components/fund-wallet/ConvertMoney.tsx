"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft, FiChevronDown, FiHeadphones } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import AuthenticatorModal from "./AuthenticatorModal";

// Mock conversion rates - replace with API call later
const CONVERSION_RATES: Record<string, number> = {
  "NGN-USDT": 0.00063738, // 1 NGN = 0.00063738 USDT
  "USDT-NGN": 1568.5, // 1 USDT = 1568.50 NGN
  "NGN-USDC": 0.00063, // 1 NGN = 0.00063 USDC
  "USDT-USDC": 0.9988, // 1 USDT = 0.9988 USDC
  "USDC-USDT": 1.0012, // 1 USDC = 1.0012 USDT
};

const CURRENCIES = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "NGN", 
    logo: "/assets/images/currencies/naira.png",
  },
  {
    code: "USDT",
    name: "Tether USD",
    symbol: "USDT",
    logo: "/assets/images/currencies/tether.png",
  },
  {
    code: "USDC",
    name: "USDC Coin",
    symbol: "USDC",
    logo: "/assets/images/currencies/usdc.png",
  },
];

const CONVERSION_FEE_PERCENTAGE = 0.5; // 0.5% fee

const MOCK_BALANCES = {
  NGN: 21997.42,
  USDT: 13.45,
  USDC: 8.92,
};

const getCurrencyLogo = (code: string): string => {
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency?.logo || "/images/currencies/placeholder.png";
};

const getCurrencySymbol = (code: string): string => {
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency?.symbol || code;
};

const getFormattedBalance = (currencyCode: string): string => {
  const balance =
    MOCK_BALANCES[currencyCode as keyof typeof MOCK_BALANCES] || 0;
  const currency = CURRENCIES.find((c) => c.code === currencyCode);
  return `${currency?.symbol || ""} ${balance.toLocaleString()}`;
};

export default function ConvertMoney() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the initial currency from URL params
  const initialCurrency = searchParams.get("from") || "NGN";

  const [fromCurrency, setFromCurrency] = useState(initialCurrency);
  const [toCurrency, setToCurrency] = useState(
    initialCurrency === "NGN"
      ? "USDT"
      : initialCurrency === "USDT"
        ? "NGN"
        : "USDT"
  );
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [conversionFee, setConversionFee] = useState(0);
  const [amountToConvert, setAmountToConvert] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [acceptedRate, setAcceptedRate] = useState(false);

  // Calculate conversion when currencies or amount change
  useEffect(() => {
    const rateKey = `${fromCurrency}-${toCurrency}`;
    const rate = CONVERSION_RATES[rateKey] || 0;
    const amount = parseFloat(fromAmount) || 0;

    if (rate && amount) {
      const convertedAmount = amount * rate;
      const fee = amount * (CONVERSION_FEE_PERCENTAGE / 100);
      const finalAmount =
        fromCurrency === "NGN" ? convertedAmount : convertedAmount - fee * rate;

      setToAmount(finalAmount.toFixed(2));
      setConversionRate(rate);
      setConversionFee(fee);
      setAmountToConvert(amount - (fromCurrency === "NGN" ? fee : 0));
    } else if (!rate && amount) {
      // Reset if invalid conversion pair
      setToAmount("0");
      setConversionRate(0);
    } else {
      // Reset everything if no amount
      setToAmount("");
      setConversionRate(0);
      setConversionFee(0);
      setAmountToConvert(0);
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const getAvailableToCurrencies = (from: string) => {
    switch (from) {
      case "NGN":
        return CURRENCIES.filter((c) => c.code === "USDT" || c.code === "USDC");
      case "USDT":
        return CURRENCIES.filter((c) => c.code === "NGN" || c.code === "USDC");
      case "USDC":
        return CURRENCIES.filter((c) => c.code === "USDT");
      default:
        return [];
    }
  };

  const handleVerify = (code: string) => {
    // Handle authentication verification
    console.log("Verifying code:", code);
    console.log("Converting...", {
      fromCurrency,
      toCurrency,
      fromAmount,
      toAmount,
    });

    // Navigate to review transaction page with conversion data

    const params = new URLSearchParams({
      from: fromCurrency,
      to: toCurrency,
      amount: fromAmount,
      toAmount: toAmount,
    });

    router.push(
      `/dashboard/fund-wallet/convert-money/review-transaction?${params.toString()}`
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    const currencyData = CURRENCIES.find((c) => c.code === currency);
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
              <h2 className="text-lg font-semibold text-gray-700">
                Enter Details
              </h2>
            </div>
            {/* Circular Progress */}
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
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
      <main className="max-w-lg mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Convert Money
            </h1>
            <p className="text-sm text-gray-600">
              Enter amount and select currency to convert to
            </p>
          </div>

          {/* From Currency Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to convert <span className="text-red-500">*</span>
            </label>
            <div className="relative border border-gray-300 rounded-xl bg-white">
              <div className="flex items-center">
                {/* Currency Selector with Logo/Flag */}
                <div className="flex flex-col gap-1 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src={getCurrencyLogo(fromCurrency)}
                        alt={`${fromCurrency} logo`}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                        className="appearance-none bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900 pr-6"
                      >
                        {CURRENCIES.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.code}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bal: {getFormattedBalance(fromCurrency)}
                  </p>
                </div>

                {/* Amount Input */}
                <div className="flex-1 px-4 py-3">
                  <input
                    type="text"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="w-full border-none focus:outline-none text-right font-semibold text-xl text-gray-900 bg-transparent"
                    placeholder={`${getCurrencySymbol(fromCurrency)} 0`}
                  />
                </div>
              </div>
            </div>

            {/* Conversion Details */}
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Conversion Fee:</span>
                <span>
                  {conversionFee.toFixed(0)} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount we&apos;ll convert:</span>
                <span>{formatAmount(amountToConvert, fromCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Today&apos;s Rate:</span>
                <span>
                  {fromCurrency === "NGN"
                    ? `#1 = $${conversionRate.toFixed(12)}`
                    : `$1 = #${conversionRate.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>

          {/* To Currency Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount you&apos;ll receive <span className="text-red-500">*</span>
            </label>
            <div className="relative border border-gray-300 rounded-xl bg-gray-50">
              <div className="flex items-center">
                {/* Currency Selector with Logo/Flag */}
                <div className="flex flex-col gap-1 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src={getCurrencyLogo(toCurrency)}
                        alt={`${toCurrency} logo`}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                        className="appearance-none bg-transparent border-none focus:outline-none text-sm font-medium text-gray-900 pr-6"
                      >
                        {getAvailableToCurrencies(fromCurrency).map(
                          (currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code}
                            </option>
                          )
                        )}
                      </select>
                      <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bal: {getFormattedBalance(toCurrency)}
                  </p>
                </div>

                {/* Amount Display */}
                <div className="flex-1 px-4 py-3">
                  <input
                    type="text"
                    value={toAmount}
                    readOnly
                    className="w-full border-none focus:outline-none text-right font-semibold text-xl text-gray-900 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FX Rate Acceptance */}
          <div className="flex items-center gap-2 mt-2 mb-4">
            <input
              type="checkbox"
              id="acceptRate"
              checked={acceptedRate}
              onChange={(e) => setAcceptedRate(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="acceptRate" className="text-sm text-gray-600">
              I accept the current market conversion rate & fees
            </label>
          </div>

          {/* Continue Button */}
          <button
            className={`w-full ${
              acceptedRate
                ? "bg-teal-600 hover:bg-teal-700"
                : "bg-gray-300 cursor-not-allowed"
            } text-white py-3 rounded-lg font-medium transition-colors`}
            onClick={() => setIsAuthModalOpen(true)}
            disabled={!acceptedRate}
          >
            Continue
          </button>
        </div>
      </main>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <FiHeadphones className="text-white text-lg" />
        </button>
      </div>

      {/* Authenticator Modal */}
      <AuthenticatorModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onVerify={handleVerify}
      />
    </div>
  );
}
