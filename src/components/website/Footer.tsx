"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import NewsLetter from "./homepage/NewsLetter";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathName = usePathname();

  const excludedPaths = ["/auth", "/dashboard"];

  const isExcluded = excludedPaths.some((base) => pathName?.startsWith(base));

  if (isExcluded) return null;

  return (
    <footer>
      <NewsLetter />
      <div className="pt-16 pb-12 px-[112px]">
        <div className="flex gap-16 items-start justify-between mb-16">
          <div>
            <Image
              src="/assets/images/logo/omora-logo.png"
              alt="Omora Logo"
              width={138}
              height={30}
              className="mb-4"
            />
            <p className="text-[#535862] text-base w-[320px]">
              Curated investing experiences for forward-thinkers.
            </p>
          </div>
          <div className="flex gap-8">
            {/* Company */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-2">
                Company
              </h4>
              <ul className="space-y-3 text-base text-[#535862] min-w-[138px] font-semibold">
                <li>
                  <Link href="#">About Us</Link>
                </li>
                <li>
                  <Link href="#">Our Team</Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-2">
                Resources
              </h4>
              <ul className="space-y-3 text-base text-[#535862] min-w-[138px] font-semibold">
                <li>
                  <Link href="#">Insights</Link>
                </li>
                <li>
                  <Link href="#">Newsroom</Link>
                </li>
                <li>
                  <Link href="#">FAQs</Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-2">
                Social
              </h4>
              <ul className="space-y-3 text-base text-[#535862] min-w-[138px] font-semibold">
                <li>
                  <Link href="#">Twitter</Link>
                </li>
                <li>
                  <Link href="#">LinkedIn</Link>
                </li>
                <li>
                  <Link href="#">Instagram</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-2">
                Legal
              </h4>
              <ul className="space-y-3 text-base text-[#535862] min-w-[138px] font-semibold">
                <li>
                  <Link href="#">Terms of Use</Link>
                </li>
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Cookies Policy</Link>
                </li>
                <li>
                  <Link href="#">Risk Disclosure</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-2">
                Contact
              </h4>
              <ul className="space-y-3 text-base text-[#535862] max-w-[152px] font-semibold">
                <li>
                  <a href="mailto:hello@omora.africa">hello@omora.africa</a>
                </li>
                <li>
                  <a href="tel:+2348183448765">+2348183448765</a>
                </li>
                <li>3, Godson Ilodianya Close, Lekki, Lagos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-base text-[#535862] font-medium space-y-4 mb-6">
          <p>
            This platform is operated by Omora Markets Lab, through its
            SEC-regulated entities, Treegar Integrated Services Limited and
            PennyTree Business Limited, both duly registered with the Securities
            and Exchange Commission (SEC), Nigeria. All services offered on this
            platform are delivered in line with applicable SEC regulations and
            the requirements of other relevant authorities in the Federal
            Republic of Nigeria.
          </p>
          <p>
            Investing in digital currencies and crypto-assets involves
            significant risk. These assets are speculative, subject to high
            volatility, and may result in the loss of capital. Past performance
            is not indicative of future results. Users are strongly encouraged
            to conduct independent research and seek professional financial
            advice before making any investment or trading decisions on this
            platform.
          </p>
          <p>
            By using this platform, you agree to our{" "}
            <Link href="#" className="underline">
              Terms and Conditions
            </Link>
            ,{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
            , and all applicable regulatory requirements.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-[#E9EAEB] mb-8" />

        {/* Copyright */}
        <p className="text-center text-base text-[rgb(113,118,128)]">
          © 2025 OMORA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
