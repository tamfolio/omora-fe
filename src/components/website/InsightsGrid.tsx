"use client";

import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { insightsData, InsightType } from "@/app/(website)/insights/data";

export default function InsightsGrid() {
  const [filter, setFilter] = useState<InsightType | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredInsights = useMemo(() => {
    if (filter === "All") return insightsData;
    return insightsData.filter((item) => item.type === filter);
  }, [filter]);

  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInsights.slice(start, start + itemsPerPage);
  }, [filteredInsights, currentPage]);

  function getPaginationButtons() {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 6;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);

      if (left > 2) {
        pages.push("...");
      }

      for (let i = left; i <= right; i++) {
        pages.push(i);
      }

      if (right < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <section className="px-[112px]">
      <div className="flex justify-between items-center mb-16">
        <div className="flex gap-2 items-center bg-[#f9f9f9] border border-[#E9EAEB] rounded-[8px]">
          {["All", "Bullish", "Bearish", "Neutral"].map((type) => (
            <Button
              key={type}
              onClick={() => {
                setFilter(type as InsightType | "All");
                setCurrentPage(1);
              }}
              className={`px-3 py-2 bg-transparent text-[#717680] hover:bg-white ${
                filter === type
                  ? "bg-white text-[#414651] border rounded-[8px] border-[#D5D7DA]"
                  : "bg-transparent border-[#E9EAEB]"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        <Select>
          <SelectTrigger className="w-[168px] rounded-[8px] border border-[#D5D7DA]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center mb-[138px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.map((insights, index) => (
            <Link href={`/insights/${index + 1}`} key={index} className="block">
              <div key={index} className="w-full">
                <div className="relative mb-[10px]">
                  <Image
                    className="rounded-t-[10px] w-full"
                    src={insights.image}
                    alt={insights.title}
                    height={256}
                    width={384}
                  />
                  <div className="absolute size-10 rounded-full flex items-center justify-center bg-[#FFFFFF50] right-5 top-4">
                    <Image
                      className="mt-3"
                      src="/assets/images/website/bookmark.svg"
                      alt="bookmark"
                      height={24}
                      width={24}
                    />
                  </div>
                </div>
                <div
                  className={`${insights.type === "Bullish" ? "bg-[#F3FEE7] border-[#D0F8AB]" : insights.type === "Bearish" ? "bg-[#FEF3F2] border-[#FECDCA]" : "bg-[#FAFAFA] border-[#E9EAEB]"} p-1 pr-3 min-w-[144px] w-fit rounded-full border text-xs font-medium mb-3 flex gap-2 justify-between items-center`}
                >
                  <span
                    className={`py-[2px] px-2 bg-white rounded-full ${insights.type === "Bullish" ? "text-[#326212] border-[#66C61C]" : insights.type === "Bearish" ? "text-[#B42318] border-[#FECDCA]" : "text-[#414651] border-[#E9EAEB]"} border`}
                  >
                    {insights.type}
                  </span>
                  <span className="text-[#535862] text-xs">
                    {insights.readingTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[#181D27] text-[18px] mb-1">
                    {insights.title}
                  </h2>{" "}
                  <Image
                    src="/assets/images/website/arrow-up-right.svg"
                    width={24}
                    height={24}
                    alt="arrow-up-right"
                  />
                </div>
                <p className="text-[#535862] text-base mb-5">
                  {insights.description}
                </p>
                <div className="text-[#535862] text-sm flex iteems-center justify-between">
                  <span>{insights.date}</span>
                  <span>{insights.source}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between flex-wrap mb-[194px] border-t border-[#E9EAEB] pt-[22px]">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
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
        <div className="flex gap-1">
          {getPaginationButtons().map((page, idx) =>
            page === "..." ? (
              <span key={idx} className="px-3 py-2">
                ...
              </span>
            ) : (
              <Button
                key={`page-${page}-${idx}`}
                onClick={() => setCurrentPage(page as number)}
                variant={page === currentPage ? "default" : "outline"}
                className={`size-10 rounded-[8px] ${
                  currentPage === page
                    ? "bg-[#00717D] hover:bg-[#00717D] text-white"
                    : "bg-transparent text-[#717680] border-none"
                }`}
              >
                {page}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
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
    </section>
  );
}
