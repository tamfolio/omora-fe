"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const legalAndComplianceFaqs = [
    {
        question: "Where can I read your terms and policies?",
        answer: "Our Terms of Use, Privacy Policy, Cookies Policy, and Risk Disclosure are available in the footer of our site."
    },
    {
        question: "Do you report my investments to tax authorities?",
        answer: "Currently, Omora does not file taxes on your behalf. Please consult a tax advisor regarding your crypto earnings."
    },
];

export default function LegalAndCompliance() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {legalAndComplianceFaqs.map((faq, index) => (
        <AccordionItem className={`${faq.question === legalAndComplianceFaqs[legalAndComplianceFaqs.length - 1].question ? "border-none" : ""}`} key={index} value={`item-${index + 1}`}>
        <AccordionTrigger className="[&>svg]:hidden text-[#181D27] font-semibold text-base">
          {faq.question}
          <span>{openItem === `item-${index + 1}` ? (<Image src="/assets/images/website/minus-circle.svg" alt={faq.question} width={24} height={24} />) : (<Image src="/assets\images\website\plus-circle.svg" alt={faq.question} width={24} height={24} />)}</span>
        </AccordionTrigger>
        <AccordionContent className="text-[#535862] font-normal text-base">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
      ))}
    </Accordion>
  );
}