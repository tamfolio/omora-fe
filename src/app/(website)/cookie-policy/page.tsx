import React from "react";

export default function CookiePolicy() {
  return (
    <main>
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Last Updated: (20 Jan 2025)
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Cookie Policy
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            OMORA uses cookies to enhance your experience.
          </p>
        </div>
      </section>

      <section className="py-24 text-wrap">
        <div className="w-[720px] mx-auto">
          <div className="mb-10">
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              What Are Cookies?
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              Cookies are small data files stored on your browser that help us
              understand user behavior and improve our service.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Types of Cookies We Use:
            </h2>
            <ul className="text-[18px] text-[#535862] list-disc mb-10">
              <li>
                Essential Cookies: Enable platform functionality (e.g., login
                sessions)
              </li>
              <li>Analytics Cookies: Help us measure usage and performance</li>
              <li>
                Marketing Cookies: Personalize ads and promotional messages
                (where applicable)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-[30px] mb-5 text-[#181D27]">
              Your Control
            </h2>
            <p className="text-[18px] text-[#535862] mt-5">
              You may accept or reject cookies through your browser settings.
              Essential cookies cannot be disabled as they are necessary for
              platform operation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
