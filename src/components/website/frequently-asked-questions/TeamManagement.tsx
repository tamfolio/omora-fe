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
    question: "Can I add my team members to the corporate dashboard?",
    answer:
      "Yes. Admins can add Operators and assign permissions via “Manage Users.",
  },
  {
    question: "What's the difference between Admin and Operator roles?",
    answer:
      "Admins control the full wallet, team permissions, and approve transactions. Operators have limited rights like initiating requests or viewing transactions.",
  },
  {
    question: "How do I deactivate or update an operator's permissions?",
    answer: "How do I deactivate or update an operator's permissions?",
  },
  {
    question: "How do I deactivate or update an operator's permissions?",
    answer:
      " Operators can initiate requests, but cannot complete withdrawals or conversions without Admin approval.",
  },
  {
    question: "Will Operators receive login credentials via email?",
    answer:
      "Yes. Once added by the Admin, they get a welcome email with setup instructions.",
  },
];

export default function TeamManagement() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-full max-w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {teamManagementFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === teamManagementFaqs[teamManagementFaqs.length - 1].question ? "border-none" : ""}`}
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
