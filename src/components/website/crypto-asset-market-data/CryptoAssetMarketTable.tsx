"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./Pagination";
import { useMemo, useState } from "react";
import Image from "next/image";

export type Asset = {
  name: string;
  sym: string;
  image: string;
  price: number;
  change24h: number;
  marketCap: number;
  supply: number;
};

// Mock data
const data: Asset[] = [
  { name: "Bitcoin", sym: "BTC", image: "/assets/images/crypto/bitcoin.svg", price: 64250, change24h: 2.15, marketCap: 1250000000000, supply: 19400000 },
  { name: "Ethereum", sym: "ETH", image: "/assets/images/crypto/ethereum.svg", price: 3450, change24h: -1.25, marketCap: 420000000000, supply: 120000000 },
  { name: "Solana", sym: "SOL", image: "/assets/images/crypto/solana.svg", price: 165, change24h: 4.5, marketCap: 75000000000, supply: 455000000 },
  { name: "Cardano", sym: "ADA", image: "/assets/images/crypto/cardano.svg", price: 0.42, change24h: 0.65, marketCap: 14500000000, supply: 34000000000 },
  { name: "XRP", sym: "XRP", image: "/assets/images/crypto/xrp.svg", price: 0.72, change24h: -0.5, marketCap: 38000000000, supply: 53000000000 },
  { name: "Dogecoin", sym: "DOGE", image: "/assets/images/crypto/dogecoin.svg", price: 0.085, change24h: 1.8, marketCap: 12000000000, supply: 140000000000 },
  { name: "Polkadot", sym: "DOT", image: "/assets/images/crypto/polkadot.svg", price: 7.8, change24h: -0.9, marketCap: 9700000000, supply: 1250000000 },
  { name: "Litecoin", sym: "LTC", image: "/assets/images/crypto/litecoin.svg", price: 92, change24h: 3.2, marketCap: 6800000000, supply: 74000000 },
  { name: "Aptos", sym: "APT", image: "/assets/images/crypto/chainlink.svg", price: 18.4, change24h: 2.7, marketCap: 10800000000, supply: 587000000 },
  { name: "Avalanche", sym: "AVAX", image: "/assets/images/crypto/avalanche.svg", price: 32.5, change24h: -1.1, marketCap: 12000000000, supply: 370000000 },
];

// Table columns
export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: () => (
      <span className="text-sm font-extralight text-[#717680] text-left w-[500px] xl:w-[752px] block">
        Asset
      </span>
    ),
    cell: ({ row }) => {
      const { name, sym } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Image
            src={`/assets/images/website/crpto-asset-market-data/${sym}.png`}
            alt={name}
            width={24}
            height={24}
          />
          <span className="font-extralight text-base text-[#181D27]">{name}</span>
          <span className="font-extralight text-[15.88px]  text-[#939598]">{sym}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <span className="text-sm font-extralight text-[#717680] text-right block">
        Price
      </span>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      return (
      <span className="text-right block">
        ${price.toLocaleString()}
      </span>
    );
    },
  },
  {
    accessorKey: "change24h",
    header: () => (
      <span className="text-sm font-extralight text-[#717680] text-right block">
        24h Change
      </span>
    ),
    cell: ({ row }) => {
      const change = parseFloat(row.getValue("change24h"));
      return (
        <span className={`${change >= 0 ? "text-green-500" : "text-[#ED492C]"} text-right block`}>
          {change.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "marketCap",
    header: () => (
      <span className="text-sm font-extralight text-[#717680] text-right block">
        Market Cap
      </span>
    ),
    cell: ({ row }) => {
      const cap = parseFloat(row.getValue("marketCap"));
      return (
      <span className="text-right block">
        ${cap.toLocaleString()}
      </span>
    );
    },
  },
  {
    accessorKey: "supply",
    header: () => (
      <span className="text-sm font-extralight text-[#717680] text-right block">
        Supply
      </span>
    ),
    cell: ({ row }) => {
      const supply = parseFloat(row.getValue("supply"));
      return (
      <span className="!text-right block">
        ${supply.toLocaleString()}
      </span>
    );
    },
  },
];


export function CryptoAssetMarketTable({ searchValue }: { searchValue: string | null }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 20,
});

  const filteredData = useMemo(() => {
    if (!searchValue) return data;
    return data.filter((asset) =>
      asset.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
    sorting,
    pagination,
  },
  });

  return (
    <div className="w-full px-4 pb-24">
      <div className="overflow-hidden border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className={`text-sm font-extralight text-[#717680] p-3`} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell className="text-base font-extralight text-[#181D27] p-5" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        <Pagination table={table} />
    </div>
  );
}
