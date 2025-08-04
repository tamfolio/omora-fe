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
        question: "How do I fund my OMORA wallet?",
        answer: "Once your account is verified, you can fund your NGN wallet using bank transfer. Your funds can then be converted to USDT to begin investing."
    },
    {
        question: "How do I convert NGN to USDT or vice versa?",
        answer: "Simply click “Convert” on your wallet dashboard, enter the amount, and confirm with 2FA."
    },
    {
        question: "Where can I view my wallet and transaction history?",
        answer: "In your dashboard under “Wallet” → “Transaction History” with filter options and downloadable reports."
    },
    {
        question: "Can I withdraw anytime?",
        answer: "You can withdraw your NGN wallet balance at any time. For USDT, withdrawals are only allowed after your investment tenor ends."
    },
    {
        question: "What is the FX conversion rate?",
        answer: "We use live market rates for all conversions (on-ramp and off-ramp)."
    },
    {
        question: " How do I track fees charged by Omora?",
        answer: "Every transaction shows a breakdown, including fees charged. You can also download your full fee summary."
    },
    {
        question: "Is there a limit to how much I can fund or withdraw?",
        answer: " Yes, default limits apply and are dynamic"
    },
]

export default function WalletAndTransactions() {
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
