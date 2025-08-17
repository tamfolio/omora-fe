import React from "react";

export default function PrivacyPolicy() {
  return (
    <main>
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Last Updated: (20 Jan 2025)
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Privacy Policy
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            We are committed to protecting your personal information. This
            Privacy Policy outlines how we collect, use, store, and protect your
            data.
          </p>
        </div>
      </section>

      <section className="py-24 text-wrap">
        <div className="w-[720px] mx-auto">
          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Information We Collect
            </h2>
            <ul className="text-[18px] text-[#535862] list-disc mb-10">
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

          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              How We Use Your Data
            </h2>
            <ul className="text-[18px] text-[#535862] list-disc mb-10">
              <li>To onboard and verify your identity (KYC)</li>
              <li>To process transactions and investments</li>
              <li>To personalize user experience and support</li>
              <li>To comply with regulatory obligations</li>
            </ul>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Data Sharing
            </h2>
            <p className="text-[18px] text-[#535862] mb-5">
              We may share data with:
            </p>
            <ul className="text-[18px] text-[#535862] list-disc">
              <li>Payment providers, custodians, and crypto exchanges</li>
              <li>Regulatory authorities when legally required</li>
              <li>Fraud prevention and compliance vendors</li>
              <li>To comply with regulatory obligations</li>
            </ul>

            <p className="text-[18px] text-[#535862] mt-5">
              We do not sell your data.
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Your Rights
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              You have the right to access, correct, or delete your data. You
              may also withdraw consent to marketing at any time.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Data Security
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              We employ bank-level encryption and multi-factor authentication to
              protect your data.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
