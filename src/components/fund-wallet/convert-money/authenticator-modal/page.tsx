"use client";
import React, { useState } from "react";

interface AuthenticatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  conversionData?: {
    fromCurrency: string;
    toCurrency: string;
    fromAmount: string;
    toAmount: string;
  };
}

export default function AuthenticatorModal({
  isOpen,
  onClose,
  onVerify,
  conversionData: _conversionData,
}: AuthenticatorModalProps) {
  const [code, setCode] = useState("");

  if (!isOpen) return null;

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify(code);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setCode(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Check your authenticator app
          </h2>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Input 6-digit key
          </label>
          <input
            type="text"
            value={code}
            onChange={handleInputChange}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            maxLength={6}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={code.length !== 6}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            code.length === 6
              ? "bg-teal-600 hover:bg-teal-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
