"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const generalPlatformFaqs = [
    {
        question: "What is OMORA?",
        answer: "Omora is a premium crypto investment automation platform built for high-net-worth individuals and institutions. It offers smart, secure, and effortless portfolio growth by combining AI-driven insights, auto-investment strategies, and institutional-grade tools."
    },
    {
        question: "How does Omora simplify crypto investing for HNIs?",
        answer: "We eliminate the stress of market timing and manual trades. Omora automates investments in stable crypto assets like USDT, uses AI sentiment signals to pause/restart positions, and provides transparency via a personal dashboard — all without needing users to be crypto experts."
    },
    {
        question: "Is Omora licensed or regulated?",
        answer: "Omora works with licensed third-party custodians and payment processors. We also follow industry KYC/AML standards to keep your account secure and compliant."
    },
    {
        question: "Who can use Omora? Individuals, companies, or both?",
        answer: "Both. We support individual HNIs and corporate entities. Companies can onboard multiple users to serve as operators who are able to initiate transactions on behalf of the company."
    },
    {
        question: "What asset classes does Omora support?",
        answer: "Currently, we support stablecoin investing (e.g., USDT), with NGN as the local fiat. We are exploring more crypto asset classes and portfolio diversification options in the near future."
    },
    // {
    //     question: "",
    //     answer: ""
    // },
]

export default function GeneralPlatform() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");

  return (
    <Accordion
      onValueChange={(value) => setOpenItem(value)}
      type="single"
      className="w-[768px] mx-auto"
      collapsible
      defaultValue="item-1"
    >
      {generalPlatformFaqs.map((faq, index) => (
        <AccordionItem className={`${faq.question === generalPlatformFaqs[generalPlatformFaqs.length - 1].question ? "border-none" : ""}`} key={index} value={`item-${index + 1}`}>
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
