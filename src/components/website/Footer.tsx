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
      
      <div className="pt-12 md:pt-16 pb-8 md:pb-12 px-4 md:px-8 lg:px-[112px]">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start justify-between mb-12 md:mb-16">
          
          {/* Logo Section */}
          <div className="w-full lg:w-auto">
            {/* FIXED: Moved mb-4 to the Link and added inline-block for perfect spacing */}
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/assets/images/logo/omora-logo.png"
                alt="Omora Logo"
                width={138}
                height={30}
              />
            </Link>
            <p className="text-[#535862] text-sm md:text-base max-w-[320px]">
              Curated investing experiences for forward-thinkers.
            </p>
          </div>
          
          {/* Links Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-8 w-full lg:w-auto">
            {/* Company */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-3">
                Company
              </h4>
              <ul className="space-y-3 text-sm md:text-base text-[#535862] lg:min-w-[138px] font-semibold">
                <li><Link href="/about-us" className="hover:text-[#008B99] transition-colors">About Us</Link></li>
                <li><Link href="/our-team" className="hover:text-[#008B99] transition-colors">Our Team</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-3">
                Resources
              </h4>
              <ul className="space-y-3 text-sm md:text-base text-[#535862] lg:min-w-[138px] font-semibold">
                <li><Link href="/insights" className="hover:text-[#008B99] transition-colors">Insights</Link></li>
                <li><Link href="/newsroom" className="hover:text-[#008B99] transition-colors">Newsroom</Link></li>
                <li><Link href="/frequently-asked-questions" className="hover:text-[#008B99] transition-colors">FAQs</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-3">
                Social
              </h4>
              <ul className="space-y-3 text-sm md:text-base text-[#535862] lg:min-w-[138px] font-semibold">
                <li><Link href="#" className="hover:text-[#008B99] transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-[#008B99] transition-colors">LinkedIn</Link></li>
                <li><Link href="#" className="hover:text-[#008B99] transition-colors">Instagram</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-[#717680] text-sm mb-3">
                Legal
              </h4>
              <ul className="space-y-3 text-sm md:text-base text-[#535862] lg:min-w-[138px] font-semibold">
                <li><Link href="/terms-of-use" className="hover:text-[#008B99] transition-colors">Terms of Use</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-[#008B99] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies-policy" className="hover:text-[#008B99] transition-colors">Cookies Policy</Link></li>
                <li><Link href="/risk-disclosure" className="hover:text-[#008B99] transition-colors">Risk Disclosure</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-semibold text-[#717680] text-sm mb-3">
                Contact
              </h4>
              
              <ul className="space-y-3 text-sm md:text-base text-[#535862] font-semibold">
                <li><a href="mailto:hello@omora.africa" className="hover:text-[#008B99] transition-colors break-all">hello@omora.africa</a></li>
                <li><a href="tel:+2348183448765" className="hover:text-[#008B99] transition-colors">+2348183448765</a></li>
                <li className="leading-snug">3, Godson Ilodianya Close, Lekki, Lagos</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs md:text-sm text-[#535862] font-medium space-y-4 mb-6 leading-relaxed">
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
            <Link href="#" className="underline hover:text-[#008B99] transition-colors">
              Terms and Conditions
            </Link>
            ,{" "}
            <Link href="#" className="underline hover:text-[#008B99] transition-colors">
              Privacy Policy
            </Link>
            , and all applicable regulatory requirements.
          </p>
        </div>

        {/* Divider */}
        <hr className="border-[#E9EAEB] mb-6 md:mb-8" />

        {/* Copyright */}
        <p className="text-center text-xs md:text-sm text-[rgb(113,118,128)]">
          © 2025 OMORA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}