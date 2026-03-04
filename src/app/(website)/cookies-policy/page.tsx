import React from "react";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <main>
      {/* Responsive Hero Section */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-full max-w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            Last Updated: (20 Jan 2025)
          </span>
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            Cookie Policy
          </h1>
          <p className="text-[#535862] font-normal text-base md:text-[20px] leading-relaxed">
            OMORA uses cookies to enhance your experience.
          </p>
        </div>
      </section>

      {/* Responsive Content Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 text-wrap">
        <div className="w-full max-w-[720px] mx-auto">
          
          {/* What Are Cookies? */}
          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              What Are Cookies?
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mt-3 md:mt-5 leading-relaxed">
              Cookies are small data files stored on your browser that help us
              understand user behavior and improve our service.
            </p>
          </div>

          {/* Types of Cookies We Use */}
          <div className="mb-8 md:mb-10">
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Types of Cookies We Use:
            </h2>
            <ul className="text-base md:text-[18px] text-[#535862] list-disc pl-5 md:pl-6 space-y-3 leading-relaxed">
              <li>
                <strong>Essential Cookies:</strong> Enable platform functionality (e.g., login
                sessions). These cannot be disabled.
              </li>
              <li>
                <strong>Analytics Cookies:</strong> Help us measure usage and performance to
                improve your experience.
              </li>
              <li>
                <strong>Marketing Cookies:</strong> Personalize ads and promotional messages
                (where applicable).
              </li>
            </ul>
          </div>

          {/* Your Control */}
          <div>
            <h2 className="font-semibold text-2xl md:text-[30px] mb-3 md:mb-5 text-[#181D27]">
              Your Control
            </h2>
            <p className="text-base md:text-[18px] text-[#535862] mb-6 md:mb-8 leading-relaxed">
              You may accept or reject cookies through your browser settings or our
              Cookie Settings page. Essential cookies cannot be disabled as they are
              necessary for platform operation.
            </p>
            <Link 
              href="/dashboard/settings/cookies" 
              className="inline-block w-full sm:w-auto text-center px-6 py-3 bg-[#008B99] text-white font-semibold rounded-lg hover:bg-[#007A86] transition-colors"
            >
              Manage Cookie Preferences
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}