"use client";
import React from "react";
import "../globals.css";
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
      <section className="relative min-h-[550px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
        {/* Grid background */}
        <div className='absolute inset-0 bg-[url("/assets/images/website/grid.svg")] bg-cover bg-no-repeat z-0'></div>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[url('/assets/images/website/gradient.png')] bg-cover bg-no-repeat z-[5]"></div>

        <div className="pt-24 sm:pt-28 md:pt-36 lg:pt-[180px] px-4 sm:px-6 md:px-8 relative z-20 pb-16 sm:pb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[81px] font-medium text-center max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-[1084px] mx-auto leading-tight">
            Crypto investing, powered by AI. Fund in Naira, grow in digital
            assets.
          </h1>
          <p className="text-center w-full sm:w-[90%] md:w-[700px] lg:w-[768px] mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg md:text-[20px] mx-auto">
            A secure, AI-guided investment platform for HNIs, Corporates &
            serious investors. Fund your Naira account. We&apos;ll handle the
            rest — daily, automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10 md:mt-12">
            <Button className="px-[18px] py-3 w-full sm:w-fit text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white">
              Learn More
            </Button>
            <Button className="px-[18px] py-3 w-full sm:w-fit text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99]">
              Start Investing
            </Button>
          </div>
        </div>
      </section>
      <section>
        <div className="flex justify-center mx-4 sm:mx-8 md:mx-16 lg:mx-[120px]">
          <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[557px] w-full bg-[#535862] rounded-t-2xl"></div>
        </div>
      </section>
      <AvailableAssets />
      <section className="bg-[#FAFAFA] text-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-[20px] font-medium">
            BACKED BY PARTNERS WHO BELIEVE IN SMARTER CRYPTO INVESTING
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 items-center justify-items-center max-w-5xl mx-auto">
            <Image
              src="/assets/images/website/partners/pennytree.png"
              width={150}
              height={29}
              alt="pennytree"
              className="w-32 sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[251px] h-auto"
            />
            <Image
              src="/assets/images/website/partners/treegar.png"
              width={104}
              height={29}
              alt="treegar"
              className="w-24 sm:w-[104px] md:w-[120px] lg:w-[140px] xl:w-[173px] h-auto"
            />
            <Image
              src="/assets/images/website/partners/quidax.png"
              width={120}
              height={29}
              alt="quidax"
              className="w-28 sm:w-[120px] md:w-[140px] lg:w-[160px] xl:w-[199px] h-auto"
            />
            <Image
              src="/assets/images/website/partners/stanbic-ibtc.png"
              width={165}
              height={29}
              alt="stanbic-ibtc"
              className="w-36 sm:w-[165px] md:w-[200px] lg:w-[220px] xl:w-[275px] h-auto col-span-2 lg:col-span-1"
            />
          </div>
          <p className="w-full sm:w-[90%] md:w-[680px] lg:w-[784px] mx-auto text-sm sm:text-base font-medium">
            The companies listed represent current partners, infrastructure
            providers, and integrations and do not imply investment in Omora
            products.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-[112px]">
        <h3 className="font-semibold text-[#00717D] text-sm sm:text-base mb-2 sm:mb-3">
          Why Omora?
        </h3>
        <p className="font-medium text-[#181D27] max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-[868px] text-2xl sm:text-3xl md:text-[36px] leading-tight sm:leading-[44px] mb-3 sm:mb-4 md:mb-5">
          Simplify your crypto investing. Stay compliant. Grow smarter.
        </p>
        <p className="font-normal text-base sm:text-lg md:text-[20px] text-[#535862] mb-8 sm:mb-12 md:mb-16">
          Omora automates your crypto journey from funding to daily investment.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {whyOmora.map((why, index) => (
            <div key={index} className="bg-[#FAFAFA] p-4 sm:p-5 md:p-6">
              <div className="mb-8 sm:mb-12 md:mb-16">
                <div className="size-10 sm:size-11 md:size-12 flex justify-center items-center bg-[#008B99] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08),_0px_-2px_0px_0px_rgba(255,255,255,0.6)_inset,_0px_0px_0px_1px_rgba(0,0,0,0.06)_inset]">
                  <Image
                    src={why.icon}
                    alt={why.title}
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <h4 className="font-semibold text-base sm:text-[17px] md:text-[18px] text-[#181D27] mb-1">
                {why.title}
              </h4>
              <p className="text-[#535862] text-sm sm:text-[15px] md:text-base">{why.description}</p>
            </div>
          ))}
        </div>
      </section>
      <Performance />
      <Testimonials />
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 text-center bg-[#FAFAFA] px-4">
        <h2 className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-[768px] mx-auto font-semibold text-2xl sm:text-3xl md:text-[36px] mb-4 sm:mb-5">
          Your next move deserves more than guesswork
        </h2>
        <p className="font-normal text-base sm:text-lg md:text-[20px] mb-6 sm:mb-7 md:mb-8">
          Join over 1,000+ investors who are growing their portfolios with
          Omora.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4">
          <Button className="px-[18px] py-3 w-full sm:w-fit text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white">
            Learn More
          </Button>
          <Button className="px-[18px] py-3 w-full sm:w-fit text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99]">
            Start Investing
          </Button>
        </div>
      </section>
      <Insights />
    </main>
  );
};

export default page;