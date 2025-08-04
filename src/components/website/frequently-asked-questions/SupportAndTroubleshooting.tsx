"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const supportAndTroubleshooting = [
    {
        question: "I've spotted suspicious activity. What should I do?",
        answer: "Immediately change your password and contact your Relationship Manager by selecting the Help Button on your dashboard"
    },
    {
        question: " My transaction is delayed. What should I do?",
        answer: "Check your transaction history for real-time updates. If it's beyond the estimated timeline, contact your Relationship Manager "
    },
    {
        question: "How do I contact the Omora support team?",
        answer: "Your Relationship Manager is available 7 days a week. Alternatively, you can also leave an email to us on hello@omora.africa"
    },
]

export default function SupportAndTroubleshooting() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {supportAndTroubleshooting.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
        <AccordionTrigger className="[&>svg]:hidden text-[#181D27] font-semibold text-base">
          {faq.question}
          <span>{openItem === `item-${index + 1}` ? (<Image src="/assets\images\website\minus-circle.svg" alt={faq.question} width={24} height={24} />) : (<Image src="/assets\images\website\plus-circle.svg" alt={faq.question} width={24} height={24} />)}</span>
        </AccordionTrigger>
        <AccordionContent className="text-[#535862] font-normal text-base">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
      ))}
    </Accordion>
  );
}