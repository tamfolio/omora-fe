"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const security2faFaqs = [
  {
    question: "Is Two-Factor Authentication (2FA) mandatory?",
    answer:
      "Yes, for logins, all withdrawals as well as sensitive actions like approving requests or converting funds.",
  },
  {
    question: "How do I enable or disable 2FA on my account?",
    answer:
      "You will be asked to set up your 2FA using Google Authenticator at your first login.",
  },
  {
    question: "Which actions on Omora require 2FA?",
    answer:
      "Login, withdrawals, conversion between NGN and USDT, and approving fund/withdrawal requests by operators.",
  },
  {
    question: "What happens if I lose access to my Google Authenticator?",
    answer:
      "Contact your Relationship Manager or Support with your verified identity. We'll help you regain access securely.",
  },
  {
    question: "How do I know my funds are safe on Omora?",
    answer:
      "Crypto is volatile. Omora uses smart investment pacing (DCA) and real-time risk signals to reduce your exposure and preserve capital where possible. You can also pause anytime.",
  },
  {
    question: "Is my data protected?",
    answer:
      "Absolutely. Your personal and financial data is protected with industry-standard encryption and never sold to third parties.",
  },
];

export default function Security2fa() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {security2faFaqs.map((faq, index) => (
        <AccordionItem
          className={`${faq.question === security2faFaqs[security2faFaqs.length - 1].question ? "border-none" : ""}`}
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
