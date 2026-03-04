import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralPlatform from "@/components/website/frequently-asked-questions/GeneralPlatform";
import Kyc from "@/components/website/frequently-asked-questions/Kyc";
import GettingStarted from "@/components/website/frequently-asked-questions/GettingStarted";
import Security2fa from "@/components/website/frequently-asked-questions/Security2Fa";
import TeamManagement from "@/components/website/frequently-asked-questions/TeamManagement";
import WalletAndTransactions from "@/components/website/frequently-asked-questions/WalletAndTransactions";
import InvestmentAndportfolioPerformance from "@/components/website/frequently-asked-questions/InvestmentAndportfolioPerformance";
import ReportingAndInsights from "@/components/website/frequently-asked-questions/ReportingAndInsights";
import NotificationsAndEmails from "@/components/website/frequently-asked-questions/NotificationsAndEmails";
import SupportAndTroubleshooting from "@/components/website/frequently-asked-questions/SupportAndTroubleshooting";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeesAndCharges from "@/components/website/frequently-asked-questions/FeesAndCharges";
import LegalAndCompliance from "@/components/website/frequently-asked-questions/LegalAndCompliance";

export default function FrequentlyAskedQuestions() {
  return (
    <main className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <div className="pt-16 md:pt-24 pb-12 md:pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.2)_0%,rgba(174,220,224,0.2)_15.35%,rgba(255,255,255,0.2)_34.1%)] bg-blend-overlay px-4">
        {/* FIXED: Removed fixed w-[768px] and replaced with w-full max-w-[768px] */}
        <div className="w-full max-w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            FAQs
          </span>
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            All You Need to Know About OMORA
          </h1>
          <p className="text-[#535862] font-normal text-base md:text-[20px]">
            Have questions? We&apos;re here to help.
          </p>
        </div>
      </div>

      {/* TABS SECTION */}
      <Tabs defaultValue="general-platform" className="w-full mt-8 md:mt-12">
        {/* FIXED: Added a scrollable wrapper for mobile so the 12 tabs don't crush the screen */}
        <div className="w-full overflow-x-auto no-scrollbar px-4 md:px-8 lg:px-[112px] mb-12 md:mb-20 pb-2">
          {/* FIXED: Changed to flex-nowrap on mobile to allow swiping, flex-wrap on desktop */}
          <TabsList className="flex flex-nowrap md:flex-wrap h-fit !bg-none min-w-max md:min-w-0 justify-start md:justify-center mx-auto">
            <TabsTrigger
              className="rounded-l-[8px] border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="general-platform"
            >
              General Platform
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="kyc"
            >
              Account & Verification (KYC)
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="getting-started"
            >
              Getting Started
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="security-2fa"
            >
              Security & 2FA
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="team-management"
            >
              Team Management
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="wallet-transactions"
            >
              Wallet & Transactions
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="investment-portfolio-performance"
            >
              Investment & Portfolio performance
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="reporting-insights"
            >
              Reporting & Insights
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="notifications-emails"
            >
              Notifications & Emails
            </TabsTrigger>
            <TabsTrigger
              className="border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="fees-charges"
            >
              Fees & Charges
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="support-troubleshooting"
            >
              Support & Troubleshooting
            </TabsTrigger>
            <TabsTrigger
              className="rounded-r-[8px] border border-[#E9EAEB] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border] bg-[#FAFAFA] mb-2 md:mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB] whitespace-nowrap px-4 py-2"
              value="legal-compliance"
            >
              Legal & Compliance
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Wrapper for padding */}
        <div className="px-4 md:px-8 lg:px-[112px] w-full">
          <TabsContent value="general-platform"><GeneralPlatform /></TabsContent>
          <TabsContent value="kyc"><Kyc /></TabsContent>
          <TabsContent value="getting-started"><GettingStarted /></TabsContent>
          <TabsContent value="security-2fa"><Security2fa /></TabsContent>
          <TabsContent value="team-management"><TeamManagement /></TabsContent>
          <TabsContent value="wallet-transactions"><WalletAndTransactions /></TabsContent>
          <TabsContent value="investment-portfolio-performance"><InvestmentAndportfolioPerformance /></TabsContent>
          <TabsContent value="reporting-insights"><ReportingAndInsights /></TabsContent>
          <TabsContent value="notifications-emails"><NotificationsAndEmails /></TabsContent>
          <TabsContent value="fees-charges"><FeesAndCharges /></TabsContent>
          <TabsContent value="support-troubleshooting"><SupportAndTroubleshooting /></TabsContent>
          <TabsContent value="legal-compliance"><LegalAndCompliance /></TabsContent>
        </div>
      </Tabs>

      {/* STILL HAVE QUESTIONS SECTION */}
      {/* FIXED: Removed mx-[112px] and added responsive margins/padding */}
      <div className="flex flex-col p-6 md:p-8 mt-12 md:mt-16 mb-16 md:mb-24 items-center justify-center text-center bg-[#FAFAFA] mx-4 md:mx-8 lg:mx-[112px] rounded-[16px]">
        <div className="flex items-center mb-6 md:mb-8">
          <div className="rounded-full size-10 md:size-[48px] overflow-hidden border-2 border-white -mr-3 md:-mr-4 relative z-0">
            <Image src="/assets/images/website/faq/avatar-1.png" alt="Person 1" width={48} height={48} className="object-cover w-full h-full" />
          </div>
          <div className="rounded-full size-12 md:size-[52px] overflow-hidden border-2 border-white -mr-3 md:-mr-4 relative z-10 shadow-sm">
            <Image src="/assets/images/website/faq/avatar-2.png" alt="Person 2" width={52} height={52} className="object-cover w-full h-full" />
          </div>
          <div className="rounded-full size-10 md:size-[48px] overflow-hidden border-2 border-white relative z-0">
            <Image src="/assets/images/website/faq/avatar-3.png" alt="Person 3" width={48} height={48} className="object-cover w-full h-full" />
          </div>
        </div>

        <h2 className="font-semibold text-lg md:text-[20px] mb-2 text-[#181D27]">
          Still have questions?
        </h2>
        <p className="text-[#535862] text-sm md:text-[18px] font-normal mb-6 md:mb-8">
          Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.
        </p>
        <Button className="px-5 py-2.5 md:px-[18px] md:py-3 rounded-[8px] bg-[#008B99] hover:bg-[#00717D] font-semibold transition-colors">
          Get in touch
        </Button>
      </div>
    </main>
  );
}