"use client"

import Balances from "@/components/investment/Balances"
import Link from "next/link"
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"

// Types
type InvestmentType = "recurring" | "one-time"
type InvestmentProfile = "conservative" | "bitcoin ETF" | "growth"

export type Investment = {
  id: string
  investmentType: InvestmentType
  profiles: InvestmentProfile[]
  recurringInvestmentStatus: boolean
  usdcValue: number
  timestamp: Date
}

// Mock Data
const data: Investment[] = [
  {
    id: "1",
    investmentType: "recurring",
    profiles: ["conservative"],
    recurringInvestmentStatus: true,
    usdcValue: 1200,
    timestamp: new Date("2025-07-15T12:00:00"),
  },
  {
    id: "2",
    investmentType: "one-time",
    profiles: ["bitcoin ETF", "growth"],
    recurringInvestmentStatus: false,
    usdcValue: 500,
    timestamp: new Date("2025-07-14T15:30:00"),
  },
  {
    id: "3",
    investmentType: "recurring",
    profiles: ["growth"],
    recurringInvestmentStatus: false,
    usdcValue: 3000,
    timestamp: new Date("2025-07-13T09:45:00"),
  },
]

// Separate component to handle Switch state
function RecurringInvestmentStatusCell({
  initialStatus,
}: {
  initialStatus: boolean
}) {
  const [checked, setChecked] = useState(initialStatus)

  return (
    <div className="flex items-center justify-center space-x-2">
      <Switch
        className="data-[state=checked]:bg-[#008B99]"
        checked={checked}
        onCheckedChange={(value) => setChecked(value)}
      />
      <span>{checked ? "Active" : "Inactive"}</span>
    </div>
  )
}


// Columns
const columns: ColumnDef<Investment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        className="px-0 gap-1 flex w-full"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Investment ID
        <ChevronsUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="!text-sm text-center text-[#181D27] font-medium">#{row.original.id}</div>,
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
        <ChevronsUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original.investmentType
      const profiles = row.original.profiles.join(", ")
      const label =
        type === "recurring"
          ? `Recurring Investment (${profiles})`
          : `One-time Investment (${profiles})`
      return <div className="!text-sm text-[#181D27] font-medium">{label}</div>
    },
  },
  {
    accessorKey: "usdcValue",
    header: ({ column }) => (
      <Button
        className="px-0 gap-1 w-full flex text-xs text-[#717680] font-semibold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        USDC Value
        <ChevronsUpDown className="ml-l h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("usdcValue") as number
      return (
        <div className="text-sm text-center">
          {amount.toLocaleString()} USDC
        </div>
      )
    },
  },
  {
    accessorKey: "recurringInvestmentStatus",
    header: ({ column }) => (
      <Button
        className="px-0 gap-1 flex text-xs text-[#717680] w-full font-semibold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Recurring Investment Status
        <ChevronsUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <RecurringInvestmentStatusCell
      initialStatus={row.original.recurringInvestmentStatus}
    />
    ),
    sortingFn: (a, b) => {
      return (
        Number(a.original.recurringInvestmentStatus) - Number(b.original.recurringInvestmentStatus)
      )
    },
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        className="px-0 gap-1 w-full justify-end flex text-xs text-[#717680] font-semibold"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Timestamp
        <ChevronsUpDown className="ml-l h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("timestamp") as Date
      return (
        <div className="text-right">
          <div>
            {date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            })}
          </div>
          <div className="w--[100px]">
            {date.toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          </div>
        </div>
      )
    },
  },
]

export default function Investments() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [activeTab, setActiveTab] = useState("all")
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const filteredData = useMemo(() => {
    if (activeTab === "all") return data
    if (activeTab === "recurring") {
      return data.filter((d) => d.investmentType === "recurring")
    }
    if (activeTab === "one-time") {
      return data.filter((d) => d.investmentType === "one-time")
    }
    return data
  }, [activeTab])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  })

  return (

    <div className="relative pt-24 h-screen bg-gradient-to-b from-[#79B7BC]/5 via-[#AEDCE0]/5 to-[#FFFFFF] px-[112px]">
      <Navbar />
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

      <div>
        {/* Tabs */}
        <div className="px-6 py-3 rounded-t-[12px] border border-[#E9EAEB] bg-[#fcfcfc] mt-20">
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
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="px-6" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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
    </div>
  )
}
