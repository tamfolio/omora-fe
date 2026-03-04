"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const kycFaqs = [
  {
    question: "Do I need to complete KYC to use Omora?",
    answer:
      "Yes. KYC is required before you can fund your wallet or begin investing.",
  },
  {
    question: "What are the KYC requirements for individuals?",
    answer:
      "A valid government-issued ID, proof of address (e.g., utility bill, bank statement) and a selfie verification.",
  },
  {
    question: "What are the KYC requirements for corporate accounts?",
    answer:
      "Company registration documents, company utility bill, company account details, and ID of a designated Admin.",
  },
  {
    question: "How long does KYC verification take?",
    answer:
      " Individual KYC is typically approved within 30-60 minutes. Corporate KYC may take up to 48 hours.",
  },
  {
    question: "Can I invest before completing KYC?",
    answer:
      "No. Funding and investments are locked until your KYC is approved.",
  },
];

export default function Kyc() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-full max-w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {kycFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === kycFaqs[kycFaqs.length - 1].question ? "border-none" : ""}`}
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
