import React from "react";
import Image from "next/image";
import ConvertMoney from "./ConvertMoney";

const balances = [
  {
    balanceType: "USDC Balance",
    balance: 0,
    currency: "USDC",
    cta: "Convert USD to USDC",
  },
  {
    balanceType: "USDT Balance",
    balance: 200000,
    currency: "USDT",
    cta: "Convert USD to USDT",
  },
  {
    balanceType: "Naira Balance",
    balance: 2000000,
    currency: "NGN",
    cta: "Convert Naira to USD",
  },
];

export default function Balances() {
  return (
    <div className="rounded-[12px] border border-[#E9EAEB] bg-white p-6">
      <div className="t-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {balances.map((balance, index) => (
        <div key={index} className="space-y-2.5">
          <div className="p-4 space-y-4 rounded-[8px] border-[0.65px] border-[#E9EAEB]">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-[#414651]">
                {balance.currency} Balance
              </span>
              <Image
                src="/assets/images/dashboard/investment/help.svg"
                width={16}
                height={16}
                alt="help"
              />
            </div>
            <div className="flex items-center justify-between text-[#181D27] font-semibold">
              <span>{balance.balance}</span>
              <span>{balance.currency}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    <ConvertMoney cta="Convert Money" />
    </div>
  );
}
