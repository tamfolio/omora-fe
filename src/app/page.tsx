"use client";
import React from "react";
import "./globals.css";
import { Button } from "@/components/ui/button";
import AvailableAssets from "@/components/website/homepage/AvalableAssets";
import Image from "next/image";
import Performance from "@/components/website/homepage/Performance";
import Testimonials from "@/components/website/homepage/Testimonials";
import Insights from "@/components/website/homepage/Insights";

const whyOmora = [
  {
    title: "Fund in Naira, not wallets",
    description:
      "Deposit into your Stanbic IBTC virtual account. No wallet setup needed.",
    icon: "/assets/images/website/message-chat-circle.svg",
  },
  {
    title: "AI-Driven Portfolio",
    description:
      "Our risk engine profiles you and recommends a smart, diversified portfolio.",
    icon: "/assets/images/website/zap.svg",
  },
  {
    title: "Daily Auto-Investments",
    description:
      "No timing stress. We invest daily using dollar-cost averaging (DCA).",
    icon: "/assets/images/website/chart-breakout-square.svg",
  },
  {
    title: "Fully Compliant & Secure",
    description:
      "KYC, AML, and real custody are all handled with trusted partners.",
    icon: "/assets/images/website/message-smile-circle.svg",
  },
];

const page = () => {
  return (
    <main>
      <section className="relative h-[800px]">
        {/* Grid background */}
        <div className='absolute inset-0 bg-[url("/assets/images/website/grid.svg")] bg-cover bg-no-repeat z-0'></div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[url('/assets/images/website/gradient.png')] bg-cover bg-no-repeat z-[5]"></div>

        <div className="pt-[180px] relative z-20">
          <h1 className="text-[81px] font-medium text-center max-w-[1084px] mx-auto text-wrap">
            Crypto investing, powered by AI. Fund in Naira, grow in digital
            assets.
          </h1>
          <p className="text-center w-[768px] mt-6 text-[20px] mx-auto">
            A secure, AI-guided investment platform for HNIs, Corporates &
            serious investors. Fund your Naira account. We&apos;ll handle the
            rest — daily, automatically.
          </p>
          <div className="flex items-center justify-center gap-3 mt-12 pb-[69px]">
            <Button className="px-[18px] py-3 w-fit text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white">
              Learn More
            </Button>
            <Button className="px-[18px] py-3 w-fit text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99]">
              Start Investing
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="flex justify-center mx-[120px]">
          <div className="h-[557px] w-full bg-[#535862] rounded-t-2xl"></div>
        </div>
      </section>
      <AvailableAssets />
      <section className="bg-[#FAFAFA] text-center py-20 space-y-10">
        <h2 className="text-[20px] font-medium">
          BACKED BY PARTNERS WHO BELIEVE IN SMARTER CRYPTO INVESTING
        </h2>
        <div className="flex gap-10 items-center justify-center">
          <Image
            src="/assets/images/website/partners/pennytree.png"
            width={251}
            height={48}
            alt="pennytree"
          />
          <Image
            src="/assets/images/website/partners/treegar.png"
            width={173}
            height={48}
            alt="treegar"
          />
          <Image
            src="/assets/images/website/partners/quidax.png"
            width={199}
            height={48}
            alt="quidax"
          />
          <Image
            src="/assets/images/website/partners/stanbic-ibtc.png"
            width={275}
            height={48}
            alt="stanbic-ibtc"
          />
        </div>
        <p className="w-[784px] mx-auto text-base font-medium">
          The companies listed represent current partners, infrastructure
          providers, and integrations and do not imply investment in Omora
          products.
        </p>
      </section>
      <section className="py-24 px-[112px]">
        <h3 className="font-semibold text-[#00717D] text-base mb-3">
          Why Omora?
        </h3>
        <p className="font-medium text-[#181D27] max-w-[868px] text-wrap text-[36px] leading-[44px] mb-5">
          Simplify your crypto investing. Stay compliant. Grow smarter.
        </p>
        <p className="font-normal text-[20px] text-[#535862] mb-16">
          Omora automates your crypto journey from funding to daily investment.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {whyOmora.map((why, index) => (
            <div key={index} className="bg-[#FAFAFA] p-6">
              <div className="mb-16">
                <div className="size-12 flex justify-center items-center bg-[#008B99] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08),_0px_-2px_0px_0px_rgba(255,255,255,0.6)_inset,_0px_0px_0px_1px_rgba(0,0,0,0.06)_inset]">
                  <Image
                    src={why.icon}
                    alt={why.title}
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <h4 className="font-semibold text-[18px] text-[#181D27] mb-1">
                {why.title}
              </h4>
              <p className="text-[#535862] text-base">{why.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Performance />
      <Testimonials />
      <section className="py-24 text-center bg-[#FAFAFA]">
        <h2 className="max-w-[768px] mx-auto font-semibold text-[36px] mb-5">
          Your next move deserves more than guesswork
        </h2>
        <p className="font-normal text-[20px] mb-8">
          Join over 1,000+ investors who are growing their portfolios with
          Omora.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button className="px-[18px] py-3 w-fit text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white">
            Learn More
          </Button>
          <Button className="px-[18px] py-3 w-fit text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99]">
            Start Investing
          </Button>
        </div>
      </section>
      <Insights />
    </main>
  );
};

export default page;
