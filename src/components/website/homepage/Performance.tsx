import React from "react";

export default function Performance() {
  return (
    <section className="border border-t-[#E9EAEB] py-12 sm:py-16 md:py-20 lg:py-24 text-center px-4">
      <h2 className="font-semibold text-[#181D27] text-2xl sm:text-3xl md:text-[36px]">
        Proof in the Performance
      </h2>
      <p className="text-[#535862] text-base sm:text-lg md:text-[20px] mt-3 sm:mt-4 md:mt-5 mb-8 sm:mb-12 md:mb-16">
        Real numbers. Real growth. Real investors trusting Omora.
      </p>

      <div className="bg-[#FAFAFA] p-6 sm:p-10 md:p-12 lg:p-16 w-full max-w-6xl rounded-[16px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-[#008B99] font-semibold">
              400+
            </span>
            <span className="block text-sm sm:text-base md:text-[18px] text-[#181D27] mt-2 font-semibold">
              Total Assets Under Management
            </span>
          </div>
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-[#008B99] font-semibold">
              600%
            </span>
            <span className="block text-sm sm:text-base md:text-[18px] text-[#181D27] mt-2 font-semibold">
              Average ROI per Risk Profile
            </span>
          </div>
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-[#008B99] font-semibold">
              10k
            </span>
            <span className="block text-sm sm:text-base md:text-[18px] text-[#181D27] mt-2 font-semibold">
              Trades Volume
            </span>
          </div>
          <div className="text-center">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[60px] text-[#008B99] font-semibold">
              200+
            </span>
            <span className="block text-sm sm:text-base md:text-[18px] text-[#181D27] mt-2 font-semibold">
              Investors
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}