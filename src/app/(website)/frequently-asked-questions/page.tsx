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

export default function FrequentlyAskedQuestions() {
  return (
    <div>
      <div className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.2)_0%,rgba(174,220,224,0.2)_15.35%,rgba(255,255,255,0.2)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            FAQs
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            All You Need to Know About OMORA
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            Have questions? We&apos;re here to help.
          </p>
        </div>
      </div>
      <Tabs defaultValue="general-platform" className="justify-center">
        <TabsList className="mb-24 flex-wrap h-11 !bg-none">
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="general-platform">General Platform</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="kyc">Account & Verification (KYC)</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="security-2fa">Security & 2FA</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="team-management">Team Management</TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="wallet-transactions">
            Wallet & Transactions
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="investment-portfolio-performance">
            Investment & Portfolio performance
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="reporting-insights">
            Reporting & Insights
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="notifications-emails">
            Notifications & Emails
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[data-[state=active]:border]  bg-[#FAFAFA] mb-4 data-[state=active]:rounded-[8px] border-t-[#E9EAEB] border-b-[#E9EAEB]" value="support-troubleshooting">
            Support & Troubleshooting
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general-platform">
          <GeneralPlatform />
        </TabsContent>
        <TabsContent value="kyc">
          <Kyc />
        </TabsContent>
        <TabsContent value="getting-started">
          <GettingStarted />
        </TabsContent>
        <TabsContent value="security-2fa">
          <Security2fa />
        </TabsContent>
        <TabsContent value="team-management">
          <TeamManagement />
        </TabsContent>
        <TabsContent value="wallet-transactions">
          <WalletAndTransactions />
        </TabsContent>
        <TabsContent value="investment-portfolio-performance">
          <InvestmentAndportfolioPerformance />
        </TabsContent>
        <TabsContent value="reporting-insights">
          <ReportingAndInsights />
        </TabsContent>
        <TabsContent value="notifications-emails">
          <NotificationsAndEmails />
        </TabsContent>
        <TabsContent value="support-troubleshooting">
          <SupportAndTroubleshooting />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col p-8 mt-16 mb-24 items-center justify-center text-center bg-[#FAFAFA] mx-[112px] rounded-[16px]">
        <div className="flex items-center mb-8">
      <div className="rounded-full size-[48px] overflow-hidden border-1 border-white -mr-4">
        <Image
          src="/assets/images/website/faq/avatar-1.png"
          alt="Person 1"
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
      <div className="relative z-10 rounded-full size-[52px] overflow-hidden border-1 grow-1 border-white -mr-4">
        <Image
          src="/assets/images/website/faq/avatar-2.png"
          alt="Person 2"
          width={52}
          height={52}
          className="object-cover"
        />
      </div>
      <div className="rounded-full size-[48px] overflow-hidden border-1 border-white">
        <Image
          src="/assets/images/website/faq/avatar-3.png"
          alt="Person 3"
          width={48}
          height={48}
          className="object-cover"
        />
      </div>
    </div>

        <h2 className="font-semibold text-[20px] mb-2 text-[#181D27]">Still have questions?</h2>
        <p className="text-[#535862] text-[18px] font-normal mb-8">Can&apos;t find the answer you&apos;re looking for? Please chat to our friendly team.</p>
        <Button className="px-[18px] py-3 rounded-[8px] bg-[#008B99]  hover:bg-[#008B99] font-semibold">
            Get in touch
        </Button>
      </div>
    </div>
  );
}
