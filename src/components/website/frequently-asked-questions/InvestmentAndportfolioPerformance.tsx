"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const teamManagementFaqs = [
  {
    question: "How does Omora's auto-invest feature work?",
    answer:
      "Once you set your USDT amount, tenor, and daily DCA rate, Omora automatically allocates funds daily across tokens aligned with your chosen risk profile.",
  },
  {
    question: "What is a risk profile?",
    answer:
      "It's a way to match your comfort level with market volatility. You can choose Conservative (Low Risk), Balanced (Medium Risk), or Aggressive (High Risk). We also help you determine the best fit via our risk profiling quiz.",
  },
  {
    question: "What tokens do I invest in?",
    answer:
      "Omora selects a curated list of large-cap and trending tokens depending on your risk level (e.g., BTC, ETH, SOL, etc.).",
  },
  {
    question: " Can I pause my investments?",
    answer:
      "Yes. You can pause your daily auto-invest anytime and resume when you're ready. During volatile periods, Omora may also auto-pause to protect your funds.",
  },
  {
    question: "Where can I track my investment performance?",
    answer:
      "On your Portfolio Dashboard, you can see your total portfolio value, average buy prices, unrealized gains/losses, and ROI across different timeframes right on your dashboard.",
  },
  {
    question: "What happens after my tenor ends?",
    answer:
      "Your returns are moved to your USDT wallet. You can choose to convert them to NGN or reinvest.",
  },
  {
    question: "What kind of ROI can I expect?",
    answer:
      "Returns vary depending on market sentiment and performance. Past returns are viewable in your dashboard.",
  },
  {
    question: " Where can I track my investment performance?",
    answer:
      " On your Portfolio Dashboard, you can see your ROI, average price, capital growth, and more.",
  },
  {
    question: "What is rebalancing?",
    answer:
      "Omora periodically adjusts portfolio weights based on market changes. You'll be notified and must approve any rebalancing before it takes effect.",
  },
  {
    question: " Is the exchange rate fixed at the time of conversion?",
    answer: "Yes. The rate is locked in when you confirm a conversion.",
  },
];

export default function InvestmentAndportfolioPerformance() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {teamManagementFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === teamManagementFaqs[teamManagementFaqs.length - 1].question ? "border-none" : ""}`}
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
