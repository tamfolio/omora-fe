"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { CryptoAssetMarketTable } from "@/components/website/crypto-asset-market-data/CryptoAssetMarketTable";

export default function CryptoAssetMarketData() {
  const [tokenSearchValue, setTokenSearchValue] = useState<string | null>(null);

  const searchForToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(tokenSearchValue);
  };
  return (
    <div>
      <div className="flex flex-col gap-6 justify-center items-center text-center pt-24 pb-10 bg-[#fafcfd]">
        <h1 className="text-[#181D27] font-semibold text-[48px]">
          Crypto Asset Market Data
        </h1>
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => searchForToken(e)}
        >
          <div className="relative flex items-center w-[320px]">
            <Input
              onChange={(e) => setTokenSearchValue(e.target.value)}
              placeholder="Search"
              className="py-[10px] pl-[14px] pr-[30px] rounded-[8px] w-full border border-[#D5D7DA] bg-transparent focus-visible:ring-[#008B99]"
              type="text"
            />
            <Image
              className="absolute right-3"
              src="/assets/images/website/search.svg"
              alt="search"
              width={16}
              height={16}
            />
          </div>
        </form>
      </div>

      <CryptoAssetMarketTable searchValue={tokenSearchValue} />
    </div>
  );
}
