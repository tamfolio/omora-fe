"use client"

import React, { useState, useRef } from 'react';
import { Search, ChevronsUpDown, ChevronUp, ChevronDown, Calendar, Check, CircleCheck, CircleX } from 'lucide-react';
import Link from 'next/link';
import CalendarDropdown from '@/components/approval/CalenderDropdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
  NONE: 'none'
};

const getSortIcon = (direction: string) => {
  switch (direction) {
    case SORT_DIRECTIONS.ASC:
      return <ChevronUp color='#A4A7AE' className="w-3 h-3" />;
    case SORT_DIRECTIONS.DESC:
      return <ChevronDown color='#A4A7AE' className="w-3 h-3" />;
    default:
      return <ChevronsUpDown color='#A4A7AE' className="w-3 h-3" />;
  }
};

type Transaction = {
  id: number;
  initiatorName: string;
  amount: number;
  investmentType: "recurring" | "one-time";
  timestamp: Date;
};

const InvestmentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: string;
  }>({
    column: null,
    direction: SORT_DIRECTIONS.NONE,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(new Date(2025, 0, 10)); // Jan 10, 2025
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(new Date(2025, 0, 16)); // Jan 16, 2025
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [actionType, setActionType] = useState<"decline" | "approve" | null>(null);
  const [acceptRateFees, setAcceptRateFees] = useState(false);
  const [acceptRisks, setAcceptRisks] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [selectedVerificationMethod, setSelectedVerificationMethod] = useState<"email" | "authenticator" | null>(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showDeclineReason, setShowDeclineReason] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineSuccess, setShowDeclineSuccess] = useState(false);

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return "Select date range";
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    };
    
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  const handleDateRangeSelect = (startDate: Date | null, endDate: Date | null) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    console.log("Date range selected:", { startDate, endDate });
  };

  const handleCalendarToggle = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  // Mock data
  const transactions: Transaction[] = [
    { id: 1, initiatorName: "John Doe", amount: 600, investmentType: "recurring" as const, timestamp: new Date(2025, 6, 15, 12, 0) },
    { id: 2, initiatorName: "Jane Smith", amount: 1200, investmentType: "one-time" as const, timestamp: new Date(2025, 6, 14, 15, 30) },
    { id: 3, initiatorName: "Williams", amount: 3000, investmentType: "recurring" as const, timestamp: new Date(2025, 6, 13, 9, 45) },
    { id: 4, initiatorName: "Alice Johnson", amount: 500, investmentType: "one-time" as const, timestamp: new Date(2025, 6, 12, 14, 20) },
    { id: 5, initiatorName: "Bob Williams", amount: 1500, investmentType: "recurring" as const, timestamp: new Date(2025, 6, 11, 11, 15) },
    { id: 6, initiatorName: "Sarah Brown", amount: 800, investmentType: "one-time" as const, timestamp: new Date(2025, 6, 10, 16, 45) },
    { id: 7, initiatorName: "Mike Davis", amount: 2000, investmentType: "recurring" as const, timestamp: new Date(2025, 6, 9, 10, 30) },
    { id: 8, initiatorName: "Emily Wilson", amount: 950, investmentType: "one-time" as const, timestamp: new Date(2025, 6, 8, 13, 0) },
  ];

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column 
        ? (prev.direction === SORT_DIRECTIONS.NONE 
            ? SORT_DIRECTIONS.ASC 
            : prev.direction === SORT_DIRECTIONS.ASC 
              ? SORT_DIRECTIONS.DESC 
              : SORT_DIRECTIONS.NONE)
        : SORT_DIRECTIONS.ASC,
    }));
  };

  const getSortDirection = (column: string) => {
    return sortConfig.column === column ? sortConfig.direction : SORT_DIRECTIONS.NONE;
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortConfig.column || sortConfig.direction === SORT_DIRECTIONS.NONE) {
      return transactions;
    }

    const column = sortConfig.column; // TypeScript now knows this is string, not null

    return [...transactions].sort((a, b) => {
      let aValue: any = a[column as keyof typeof a];
      let bValue: any = b[column as keyof typeof b];

      // Handle timestamp sorting
      if (column === 'timestamp') {
        // timestamp is already a Date object
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (column === 'amount') {
        // amount is a number, keep as is
        // No conversion needed
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASC ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASC ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig, transactions]);

  const filteredTransactions = sortedTransactions.filter((transaction) =>
    transaction.initiatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.investmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'initiatorName', label: 'Initiator Name', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true },
    { key: 'investmentType', label: 'Investment Type', sortable: true },
    { key: 'declineApprove', label: 'Decline / Approve', sortable: false },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
  ];

  return (
    <div className="bg-white border border-[#E9EAEB] rounded-[8px]">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-[#E9EAEB]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#181D27]">Investments</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[296px] pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={handleCalendarToggle}
                className="flex gap-2.5 items-center py-2.5 px-3.5 h-10 rounded-[8px] border border-[#D5D7DA] font-semibold text-[#414651] text-sm hover:bg-gray-50 transition-colors"
              >
                <Calendar color="#A4A7AE" />
                {formatDateRange(selectedStartDate, selectedEndDate)}
              </button>

              <CalendarDropdown
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                onDateRangeSelect={handleDateRangeSelect}
                initialStartDate={selectedStartDate}
                initialEndDate={selectedEndDate}
                position="bottom-right"
                triggerRef={buttonRef}
                className="mt-2 z-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[#E9EAEB]">
            <tr>
              {columns.map(({ key, label, sortable }) => (
                <th 
                  key={key} 
                  className={`px-6 py-3 text-xs font-semibold text-[#717680] tracking-wider ${
                    key === 'timestamp' ? 'text-right' : 'text-left'
                  }`}
                >
                  {sortable ? (
                    <button 
                      onClick={() => handleSort(key)}
                      className={`flex items-center space-x-1 hover:text-gray-700 w-full ${
                        key === 'timestamp' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <span>{label}</span>
                      {getSortIcon(getSortDirection(key))}
                    </button>
                  ) : (
                    <span>{key === 'declineApprove' ? '' : label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-[#535862]">
                  {transaction.initiatorName}
                </td>
                <td className="px-6 py-4 text-sm text-[#535862]">
                  {transaction.amount.toLocaleString()} USDC
                </td>
                <td className="px-6 py-4 text-sm text-[#535862]">
                  {transaction.investmentType === 'recurring' ? 'Recurring' : 'One-time'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(transaction);
                        setActionType("decline");
                      }}
                      className="px-3 w-[110px] py-2 text-sm font-semibold cursor-pointer text-[#414651] bg-white border border-[#D5D7DA] rounded-[8px] hover:bg-gray-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTransaction(transaction);
                        setActionType("approve");
                      }}
                      className="px-3 w-[110px] py-2 text-sm font-semibold cursor-pointer text-white bg-[#008B99] rounded-[8px]"
                    >
                      Approve
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-sm text-[#535862]">
                <div className="text-xs text-[#535862]">
                    {transaction.timestamp.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                  <div>
                    {transaction.timestamp.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 bg-[#FCFCFC]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Page 1 of 10</span>
          <div className="flex space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[8px] hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[8px] hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedTransaction(null);
            setActionType(null);
            setAcceptRateFees(false);
            setAcceptRisks(false);
            setShowVerification(false);
            setSelectedVerificationMethod(null);
            setShowCodeInput(false);
            setVerificationCode("");
            setShowSuccessScreen(false);
            setShowDeclineReason(false);
            setDeclineReason("");
            setShowDeclineSuccess(false);
          }
        }}
      >
        <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px] h-fit max-h-full overflow-y-auto overflow-x-hidden">
          {/* Approval Confirmation Screen with Checkboxes */}
          {selectedTransaction && actionType === "approve" && !showVerification && !showSuccessScreen && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#414651] text-center text-[24px] font-bold mb-6">
                  Are You Sure You Want to Approve this Transaction?
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mb-6">
                {/* First Checkbox */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setAcceptRateFees(!acceptRateFees)}
                    className={`mt-1 size-4 rounded border flex items-center justify-center transition-colors ${
                      acceptRateFees
                        ? "bg-[#008B99] border-[#008B99]"
                        : "bg-white border-[#D5D7DA]"
                    }`}
                  >
                    {acceptRateFees && <Check size={14} color="white" />}
                  </button>
                  <label 
                    onClick={() => setAcceptRateFees(!acceptRateFees)}
                    className="flex-1 text-sm text-[#414651] font-medium cursor-pointer"
                  >
                    I accept the current market conversion rate and fees
                  </label>
                </div>

                {/* Second Checkbox */}
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setAcceptRisks(!acceptRisks)}
                    className={`mt-1 size-4 rounded border flex items-center justify-center transition-colors ${
                      acceptRisks
                        ? "bg-[#008B99] border-[#008B99]"
                        : "bg-white border-[#D5D7DA]"
                    }`}
                  >
                    {acceptRisks && <Check size={14} color="white" />}
                  </button>
                  <label 
                    onClick={() => setAcceptRisks(!acceptRisks)}
                    className="flex-1 text-sm text-[#414651] font-medium cursor-pointer"
                  >
                    I understand this is a cryptocurrency investment and accept the associated risks, including potential capital loss due to market volatility.
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  disabled={!acceptRateFees || !acceptRisks}
                  className={`h-11 w-full font-semibold rounded-[8px] ${
                    acceptRateFees && acceptRisks
                      ? "bg-[#008B99] hover:bg-[#008B99] text-white"
                      : "bg-[#F5F5F5] border border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                  }`}
                  onClick={() => setShowVerification(true)}
                >
                  Approve Investment
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-[8px] border border-[#D5D7DA] bg-white text-[#414651] font-semibold"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setActionType(null);
                    setAcceptRateFees(false);
                    setAcceptRisks(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Decline Confirmation Screen */}
          {selectedTransaction && actionType === "decline" && !showVerification && !showSuccessScreen && !showDeclineReason && !showDeclineSuccess && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#414651] text-center text-[24px] font-bold mb-4">
                  Are You Sure You Want to Decline this Investment?
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <Button
                  className="h-11 w-full font-semibold rounded-[8px] bg-[#D92D20] hover:bg-[#F04438] text-white"
                  onClick={() => {
                    setShowDeclineReason(true);
                  }}
                >
                  Yes, I want to decline
                </Button>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-[8px] border border-[#D5D7DA] bg-white text-[#414651] font-semibold"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setActionType(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Decline Reason Screen */}
          {selectedTransaction && actionType === "decline" && showDeclineReason && !showDeclineSuccess && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#414651] text-center text-[24px] font-bold mb-4">
                  Kindly State Your Reason
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <textarea
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="Enter your reason for declining the transaction."
                  className={`w-full min-h-[120px] px-3 py-2 border rounded-[8px] text-[#181D27] resize-none focus:outline-none ${
                    declineReason.trim() ? "border-[#008B99]" : "border-[#D5D7DA]"
                  }`}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    disabled={!declineReason.trim()}
                    className={`h-12 w-full font-semibold rounded-[8px] ${
                      declineReason.trim()
                        ? "bg-[#008B99] hover:bg-[#008B99] text-white"
                        : "bg-[#F5F5F5] border border-[#E9EAEB] text-[#A4A7AE] cursor-not-allowed"
                    }`}
                    onClick={() => {
                      setShowDeclineSuccess(true);
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-[8px] border border-[#D5D7DA] bg-white text-[#414651] font-semibold"
                    onClick={() => {
                      setShowDeclineReason(false);
                      setDeclineReason("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Decline Success Screen */}
          {selectedTransaction && actionType === "decline" && showDeclineSuccess && (
            <>
              <DialogHeader className='mb-4'>
                <div className="flex justify-center mb-4">
                  <div className="size-12 flex items-center justify-center rounded-full bg-[#FEE4E2]">
                    <CircleX size={20} color="#F04438" />
                  </div>
                </div>
                <DialogTitle className="text-[#181D27] text-center font-semibold mb-2">
                  Transaction Declined Successfully
                </DialogTitle>
                <p className="text-[#535862] text-center text-sm !mt-0">
                  You have successfully declined the transaction.
                </p>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <Link 
                  href="/dashboard"
                  className="h-12 w-full flex items-center justify-center font-semibold rounded-[8px] bg-[#D92D20] hover:bg-[#F04438] text-white"
                >
                  OK, Take Me to Dashboard
                </Link>
              </div>
            </>
          )}

          {/* Verification Method Selection Screen */}
          {selectedTransaction && showVerification && !showCodeInput && !showSuccessScreen && (
            <>
              <DialogHeader className='mb-2'>
                <DialogTitle className="text-[#181D27] text-center text-[24px] font-semibold mb-2">
                  Select Verification Method
                </DialogTitle>
                <p className="text-[#535862] text-center text-sm !mt-0">
                  Please select any of the security methods that is available to you.
                </p>
              </DialogHeader>

              <div className="space-y-3 mb-6">
                {/* Email Option */}
                <button
                  onClick={() => setSelectedVerificationMethod("email")}
                  className={`w-full h-[70px] px-3 py-4 rounded-[8px] border flex items-center gap-2 transition-colors ${
                    selectedVerificationMethod === "email"
                      ? "border-[#008B99] bg-[#E5FAFC]/50"
                      : "border-[#E9EAEB]"
                  }`}
                >
                  <span className='size-10 flex justify-center items-center border border-[#D5D7DA] rounded-[8px] bg-white'>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9167 15.0026L12.381 10.0026M7.61913 10.0026L2.08344 15.0026M1.66675 5.83594L8.47085 10.5988C9.02182 10.9845 9.29731 11.1773 9.59697 11.252C9.86166 11.318 10.1385 11.318 10.4032 11.252C10.7029 11.1773 10.9783 10.9845 11.5293 10.5988L18.3334 5.83594M5.66675 16.6693H14.3334C15.7335 16.6693 16.4336 16.6693 16.9684 16.3968C17.4388 16.1571 17.8212 15.7747 18.0609 15.3042C18.3334 14.7695 18.3334 14.0694 18.3334 12.6693V7.33594C18.3334 5.93581 18.3334 5.23574 18.0609 4.70096C17.8212 4.23056 17.4388 3.8481 16.9684 3.60842C16.4336 3.33594 15.7335 3.33594 14.3334 3.33594H5.66675C4.26662 3.33594 3.56655 3.33594 3.03177 3.60842C2.56137 3.8481 2.17892 4.23056 1.93923 4.70096C1.66675 5.23574 1.66675 5.93581 1.66675 7.33594V12.6693C1.66675 14.0694 1.66675 14.7695 1.93923 15.3042C2.17892 15.7747 2.56137 16.1571 3.03177 16.3968C3.56655 16.6693 4.26662 16.6693 5.66675 16.6693Z" stroke="#414651" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-[#535862]">Email</div>
                    <div className="text-xs text-[#535862]">ja****00@gmail.com</div>
                  </div>
                  <div
                    className={`size-4 rounded border flex items-center justify-center ${
                      selectedVerificationMethod === "email"
                        ? "bg-[#008B99] border-[#008B99]"
                        : "bg-white border-[#D5D7DA]"
                    }`}
                  >
                    {selectedVerificationMethod === "email" && <Check size={14} color="white" />}
                  </div>
                </button>

                {/* Authenticator App Option */}
                <button
                  onClick={() => setSelectedVerificationMethod("authenticator")}
                  className={`w-full h-[70px] px-3 py-4 rounded-[8px] border flex items-center gap-4 transition-colors ${
                    selectedVerificationMethod === "authenticator"
                      ? "border-[#008B99] bg-[#E5FAFC]/50"
                      : "border-[#E9EAEB]"
                  }`}
                >
                    <span className='size-10 flex justify-center items-center border border-[#D5D7DA] rounded-[8px] bg-white'>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0001 10.0026H10.0042M14.1667 10.0026H14.1709M5.83341 10.0026H5.83758M4.33341 5.83594H15.6667C16.6002 5.83594 17.0669 5.83594 17.4234 6.01759C17.737 6.17738 17.992 6.43235 18.1518 6.74595C18.3334 7.10247 18.3334 7.56918 18.3334 8.5026V11.5026C18.3334 12.436 18.3334 12.9027 18.1518 13.2593C17.992 13.5729 17.737 13.8278 17.4234 13.9876C17.0669 14.1693 16.6002 14.1693 15.6667 14.1693H4.33342C3.39999 14.1693 2.93328 14.1693 2.57676 13.9876C2.26316 13.8278 2.00819 13.5729 1.8484 13.2593C1.66675 12.9027 1.66675 12.436 1.66675 11.5026V8.5026C1.66675 7.56918 1.66675 7.10247 1.8484 6.74595C2.00819 6.43235 2.26316 6.17738 2.57676 6.01759C2.93328 5.83594 3.39999 5.83594 4.33341 5.83594ZM10.2084 10.0026C10.2084 10.1177 10.1151 10.2109 10.0001 10.2109C9.88502 10.2109 9.79175 10.1177 9.79175 10.0026C9.79175 9.88755 9.88502 9.79427 10.0001 9.79427C10.1151 9.79427 10.2084 9.88755 10.2084 10.0026ZM14.3751 10.0026C14.3751 10.1177 14.2818 10.2109 14.1667 10.2109C14.0517 10.2109 13.9584 10.1177 13.9584 10.0026C13.9584 9.88755 14.0517 9.79427 14.1667 9.79427C14.2818 9.79427 14.3751 9.88755 14.3751 10.0026ZM6.04175 10.0026C6.04175 10.1177 5.94847 10.2109 5.83341 10.2109C5.71836 10.2109 5.62508 10.1177 5.62508 10.0026C5.62508 9.88755 5.71836 9.79427 5.83341 9.79427C5.94847 9.79427 6.04175 9.88755 6.04175 10.0026Z" stroke="#414651" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-[#535862]">Authenticator app</div>
                  </div>
                  <div
                    className={`size-4 rounded border flex items-center justify-center ${
                      selectedVerificationMethod === "authenticator"
                        ? "bg-[#008B99] border-[#008B99]"
                        : "bg-white border-[#D5D7DA]"
                    }`}
                  >
                    {selectedVerificationMethod === "authenticator" && <Check size={14} color="white" />}
                  </div>
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  disabled={!selectedVerificationMethod}
                  className={`h-12 w-full font-semibold rounded-[8px] ${
                    selectedVerificationMethod
                      ? "bg-[#008B99] hover:bg-[#008B99] text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    setShowCodeInput(true);
                  }}
                >
                  Continue
                </Button>
              </div>
            </>
          )}

          {/* Authenticator App Verification Screen */}
          {selectedTransaction && showCodeInput && selectedVerificationMethod === "authenticator" && !showSuccessScreen && (
            <>
              <DialogHeader className='mb-2'>
                <DialogTitle className="text-[#414651] text-center text-[24px] font-bold mb-2">
                  Authenticator App Verification
                </DialogTitle>
                <p className="text-[#535862] text-center text-sm !mt-0">
                  Enter the 6-digit code generated by the authenticator app.
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#414651] font-medium mb-2">Input 6-digit code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      className="w-full h-10 px-3 border border-[#A4A7AE] rounded-[8px] text-[#181D27] pr-20"
                      maxLength={6}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.readText().then(text => {
                          const code = text.replace(/\D/g, '').slice(0, 6);
                          setVerificationCode(code);
                        });
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00717D] text-sm font-medium"
                    >
                      Paste
                    </button>
                  </div>
                </div>

                <Button
                  className="h-12 w-full font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99] text-white"
                  onClick={() => {
                    console.log("Submit verification code:", verificationCode);
                    setShowCodeInput(false);
                    setShowSuccessScreen(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </>
          )}

          {/* Email Verification Screen */}
          {selectedTransaction && showCodeInput && selectedVerificationMethod === "email" && !showSuccessScreen && (
            <>
              <DialogHeader className='mb-2'>
                <DialogTitle className="text-[#414651] text-center text-[24px] font-bold mb-2">
                  Email Verification
                </DialogTitle>
                <p className="text-[#535862] text-center text-sm !mt-0">
                  We sent a 6-digit code to olivia@gmail.com
                </p>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#414651] font-medium mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      className="w-full h-10 px-3 border border-[#A4A7AE] rounded-[8px] text-[#181D27] pr-20"
                      maxLength={6}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.readText().then(text => {
                          const code = text.replace(/\D/g, '').slice(0, 6);
                          setVerificationCode(code);
                        });
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00717D] text-sm font-medium"
                    >
                      Paste
                    </button>
                  </div>
                </div>

                <p className="text-sm text-[#535862] text-center">
                  Didn&apos;t receive the 6-digit code?{" "}
                  <button className="text-[#00717D] font-semibold">
                    Click to resend
                  </button>
                </p>

                <Button
                  className="h-12 w-full font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99] text-white"
                  onClick={() => {
                    console.log("Submit verification code:", verificationCode);
                    setShowCodeInput(false);
                    setShowSuccessScreen(true);
                  }}
                >
                  Submit
                </Button>
              </div>
            </>
          )}

          {/* Success Screen */}
          {selectedTransaction && showSuccessScreen && (
            <>
              <DialogHeader className='mb-4'>
                <div className="flex justify-center mb-4">
                  <div className="size-12 flex items-center justify-center rounded-full bg-[#DCFAE6]">
                    <CircleCheck size={20} color="#079455" />
                  </div>
                </div>
                <DialogTitle className="text-[#414651] text-center font-semibold mb-2">
                  Investment Successfull
                </DialogTitle>
                <p className="text-[#535862] text-center text-sm !mt-0">
                  You have successfully invested.
                </p>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <Link 
                  href="/dashboard"
                  className="h-12 w-full flex items-center justify-center font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99] text-white"
                >
                  OK, Take Me to Dashboard
                </Link>
                <Link 
                  href="/wallet"
                  className="h-12 w-full flex items-center justify-center font-semibold rounded-[8px] border border-[#D5D7DA] bg-white text-[#414651] hover:bg-gray-50"
                >
                  Go Back to Wallet
                </Link>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentsTab;

