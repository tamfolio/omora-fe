"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { FiArrowLeft, FiChevronDown, FiHeadphones } from "react-icons/fi";
import Logo from "@/components/ui/Logo";
import AuthenticatorModal from "./AuthenticatorModal";
import { useUserData } from "@/contexts/UserDataContext";

const CURRENCIES = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    logo: "/assets/images/currencies/naira.png",
  },
  {
    code: "USDT",
    name: "Tether USD",
    symbol: "$",
    logo: "/assets/images/currencies/tether.png",
  },
  {
    code: "USDC",
    name: "USDC Coin",
    symbol: "$",
    logo: "/assets/images/currencies/usdc.png",
  },
];

const getCurrencyLogo = (code: string): string => {
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency?.logo || "/images/currencies/placeholder.png";
};

const getCurrencySymbol = (code: string): string => {
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency?.symbol || code;
};

export default function ConvertMoney() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, loading: userLoading } = useUserData();

  const initialCurrency = searchParams.get("from") || "NGN";

  const [fromCurrency, setFromCurrency] = useState(initialCurrency);
  const [toCurrency, setToCurrency] = useState(
    initialCurrency === "NGN" ? "USDT" : "NGN",
  );
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [conversionFee, setConversionFee] = useState(0);
  const [amountToConvert, setAmountToConvert] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [acceptedRate, setAcceptedRate] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(false);

  const [apiCurrencies, setApiCurrencies] = useState<any[]>([]);

  const makePostRequest = async (
    endpoint: string,
    body: Record<string, any>,
  ) => {
    const response = await fetch(`/api/proxy${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  };

  const getDynamicBalance = (currencyCode: string): string => {
    if (!userData?.wallets || userData.wallets.length === 0) return "0.00";
    const wallet = userData.wallets.find(
      (w: any) => w.currency.toUpperCase() === currencyCode.toUpperCase(),
    );
    const balance = wallet?.availableBalance || 0;
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol} ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "/api/proxy/conversion/available-currencies",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setApiCurrencies(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch available currencies:", error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchConversionDetails = async () => {
      if (
        !fromAmount ||
        isNaN(parseFloat(fromAmount)) ||
        parseFloat(fromAmount) <= 0 ||
        fromCurrency === toCurrency
      ) {
        setToAmount("");
        setConversionRate(0);
        setAmountToConvert(0);
        return;
      }

      // NOW MAPPING USING shortName!
      const fromCurrObj = apiCurrencies.find(
        (c) => c.shortName?.toLowerCase() === fromCurrency.toLowerCase(),
      );
      const toCurrObj = apiCurrencies.find(
        (c) => c.shortName?.toLowerCase() === toCurrency.toLowerCase(),
      );

      const fromId = fromCurrObj?.id;
      const toId = toCurrObj?.id;

      if (fromId === undefined || toId === undefined) return;

      setFetchingRate(true);
      try {
        const [rateRes, estimateRes] = await Promise.all([
          makePostRequest("/conversion/market-rate", {
            fromCurrency: fromId,
            toCurrency: toId,
          }),
          makePostRequest("/conversion/estimate-funds", {
            fromCurrency: fromId,
            toCurrency: toId,
            amount: parseFloat(fromAmount),
          }),
        ]);

        if (rateRes.status === "success" && estimateRes.status === "success") {
          setConversionRate(rateRes.data?.rate || 0);
          setToAmount(estimateRes.data?.estimate?.toString() || "0");
          setAmountToConvert(parseFloat(fromAmount));
        }
      } catch (error) {
        console.error("Conversion fetch error:", error);
      } finally {
        setFetchingRate(false);
      }
    };

    const debounceTimer = setTimeout(fetchConversionDetails, 500);
    return () => clearTimeout(debounceTimer);
  }, [fromAmount, fromCurrency, toCurrency, apiCurrencies]);

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

  const handleFromCurrencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newFrom = e.target.value;
    setFromCurrency(newFrom);

    if (newFrom === toCurrency) {
      const available = getAvailableToCurrencies(newFrom);
      const nextValidTo =
        available.find((c) => c.code !== "USDC")?.code || available[0].code;
      setToCurrency(nextValidTo);
    }
  };

  const handleContinue = () => {
    // Map IDs using shortName just like before
    const fromCurrObj = apiCurrencies.find(
      (c) => c.shortName?.toLowerCase() === fromCurrency.toLowerCase(),
    );
    const toCurrObj = apiCurrencies.find(
      (c) => c.shortName?.toLowerCase() === toCurrency.toLowerCase(),
    );

    const params = new URLSearchParams({
      from: fromCurrency,
      to: toCurrency,
      fromId: fromCurrObj?.id?.toString() || "0",
      toId: toCurrObj?.id?.toString() || "0",
      amount: fromAmount,
      toAmount: toAmount,
      rate: conversionRate.toString(),
    });
    router.push(
      `/dashboard/fund-wallet/convert-money/review-transaction?${params.toString()}`,
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    const symbol = getCurrencySymbol(currency);
    return `${symbol} ${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
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
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeDasharray="40, 100"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">40%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              Convert Money
            </h1>
            <p className="text-sm text-gray-600">
              Enter amount and select currency to convert to
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to convert <span className="text-red-500">*</span>
            </label>
            <div className="relative border border-gray-300 rounded-xl bg-white">
              <div className="flex items-center">
                <div className="flex flex-col gap-1 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src={getCurrencyLogo(fromCurrency)}
                        alt={fromCurrency}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={fromCurrency}
                        onChange={handleFromCurrencyChange}
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
                    Bal: {userLoading ? "..." : getDynamicBalance(fromCurrency)}
                  </p>
                </div>
                <div className="flex-1 px-4 py-3">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="w-full border-none focus:outline-none text-right font-semibold text-xl text-gray-900 bg-transparent"
                    placeholder={`${getCurrencySymbol(fromCurrency)} 0`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Conversion Fee:</span>
                <span>
                  {conversionFee} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount we&apos;ll convert:</span>
                <span>{formatAmount(amountToConvert, fromCurrency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Today&apos;s Rate:</span>
                <span className={fetchingRate ? "animate-pulse" : ""}>
                  {conversionRate > 0
                    ? `1 ${fromCurrency} = ${conversionRate} ${toCurrency}`
                    : !fromAmount
                      ? "—"
                      : "Fetching rate..."}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount you&apos;ll receive <span className="text-red-500">*</span>
            </label>
            <div className="relative border border-gray-300 rounded-xl bg-gray-50">
              <div className="flex items-center">
                <div className="flex flex-col gap-1 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image
                        src={getCurrencyLogo(toCurrency)}
                        alt={toCurrency}
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
                          (currency) => {
                            const isUnavailable = currency.code === "USDC";
                            return (
                              <option
                                key={currency.code}
                                value={currency.code}
                                disabled={isUnavailable}
                                className={
                                  isUnavailable
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                }
                              >
                                {currency.code}{" "}
                                {isUnavailable ? "(Coming Soon)" : ""}
                              </option>
                            );
                          },
                        )}
                      </select>
                      <FiChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Bal: {userLoading ? "..." : getDynamicBalance(toCurrency)}
                  </p>
                </div>
                <div className="flex-1 px-4 py-3">
                  <input
                    type="text"
                    value={fetchingRate ? "Calculating..." : toAmount}
                    readOnly
                    className="w-full border-none focus:outline-none text-right font-semibold text-xl text-gray-900 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

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

          <button
            className={`w-full ${acceptedRate && !fetchingRate && toAmount && parseFloat(fromAmount) > 0 ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-300 cursor-not-allowed"} text-white py-3 rounded-lg font-medium transition-colors`}
            onClick={handleContinue} // Direct route execution here
            disabled={
              !acceptedRate ||
              fetchingRate ||
              !toAmount ||
              parseFloat(fromAmount) <= 0
            }
          >
            {fetchingRate ? "Processing..." : "Continue"}
          </button>
        </div>
      </main>

      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors">
          <FiHeadphones className="text-white text-lg" />
        </button>
      </div>
    </div>
  );
}
