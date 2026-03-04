import React from "react";

export default function PrivacyPolicy() {
  return (
    <main>
      {/* FIXED: Added px-4 for mobile breathing room, adjusted vertical padding */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-full max-w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            Last Updated: (20 Jan 2025)
          </span>
          {/* FIXED: Scaled 48px to 3xl on mobile */}
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            Privacy Policy
          </h1>
          {/* FIXED: Scaled 20px to base on mobile */}
          <p className="text-[#535862] font-normal text-base md:text-[20px] leading-relaxed">
            We are committed to protecting your personal information. This
            Privacy Policy outlines how we collect, use, store, and protect your
            data.
          </p>
        </div>
      </section>

      {/* FIXED: Added px-4 md:px-8 for responsive side margins */}
      <section className="py-16 md:py-24 px-4 md:px-8 text-wrap">
        {/* FIXED: Changed w-[720px] to w-full max-w-[720px] to fix the mobile spillover! */}
        <div className="w-full max-w-[720px] mx-auto">
          
          <div className="mb-8 md:mb-10">
            {/* FIXED: Scaled headers to text-2xl on mobile */}
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Information We Collect
            </h2>
            {/* FIXED: Scaled text to base on mobile, added pl-5 for bullet alignment, added space-y-2 */}
            <ul className="text-base md:text-[18px] text-[#535862] list-disc pl-5 md:pl-6 space-y-2 mb-8 md:mb-10">
              <li>
                Personal Data: Full name, phone number, email, address, BVN, ID
                document
              </li>
              <li>
                Financial Data: Wallet balance, trade history, account
                transactions
              </li>
              <li>
                Device and Technical Info: IP address, browser type, and usage
                analytics
              </li>
            </ul>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              How We Use Your Data
            </h2>
            <ul className="text-base md:text-[18px] text-[#535862] list-disc pl-5 md:pl-6 space-y-2 mb-8 md:mb-10">
              <li>To onboard and verify your identity (KYC)</li>
              <li>To process transactions and investments</li>
              <li>To personalize user experience and support</li>
              <li>To comply with regulatory obligations</li>
            </ul>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Data Sharing
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mb-3 md:mb-5">
              We may share data with:
            </p>
            <ul className="text-base md:text-[18px] text-[#535862] list-disc pl-5 md:pl-6 space-y-2">
              <li>Payment providers, custodians, and crypto exchanges</li>
              <li>Regulatory authorities when legally required</li>
              <li>Fraud prevention and compliance vendors</li>
              <li>To comply with regulatory obligations</li>
            </ul>

            <p className="text-base md:text-[18px] text-[#535862] mt-4 md:mt-5 font-medium">
              We do not sell your data.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Your Rights
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              You have the right to access, correct, or delete your data. You
              may also withdraw consent to marketing at any time.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Data Security
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              We employ bank-level encryption and multi-factor authentication to
              protect your data.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}