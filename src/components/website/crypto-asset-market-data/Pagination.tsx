import { Button } from "@/components/ui/button";
import { Table as TanStackTable } from "@tanstack/react-table";
import { Asset } from "./CryptoAssetMarketTable";
import { useMemo, useState } from "react";
import Image from "next/image";

interface PaginationProps {
  table: TanStackTable<Asset>;
}

export default function Pagination({ table }: PaginationProps) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const [isChanging, setIsChanging] = useState(false);

  const getPageNumbers = useMemo((): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    if (currentPage > 2) {
      pages.push(0);
      if (currentPage > 3) pages.push("...");
    }

    const startPage = Math.max(0, currentPage - 1);
    const endPage = Math.min(pageCount - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < pageCount - 3) {
      pages.push("...");
      pages.push(pageCount - 1);
    }

    return pages;
  }, [pageCount, currentPage]);

  const handlePageChange = (pageIndex: number) => {
    if (isChanging) return; // prevent double-click mess
    setIsChanging(true);
    table.setPageIndex(pageIndex);
    setTimeout(() => setIsChanging(false), 150); // debounce clicks
  };

  return (
    <div className="flex justify-between items-center gap-2 py-4 select-none flex-wrap mt-5">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!table.getCanPreviousPage() || isChanging}
        className="border border-[#D5D7DA] rounded-[8px] px-3 py-2 text-[#414651]"
      >
        <Image
          src="/assets/images/website/arrow-left.svg"
          alt="arrow-right"
          width={20}
          height={20}
        />
        Previous
      </Button>

      <div>
        {getPageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? "default" : "outline"}
              onClick={() => handlePageChange(page as number)}
              disabled={isChanging}
              className={`rounded-[8px] size-10 ${page === currentPage ? "bg-[#008B99] hover:bg-[#008B99]" : "border-none"}`}
            >
              {(page as number) + 1}
            </Button>
          ),
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!table.getCanNextPage() || isChanging}
        className="border border-[#D5D7DA] rounded-[8px] px-3 py-2 text-[#414651]"
      >
        Next
        <Image
          src="/assets/images/website/arrow-right.svg"
          alt="arrow-right"
          width={20}
          height={20}
        />
      </Button>
    </div>
  );
}
