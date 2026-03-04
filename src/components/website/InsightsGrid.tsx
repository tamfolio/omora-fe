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
    <section className="mt-8 md:mt-16 w-full">
      {/* Filters and Dropdown */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8 md:mb-12 w-full">
        
        {/* FIXED: Removed scroll, used flex-1 and adjusted mobile text/padding so all 4 buttons fit perfectly on one line */}
        <div className="w-full md:w-auto bg-[#f9f9f9] border border-[#E9EAEB] rounded-[8px] p-1">
          <div className="flex justify-between items-center gap-1 w-full">
            {["All", "Bullish", "Bearish", "Neutral"].map((type) => (
              <Button
                key={type}
                onClick={() => {
                  setFilter(type as InsightType | "All");
                  setCurrentPage(1);
                }}
                className={`flex-1 px-1 py-1.5 h-auto sm:px-4 sm:py-2 text-[12px] sm:text-sm bg-transparent text-[#717680] hover:bg-white whitespace-nowrap transition-all ${
                  filter === type
                    ? "bg-white text-[#414651] border rounded-[6px] shadow-sm border-[#D5D7DA]"
                    : "bg-transparent border-none shadow-none"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Dropdown Container */}
        <div className="w-full sm:w-[168px] shrink-0">
          <Select>
            <SelectTrigger className="w-full rounded-[8px] border border-[#D5D7DA] bg-white h-[40px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-12 md:mb-[138px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {currentItems.map((insights, index) => (
            <Link
              href={`/insights/${index + 1}`}
              key={index}
              className="block group"
            >
              <div className="w-full h-full flex flex-col">
                <div className="relative mb-4 overflow-hidden rounded-[10px]">
                  <Image
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105 aspect-[3/2]"
                    src={insights.image}
                    alt={insights.title}
                    height={256}
                    width={384}
                  />
                  <div className="absolute size-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm right-4 top-4 hover:bg-white/50 transition-colors">
                    <Image
                      src="/assets/images/website/bookmark.svg"
                      alt="bookmark"
                      height={20}
                      width={20}
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

                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-semibold text-[#181D27] text-lg md:text-[18px] leading-tight group-hover:text-[#00717D] transition-colors">
                    {insights.title}
                  </h2>
                  <Image
                    src="/assets/images/website/arrow-up-right.svg"
                    className="flex-shrink-0 mt-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    width={24}
                    height={24}
                    alt="arrow-up-right"
                  />
                </div>
                <p className="text-[#535862] text-sm md:text-base mb-5 line-clamp-2">
                  {insights.description}
                </p>

                <div className="text-[#535862] text-xs md:text-sm flex items-center justify-between mt-auto">
                  <span>{insights.date}</span>
                  <span>{insights.source}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center sm:justify-between items-center flex-wrap gap-4 mb-16 md:mb-[194px] border-t border-[#E9EAEB] pt-[22px]">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="border border-[#D5D7DA] rounded-[8px] px-3 py-2 text-[#414651]"
        >
          <Image
            src="/assets/images/website/arrow-left.svg"
            alt="arrow-left"
            width={20}
            height={20}
            className="mr-2"
          />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex gap-1 flex-wrap justify-center">
          {getPaginationButtons().map((page, idx) =>
            page === "..." ? (
              <span key={idx} className="px-2 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <Button
                key={`page-${page}-${idx}`}
                onClick={() => setCurrentPage(page as number)}
                variant={page === currentPage ? "default" : "outline"}
                className={`size-8 sm:size-10 rounded-[8px] ${
                  currentPage === page
                    ? "bg-[#00717D] hover:bg-[#00717D] text-white"
                    : "bg-transparent text-[#717680] border-none"
                }`}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="border border-[#D5D7DA] rounded-[8px] px-3 py-2 text-[#414651]"
        >
          <span className="hidden sm:inline">Next</span>
          <Image
            src="/assets/images/website/arrow-right.svg"
            alt="arrow-right"
            width={20}
            height={20}
            className="ml-2"
          />
        </Button>
      </div>
    </section>
  );
}