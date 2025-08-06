"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const notificationsAndEmailsFaqs = [
    {
        question: "What emails will I receive from Omora?",
        answer: "You'll receive alerts for logins, wallet activity, portfolio activity, approvals, operator changes, insights, and product updates."
    },
    {
        question: "Can I turn off certain notifications?",
        answer: "Yes. Go to Settings → Notifications and toggle preferences."
    },
    {
        question: "Will I be notified when my Operator requests a withdrawal?",
        answer: " Absolutely. Corporate admins receive email + in-app alerts for any operator-initiated transactions."
    },
]

export default function NotificationsAndEmails() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {notificationsAndEmailsFaqs.map((faq, index) => (
        <AccordionItem className={`${faq.question === notificationsAndEmailsFaqs[notificationsAndEmailsFaqs.length - 1].question ? "border-none" : ""}`} key={index} value={`item-${index + 1}`}>
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
