import { Button } from "@/components/ui/button";
import { Table as TanStackTable } from "@tanstack/react-table";
import { Asset } from "./CryptoAssetMarketTable";
import { useMemo, useState } from "react";

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
    <div className="flex justify-center items-center gap-2 py-4 select-none flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!table.getCanPreviousPage() || isChanging}
        className="rounded-[8px]"
      >
        Previous
      </Button>

      {getPageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page as number)}
            disabled={isChanging}
            className={`rounded-[8px] ${page === currentPage ? "bg-[#008B99]" : ""}`}
          >
            {(page as number) + 1}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!table.getCanNextPage() || isChanging}
        className="rounded-[8px]"
      >
        Next
      </Button>
    </div>
  );
}
