"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const reportingAndInsightsFaqs = [
  {
    question: "Will I receive regular market insights or updates?",
    answer:
      "Yes. We publish simplified insights weekly and during key market events.",
  },
  {
    question: "How do I subscribe to Omora insights and updates?",
    answer:
      "All users are auto-subscribed. You can manage this in Notification Preferences.",
  },
  {
    question: "How are my investment and activity logs reported?",
    answer:
      "Through your dashboard and email. You’ll also get downloadable summaries and tax-friendly reporting formats.",
  },
];

export default function ReportingAndInsights() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-full max-w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {reportingAndInsightsFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === reportingAndInsightsFaqs[reportingAndInsightsFaqs.length - 1].question ? "border-none" : ""}`}
          key={index}
          value={`item-${index + 1}`}
        >
          <AccordionTrigger className="[&>svg]:hidden text-[#181D27] font-semibold text-base text-left gap-4">
            {faq.question}
            <span className="shrink-0 ml-4 flex items-center justify-center">
              {openItem === `item-${index + 1}` ? (
                <Image
                  src="/assets/images/website/minus-circle.svg"
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
