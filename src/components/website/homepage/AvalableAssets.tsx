import React from "react";
import { Button } from "../../ui/button";

const assets = [
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
  {
    name: "XRP",
    price: 3.84,
    priceChange: -9.56,
  },
];

export default function AvailableAssets() {
  return (
    <section className="relative flex bg-[#0F1A2C] overflow-hidden">
      {assets.map((asset, index) => (
        <div
          className="border-[#26292B] border-l-[0.4px] my-3 border-r-[0.4px] px-4 py-1"
          key={index}
        >
          <div>
            <span className="text-[11.44px] font-semibold uppercase text-[#94979C]">
              {asset.name}
            </span>
          </div>
          <div className="flex justify-between gap-[43px] items-center">
            <span className="text-[#94979C] text-[10.5px]">${asset.price}</span>
            <span
              className={`${asset.priceChange < 0 ? "text-[#CE2C31]" : "text-[#94979C]"} text-[10.8px] font-semibold`}
            >
              {asset.priceChange}%
            </span>
          </div>
        </div>
      ))}
      <div className="absolute w-[240px] right-0 flex justify-end h-full items-center bg-[#0C0E12B2] pr-7">
        <Button className="bg-[#0F1A2C] hover:bg-[#0F1A2C] border border-[#373A41] px-3 py-2 rounded-[8px] text-[#CECFD2]">
          View all
        </Button>
      </div>
    </section>
  );
}
