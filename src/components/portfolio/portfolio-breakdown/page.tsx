"use client";

const investmentData = [
  {
    type: "Recurring Investment (Conservative)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "90 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "One time Investment (Conservative)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "Recurring Investment (Conservative, Bitcoin ETF)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "Recurring Investment (Conservative, Growth)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "Recurring Investment (Conservative, Bitcoin, Growth)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "Recurring Investment (Conservative, Bitcoin, Growth)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
  {
    type: "One time Investment (Conservative, Bitcoin, Growth)",
    amountInvested: "$118,792",
    currentMarketValue: "$118,792",
    duration: "120 days",
    unrealizedGainLoss: "-0.63%",
  },
];

export default function InvestmentHistory() {
  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Investment History
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Next Recurring Investment</span>
            <span className="ml-2 font-medium">18h:23m</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3V16M12 16L16 12M12 16L8 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Full Divider */}
      <div className="border-b border-gray-200 mb-6"></div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-sm font-medium text-gray-500 py-4 px-4">
                Investment Type
              </th>
              <th className="text-right text-sm font-medium text-gray-500 py-4 px-4">
                Amount Invested
              </th>
              <th className="text-right text-sm font-medium text-gray-500 py-4 px-4">
                Current Market Value
              </th>
              <th className="text-right text-sm font-medium text-gray-500 py-4 px-4">
                Duration
              </th>
              <th className="text-right text-sm font-medium text-gray-500 py-4 px-4">
                Unrealized gain/loss (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {investmentData.map((investment, index) => (
              <tr
                key={index}
                className="border-b border-gray-50 hover:bg-gray-50"
              >
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{investment.type}</div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-gray-900">
                    {investment.amountInvested}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-gray-900">
                    {investment.currentMarketValue}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-gray-900">
                    {investment.duration}
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="text-sm text-red-500">
                    {investment.unrealizedGainLoss}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}