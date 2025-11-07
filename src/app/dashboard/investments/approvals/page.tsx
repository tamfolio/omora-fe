"use client"

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvestmentsTab from '@/components/approval/InvestmentsTab';
import ConversionTab from '@/components/approval/ConversionTab';
import ActivityLogTab from '@/components/approval/ActivityLogTab';

const TransactionMonitoringTable = () => {
  const [activeTab, setActiveTab] = useState("investments");

  return (
    <div>
      <div className='px-[112px] mt-8 mb-12'>
        <h1 className="font-semibold text-[24px] text-[#181D27] mb-5">Approvals</h1>
        
        {/* Tabs */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex-wrap p-0 h-fit !bg-none border rounded-[8px] w-full md:flex-nowrap md:w-fit border-[#D5D7DA]">
              <TabsTrigger
                className="w-full md:w-fit text-[#414651] border-b-[0.5px] md:border-r-[0.5px] border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white rounded-t-[8px] md:rounded-tr-none md:rounded-l-[8px]"
                value="investments"
              >
                Investments
              </TabsTrigger>
              <TabsTrigger
                className="w-full md:w-fit text-[#414651]  rounded-none border-y-[0.5px] md:order-y-none md:border-x-[0.5px] border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white"
                value="conversion"
              >
                Conversion
              </TabsTrigger>
              <TabsTrigger
                className="w-full md:w-fit text-[#414651] md:border-l-[0.5px] border-t-[0.5px] md:border-t-0 border-[#D5D7DA] data-[state=active]:bg-[#FAFAFA] bg-white rounded-b-[8px] md:rounded-bl-none md:rounded-r-[8px]"
                value="activity-log"
              >
                Activity Log
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content */}
        <div className="rounded-b-[12px]">
          {activeTab === "investments" && <InvestmentsTab />}
          {activeTab === "conversion" && <ConversionTab />}
          {activeTab === "activity-log" && <ActivityLogTab />}
        </div>
      </div>
    </div>
  );
};

export default TransactionMonitoringTable;
