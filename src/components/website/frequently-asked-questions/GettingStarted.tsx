"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const gettingStartedFaqs = [
  {
    question: "How do I fund my Omora wallet?",
    answer:
      "Individuals and corporate users receive a virtual NGN account to fund, which can then be converted to USDT at the prevailing market rate.",
  },
  {
    question: "Do I need to complete a risk profile before investing?",
    answer:
      "Yes. It's a short form to tailor your experience and unlock investing features",
  },
  {
    question: " What happens after I fund my wallet?",
    answer:
      "You’ll receive a confirmation email. Then, your funds are either left as balance or converted to USDT and auto-invested based on your settings.",
  },
  {
    question: "What is the minimum amount I can invest?",
    answer: "A minimum of $100 or its equivalent.",
  },
];

export default function GettingStarted() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {gettingStartedFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === gettingStartedFaqs[gettingStartedFaqs.length - 1].question ? "border-none" : ""}`}
          key={index}
          value={`item-${index + 1}`}
        >
          <AccordionTrigger className="[&>svg]:hidden text-[#181D27] font-semibold text-base">
            {faq.question}
            <span>
              {openItem === `item-${index + 1}` ? (
                <Image
                  src="/assets\images\website\minus-circle.svg"
                  alt={faq.question}
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/assets\images\website\plus-circle.svg"
                  alt={faq.question}
                  width={24}
                  height={24}
                />
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="text-[#535862] font-normal text-base">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
