"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Token {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  oldAllocation: number;
  newAllocation: number;
}

interface PortfolioRebalancingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (allocations: Token[]) => void;
  onReject?: () => void;
}

const initialTokens: Token[] = [
  { id: "BTC", name: "Bitcoin", ticker: "BTC", icon: "/assets/images/dashboard/porfolio-rebalacing/BTC.svg", oldAllocation: 35, newAllocation: 35 },
  { id: "ETH", name: "Ethereum", ticker: "ETH", icon: "/assets/images/dashboard/porfolio-rebalacing/eth.svg", oldAllocation: 30, newAllocation: 30 },
  { id: "XRP", name: "XRP", ticker: "XRP", icon: "/assets/images/dashboard/porfolio-rebalacing/XRP.svg", oldAllocation: 15, newAllocation: 15 },
  { id: "SOL", name: "Solana", ticker: "SOL", icon: "/assets/images/dashboard/porfolio-rebalacing/SOL.svg", oldAllocation: 10, newAllocation: 10 },
  { id: "DOGE", name: "Dogecoin", ticker: "DOGE", icon: "/assets/images/dashboard/porfolio-rebalacing/DOGE.svg", oldAllocation: 5, newAllocation: 5 },
  { id: "ADA", name: "Cardano", ticker: "ADA", icon: "/assets/images/dashboard/porfolio-rebalacing/ADA.svg", oldAllocation: 5, newAllocation: 5 },
];

export default function PortfolioRebalancingModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
}: PortfolioRebalancingModalProps) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [acceptDistribution, setAcceptDistribution] = useState(false);
  const [totalAllocation, setTotalAllocation] = useState(100);

  useEffect(() => {
    const total = tokens.reduce((sum, token) => sum + token.newAllocation, 0);
    setTotalAllocation(total);
  }, [tokens]);

  const handleAllocationChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0 || numValue > 100) return;

    setTokens((prev) =>
      prev.map((token) =>
        token.id === id ? { ...token, newAllocation: numValue } : token
      )
    );
  };

  const handleApprove = () => {
    if (totalAllocation === 100 && acceptDistribution) {
      onApprove?.(tokens);
      onClose();
    }
  };

  const handleReject = () => {
    onReject?.();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-6 !rounded-[16px] bg-white h-fit max-h-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-3xl font-medium text-[#181D27] mb-2 text-center">
            Portfolio Rebalancing
          </DialogTitle>
          <p className="text-sm text-[#535862] text-center">
            We adjust allocations periodically to match your selected risk profile
          </p>
        </DialogHeader>

        <div className="mt-6">
          {/* Table */}
          <div className="">
            <table className="w-full">
              <thead className="border-b border-[#E9EAEB]">
                <tr>
                  <th className="p-6 text-left text-xs font-semibold text-[#717680]">
                    Current Token
                  </th>
                  <th className="p-6 text-right text-xs font-semibold text-[#717680] border-[#D5D7DA]">
                    Old Allocation
                  </th>
                  <th className="p-6 text-right text-xs font-semibold text-[#717680] border-[#D5D7DA]">
                    New Allocation
                  </th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token, index) => (
                  <tr
                    key={token.id}
                    className={`border-b border-[#E9EAEB] ${
                      index === 0 || index === tokens.length - 1
                        ? "border-[#008B99]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={token.icon}
                          alt={token.name}
                          width={24}
                          height={24}
                        />
                        <div>
                          <div className="text-sm font-semibold text-[#181D27]">
                            {token.name}
                          </div>
                          <div className="text-xs text-[#535862]">
                            {token.ticker}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[#535862] border-[#D5D7DA]">
                      {token.oldAllocation}%
                    </td>
                    <td className="px-4 py-3 text-right border-[#D5D7DA]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={token.newAllocation}
                        onChange={(e) =>
                          handleAllocationChange(token.id, e.target.value)
                        }
                        className="w-20 px-2 py-1 text-sm text-right border border-[#D5D7DA] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#008B99] focus:border-[#008B99]"
                      />
                      <span className="ml-1 text-sm text-[#535862]">%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Allocation Display */}
          <div className="mt-4 text-right">
            <span
              className={`text-sm font-semibold ${
                totalAllocation === 100
                  ? "text-[#008B99]"
                  : totalAllocation > 100
                    ? "text-red-600"
                    : "text-orange-600"
              }`}
            >
              Total: {totalAllocation.toFixed(1)}%
            </span>
            {totalAllocation !== 100 && (
              <p className="text-xs text-red-600 mt-1">
                Total must equal 100%
              </p>
            )}
          </div>

          {/* Checkbox */}
          <div className="mt-6 flex items-center gap-2">
            <input
              type="checkbox"
              id="accept-distribution"
              checked={acceptDistribution}
              onChange={(e) => setAcceptDistribution(e.target.checked)}
              className="w-4 h-4 border-2 border-[#008B99] rounded-[4px] bg-white checked:bg-[#008B99] checked:border-[#008B99] focus:ring-2 focus:ring-[#008B99] focus:ring-offset-0 cursor-pointer accent-[#008B99]"
              style={{
                accentColor: '#008B99',
              }}
            />
            <label
              htmlFor="accept-distribution"
              className="text-sm text-[#181D27] cursor-pointer"
            >
              I accept the new portfolio distribution
            </label>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <Button
              variant="outline"
              className="flex-1 rounded-[8px] border border-gray-300 font-semibold text-[#181D27] hover:bg-gray-50"
              onClick={handleReject}
            >
              Reject Changes
            </Button>
            <Button
              className="flex-1 bg-[#008B99] hover:bg-[#008B99] text-white font-semibold rounded-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApprove}
              disabled={totalAllocation !== 100 || !acceptDistribution}
            >
              Approve Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

