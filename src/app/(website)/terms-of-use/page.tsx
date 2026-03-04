import React from "react";

export default function TermsOfUse() {
  return (
    <main>
      {/* FIXED: Added px-4 for mobile breathing room */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-full max-w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            Last Updated: (20 Jan 2025)
          </span>
          {/* FIXED: Scaled 48px font to 3xl on mobile */}
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            Terms of Use
          </h1>
          {/* FIXED: Scaled 20px font to base on mobile */}
          <p className="text-[#535862] font-normal text-base md:text-[20px] leading-relaxed">
            Welcome to OMORA. By accessing or using our services, you agree to
            comply with and be bound by these Terms of Use. If you do not agree,
            please do not use our services.
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
              Eligibility
            </h2>
            {/* FIXED: Scaled body text to base on mobile */}
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              You must be at least 18 years old and legally capable to enter
              into a binding agreement to use OMORA.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Account Registration
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              You agree to provide accurate, complete, and updated information
              during registration. You are responsible for maintaining the
              confidentiality of your credentials and activities on your
              account.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Platform Use
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              OMORA provides automated crypto investment tools using a
              dollar-cost averaging (DCA) strategy and other risk-managed
              models. We do not offer financial advice. You are solely
              responsible for your investment decisions.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Fees and Charges
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mb-3 md:mb-5">
              You agree to OMORAs fee structure, including:
            </p>
            {/* FIXED: Added pl-5 for proper bullet indentation on mobile */}
            <ul className="text-base md:text-[18px] text-[#535862] list-disc pl-5 md:pl-6 space-y-2">
              <li>2% annual management fee (charged monthly)</li>
              <li>
                5% performance fee on net gains above previous portfolio peak
              </li>
            </ul>

            <p className="text-base md:text-[18px] text-[#535862] mt-4 md:mt-5 font-medium">
              Fee details are transparently displayed in your Wallet and
              Portfolio
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Risk Disclaimer
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              Cryptocurrency investments are highly volatile. You acknowledge
              and accept the risks involved. OMORA is not liable for any losses
              arising from investment activity.
            </p>
          </div>

          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Termination
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              We reserve the right to suspend or terminate your account for
              violation of terms, suspected fraud, or regulatory breaches.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Governing Law
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              These Terms are governed by the laws of the Federal Republic of
              Nigeria.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}