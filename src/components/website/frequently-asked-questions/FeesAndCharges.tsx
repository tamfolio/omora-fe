"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export default function FeesAndCharges() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      <AccordionItem className="border-none" value="item-1">
        <AccordionTrigger className="[&>svg]:hidden text-[#181D27] font-semibold text-base">
          What fees does Omora charge?
          <span>
            {openItem === `item-1` ? (
              <Image
                src="/assets\images\website\minus-circle.svg"
                alt="minus"
                width={24}
                height={24}
              />
            ) : (
              <Image
                src="/assets\images\website\plus-circle.svg"
                alt="plus"
                width={24}
                height={24}
              />
            )}
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-[#535862] font-normal text-base">
          <span className="mb-10">We charge 2 fees:</span>
          <ul className="list-disc pl-5 mt-4">
            <li>
              Management Fee: A 2% annual fee on assets under management (AUM),
              charged monthly.
            </li>
            <li>
              Performance Fee: Omora earns a 5% fee on net gains only when a
              client&apos;s portfolio exceeds its previous peak.
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
