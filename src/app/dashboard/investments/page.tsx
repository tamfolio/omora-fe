"use client";

import Balances from "@/components/investment/Balances";
import Link from "next/link";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronsUpDown,
  CirclePause,
  CirclePlay,
  CloudDownload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import clsx from "clsx";

type InvestmentType = "recurring" | "one-time";
type InvestmentProfile = "Conservative ETF" | "Bitcoin ETF" | "Growth ETF";
type RecurringStatus = "Active" | "Inactive" | "N/A";

export type Investment = {
  id: string;
  investmentType: InvestmentType;
  profiles: InvestmentProfile[];
  duration: string;
  deductedDaily?: number;
  usdcValue: number;
  unrealized: number;
  recurringInvestmentStatus: RecurringStatus;
  dateRange: {
    endDate: Date;
    startDate: Date;
  };
  timesDebited: number;
};

// Mock Data
const data: Investment[] = [
  {
    id: "1",
    investmentType: "recurring",
    profiles: ["Conservative ETF", "Bitcoin ETF"],
    duration: "90 days",
    deductedDaily: 13.33, // 1200 / 90
    usdcValue: 1200,
    unrealized: 5.2,
    recurringInvestmentStatus: "Active",
    dateRange: {
      endDate: new Date("2025-07-15T12:00:00"),
      startDate: new Date("2025-07-15T12:00:00"),
    },
    timesDebited: 2,
  },
  {
    id: "2",
    investmentType: "one-time",
    profiles: ["Bitcoin ETF", "Growth ETF"],
    duration: "360 days",
    deductedDaily: undefined, // no daily deduction
    usdcValue: 500,
    unrealized: -2.5,
    recurringInvestmentStatus: "N/A",
    dateRange: {
      endDate: new Date("2025-07-14T15:30:00"),
      startDate: new Date("2025-07-14T15:30:00"),
    },
    timesDebited: 3,
  },
  {
    id: "3",
    investmentType: "recurring",
    profiles: ["Growth ETF", "Conservative ETF"],
    duration: "180 days",
    deductedDaily: 16.67, // 3000 / 180
    usdcValue: 3000,
    unrealized: 12.4,
    recurringInvestmentStatus: "Inactive",
    dateRange: {
      endDate: new Date("2025-07-13T09:45:00"),
      startDate: new Date("2025-07-13T09:45:00"),
    },
    timesDebited: 3,
  },
];

export default function Investments() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Investment | null>(null);

  const filteredData = useMemo(() => {
    if (activeTab === "all") return data;
    return data.filter((d) => d.investmentType === activeTab);
  }, [activeTab]);

  const columns = useMemo<ColumnDef<Investment>[]>(() => {
    const baseColumns: ColumnDef<Investment>[] = [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            className="px-0 gap-1 flex text-xs justify-start text-[#717680] max-w-[480px] font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Investment ID
            <ChevronsUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="!text-sm text-center text-[#181D27] font-medium">
            #{row.original.id}
          </div>
        ),
      },
      {
        accessorKey: "investmentType",
        header: ({ column }) => (
          <Button
            className="px-0 gap-1 flex text-xs justify-start text-[#717680] max-w-[480px] font-semibold"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Investment Type
            <ChevronsUpDown className="ml-1 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => {
          const type = row.original.investmentType;
          const profiles = row.original.profiles.join(", ");
          return (
            <div className="!text-sm text-[#181D27] font-medium">
              {type === "recurring"
                ? `Recurring Investment (${profiles})`
                : `One-time Investment (${profiles})`}
            </div>
          );
        },
      },
      {
        accessorKey: "duration",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            Duration
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-center text-[#535862]">
            {row.original.duration}
          </div>
        ),
      },
      {
        accessorKey: "usdcValue",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            Total Investment
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-center text-[#535862]">
            {row.original.usdcValue.toLocaleString()} USDC
          </div>
        ),
      },
      {
        accessorKey: "unrealizedPnL",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            Unrealized gain/loss (%)
          </div>
        ),
        cell: ({ row }) => (
          <div
            className={clsx(
              "text-sm text-center",
              row.original.unrealized >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {row.original.unrealized.toFixed(2)}%
          </div>
        ),
      },
    ];

    const dateRangeColumn: ColumnDef<Investment> = {
      accessorKey: "dateRange",
      header: ({ column }) => (
        <Button
          className="px-0 gap-1 w-full justify-end flex text-xs text-[#717680] font-semibold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start / End Date
          <ChevronsUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const start = row.original.dateRange.startDate;
        const end = row.original.dateRange.endDate;
        return (
          <div className="text-right text-sm text-[#535862]">
            <div>
              {start.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-xs text-[#535862]">
              {end.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        );
      },
      sortingFn: (a, b) =>
        a.original.dateRange.startDate.getTime() -
        b.original.dateRange.startDate.getTime(),
    };

    const recurringColumns: ColumnDef<Investment>[] = [
      {
        accessorKey: "timesDebited",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            No of Debit
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-center text-[#535862]">
            {row.original.timesDebited}
          </div>
        ),
      },
      {
        accessorKey: "dailyDeduction",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            Deducted Daily
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-sm text-center text-[#535862]">
            {row.original.deductedDaily?.toFixed(2)} USDC
          </div>
        ),
      },
      {
        accessorKey: "recurringInvestmentStatus",
        header: () => (
          <div className="text-center text-xs text-[#717680] font-semibold">
            Recurring Status
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            <span
              className={clsx(
                "px-2 py-[2px] rounded-[16px] text-xs font-medium",
                row.original.recurringInvestmentStatus === "Active"
                  ? "bg-[#ECFDF3] text-[#067647] border border-[#ABEFC6]"
                  : row.original.recurringInvestmentStatus === "Inactive"
                    ? "bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89]"
                    : "bg-[#F7F7F7] text-[#373A41] border border-[#ECECED]"
              )}
            >
              {row.original.recurringInvestmentStatus}
            </span>
          </div>
        ),
      },
    ];

    return activeTab === "recurring" || activeTab === "all"
      ? [...baseColumns, ...recurringColumns, dateRangeColumn]
      : [...baseColumns, dateRangeColumn];
  }, [activeTab]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  return (
    <div className="relative h-full pt-24 bg-gradient-to-b from-[#79B7BC]/5 via-[#AEDCE0]/5 to-[#FFFFFF] px-[112px]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-[#181D27] font-semibold text-[48px]">
            Investment
          </h1>
          <p>Secure long-term returns and grow your crypto holdings.</p>
        </div>
        <Link
          href="/dashboard/create-investment"
          className="bg-[#008B99] py-2.5 px-3.5 rounded-[8px] text-white"
        >
          Begin Investment
        </Link>
      </div>
      <Balances />

      {/* Tabs */}
      <div className="px-6 py-3 rounded-t-[12px] border border-[#E9EAEB] flex gap-1 items-center justify-between bg-[#fcfcfc] mt-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap p-0 h-fit !bg-none border rounded-[8px] w-full md:flex-nowrap md:w-fit border-[#D5D7DA]">
            <TabsTrigger
              className="w-full md:w-fit text-[#414651] border-b-[0.5px] md:border-r-[0.5px] border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white rounded-t-[8px] md:rounded-tr-none md:rounded-l-[8px]"
              value="all"
            >
              View All
            </TabsTrigger>
            <TabsTrigger
              className="w-full md:w-fit text-[#414651]  rounded-none border-y-[0.5px] md:order-y-none md:border-x-[0.5px] border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white"
              value="recurring"
            >
              Recurring Investment
            </TabsTrigger>
            <TabsTrigger
              className="w-full md:w-fit text-[#414651] md:border-l-[0.5px] border-t-[0.5px] md:border-t-0 border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white rounded-b-[8px] md:rounded-bl-none md:rounded-r-[8px]"
              value="one-time"
            >
              One-time Investment
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-[#414651] text-sm font-medium flex items-center gap-3 lg:gap-7">
          <div className="flex items-center gap-[6px]">
            <span className="text-nowrap">Next Recurring Investment</span>
            <span>18h:23m</span>
          </div>
          <Button className="border border-[#D5D7DA] rounded-[8px] text-[#414651] bg-transparent hover:bg-transparent">
            <CloudDownload color="#A4A7AE" size={16} /> Export
          </Button>
        </div>
      </div>

      {/* Table with Dialog */}
      <div className="overflow-hidden rounded-md border rounded-b-[12px] mb-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="px-6" key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedRow(row.original)} // pick row data
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border border-[#E9EAEB] bg-[#fcfcfc] rounded-b-[12px]">
          <div className="text-sm font-medium text-[#414651]">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              className="bg-white border py-2 px-3.5 text-[#414651 text-sm] border-[#D5D7DA] rounded-[8px]"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              className="bg-white border py-2 px-3.5 text-[#414651 text-sm] border-[#D5D7DA] rounded-[8px]"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={!!selectedRow}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedRow(null);
            setShowConfirm(false);
          }
        }}
      >
        <DialogContent className="p-6 !rounded-[16px] bg-white max-w-[400px] h-fit max-h-full overflow-y-auto overflow-x-hidden">
          {selectedRow && !showConfirm && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#181D27] text-center text-[30px] font-medium mb-6">
                  Investment Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-2 text-sm bg-[#FAFAFA] w-full">
                {/* Top Info */}
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-[#717680] font-semibold">
                    Investment ID
                  </span>
                  <span className="text-[#717680] ">{selectedRow.id}</span>
                </div>
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-[#717680] font-semibold">
                    Start / End Date
                  </span>
                  <div className="flex flex-col items-end text-[#717680]">
                    <span>
                      {selectedRow.dateRange.startDate.toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-xs">
                      {selectedRow.dateRange.endDate.toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#D5D7DA] mt-[10px]" />

                {/* Categories */}
                <div className="flex items-center justify-between text-sm py-2 px-3 mb-4">
                  <span className="text-[#717680] font-medium">
                    Investment Categories
                  </span>
                  <span className="text-[#717680] font-medium">
                    Amount Invested
                  </span>
                </div>

                {selectedRow.profiles?.map((category: string, idx: number) => {
                  const durationDays = parseInt(selectedRow.duration);
                  const dailyTotal =
                    selectedRow.investmentType === "recurring"
                      ? selectedRow.usdcValue / durationDays
                      : 0;

                  const dailyPerProfile =
                    selectedRow.investmentType === "recurring"
                      ? (dailyTotal / selectedRow.profiles.length).toFixed(2)
                      : null;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 px-3"
                    >
                      <span className="text-[#717680] font-semibold">
                        {category}
                      </span>
                      <div className="flex flex-col items-end">
                        <span className="text-[#717680]">
                          {(
                            selectedRow.usdcValue / selectedRow.profiles.length
                          ).toFixed(2)}{" "}
                          USDC
                        </span>
                        {dailyPerProfile && (
                          <span className="text-[#717680] text-xs">
                            Daily Debit: {dailyPerProfile} USDC
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-[#D5D7DA] mt-[10px]" />

                {/* Duration */}
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-[#717680] font-semibold">Duration</span>
                  <span className="text-[#717680] ">
                    {selectedRow.duration}
                  </span>
                </div>

                {/* Daily deduction for recurring */}
                {selectedRow.investmentType === "recurring" && (
                  <div className="flex items-center justify-between py-2 px-3">
                    <span className="text-[#717680] font-semibold">
                      Daily Debit
                    </span>
                    <span className="text-[#717680] ">
                      {selectedRow.deductedDaily} USDC
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-[#717680] font-semibold">
                    Total Investment
                  </span>
                  <span className="text-[#717680] ">
                    {selectedRow.usdcValue} USDC
                  </span>
                </div>

                {selectedRow.investmentType === "recurring" && (
                  <div className="border-t border-[#D5D7DA] mt-[10px]" />
                )}

                {/* Unrealized (always shown) */}
                <div className="flex items-center justify-between py-2 px-3">
                  <span className="text-[#717680] font-semibold">
                    Unrealized gain/loss (%)
                  </span>
                  <span className="text-[#717680] ">
                    {selectedRow.unrealized}%
                  </span>
                </div>

                {/* Status (only for recurring) */}
                {selectedRow.investmentType === "recurring" && (
                  <div className="flex items-center justify-between py-2 px-3">
                    <span className="text-[#717680] font-semibold">Status</span>
                    <span className="text-[#717680] ">
                      <span className="border border-[#D5D7DA] px-[6px] py-[2px] bg-white rounded-[6px] flex items-center gap-1">
                        <div
                          className={`size-[6px] inline-block rounded-full ${selectedRow.recurringInvestmentStatus === "Active" ? "bg-[#17B26A]" : "bg-[#F79009]"}`}
                        ></div>{" "}
                        {selectedRow.recurringInvestmentStatus}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3">
                {selectedRow.investmentType === "recurring" ? (
                  <>
                    <Button
                      className="h-12 w-full bg-[#008B99] hover:bg-[#008B99] text-white font-semibold rounded-[8px]"
                      onClick={() => setShowConfirm(true)}
                    >
                      {selectedRow.recurringInvestmentStatus === "Active"
                        ? "Deactivate Recurring Investment"
                        : "Activate Recurring Investment"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 w-full rounded-[8px] border border-gray-300"
                      onClick={() => setSelectedRow(null)}
                    >
                      Go Back
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-[8px] border border-gray-300"
                    onClick={() => setSelectedRow(null)}
                  >
                    Go Back
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Confirmation screen */}
          {selectedRow && showConfirm && (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  {selectedRow.recurringInvestmentStatus === "Active" ? (
                    <div className="bg-[#F04438] p-4 rounded-full">
                      <CirclePause size={20} color="white" />
                    </div>
                  ) : (
                    <div className="bg-[#17B26A] p-4 rounded-full">
                      <CirclePlay size={20} color="white" />
                    </div>
                  )}
                </div>
                <DialogTitle className="text-lg font-semibold text-[#181D27] text-center mb-[2px]">
                  {selectedRow.recurringInvestmentStatus === "Active"
                    ? "Pause Recurring Investment"
                    : "Activate Recurring Investment"}
                </DialogTitle>
              </DialogHeader>

              <p className="text-[#535862] text-center">
                {selectedRow.recurringInvestmentStatus === "Active"
                  ? "Are you sure you want to pause your recurring investment?"
                  : "Are you sure you want to activate recurring investment?"}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                <Button className="bg-[#008B99] hover:bg-[#008B99] text-white font-semibold rounded-[8px]">
                  {selectedRow.recurringInvestmentStatus === "Active"
                    ? "Yes, I want to Pause"
                    : "Yes, I want to Activate"}
                </Button>
                <Button
                  variant="outline"
                  className="rounded-[8px] border border-gray-300 font-semibold"
                  onClick={() => setShowConfirm(false)}
                >
                  No, I don&apos;t
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
