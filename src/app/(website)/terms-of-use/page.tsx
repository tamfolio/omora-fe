import React from "react";

export default function TermsOfUse() {
  return (
    <main>
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Last Updated: (20 Jan 2025)
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Terms of Use
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            Welcome to OMORA. By accessing or using our services, you agree to comply with and be bound by these Terms of Use. If you do not agree, please do not use our services.
          </p>
        </div>
      </section>

      <section className="py-24 text-wrap">
        <div className="w-[720px] mx-auto">
          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Eligibility
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              You must be at least 18 years old and legally capable to enter
              into a binding agreement to use OMORA.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Account Registration
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              You agree to provide accurate, complete, and updated information
              during registration. You are responsible for maintaining the
              confidentiality of your credentials and activities on your
              account.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Platform Use
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              OMORA provides automated crypto investment tools using a
              dollar-cost averaging (DCA) strategy and other risk-managed
              models. We do not offer financial advice. You are solely
              responsible for your investment decisions.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Fees and Charges
            </h2>
            <p className="text-[18px] text-[#535862] mb-5">
              You agree to OMORAs fee structure, including:
            </p>
            <ul className="text-[18px] text-[#535862] list-disc">
              <li>2% annual management fee (charged monthly)</li>
              <li>
                5% performance fee on net gains above previous portfolio peak
              </li>
            </ul>

            <p className="text-[18px] text-[#535862] mt-5">
              Fee details are transparently displayed in your Wallet and
              Portfolio
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Risk Disclaimer
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              Cryptocurrency investments are highly volatile. You acknowledge
              and accept the risks involved. OMORA is not liable for any losses
              arising from investment activity.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Termination
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              We reserve the right to suspend or terminate your account for
              violation of terms, suspected fraud, or regulatory breaches.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Governing Law
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              These Terms are governed by the laws of the Federal Republic of
              Nigeria.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
