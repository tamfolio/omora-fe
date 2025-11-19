"use client";

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const excludedPaths = ["/auth"];

  const isExcluded = excludedPaths.some((base) => pathName?.startsWith(base));

  if (isExcluded) return null;

  return (
    <div className="flex items-center justify-between px-8 py-[18px] text-[#414651]">
      <div className="flex items-center gap-11">
        <Link href="/">
          <Image
            src="/assets/images/logo/omora-logo.png"
            height={30}
            width={170}
            alt="omora logo"
          />
        </Link>

        <nav className="flex items-center font-semibold">
          <Link className="px-3 py-2 " href="/about-us">
            About
          </Link>
          <Link className="px-3 py-2" href="/insights">
            Insights
          </Link>
          <Link className="px-3 py-2" href="/newsroom">
            NewsRoom
          </Link>
          <Link className="px-3 py-2" href="/frequently-asked-questions">
            FAQs
          </Link>
        </nav>
      </div>

      <div className="flex items-center">
        {session ? (
          <div className="flex items-center">
            <div className="flex items-center text-sm font-semibold gap-4 text-[#414651]">
              <Link
                className="bg-[#008B99] text-white py-[10px] px-[14px] rounded-[8px]"
                href="#"
              >
                Fund Wallet
              </Link>
              <Link className="py-2 px-3" href="#">
                Wallet
              </Link>
              <Link className="py-2 px-3" href="#">
                Portfolio
              </Link>
            </div>

            <div className="flex ml-4 mr-3">
              <Button className="p-2 bg-transparent hover:bg-transparent">
                <Image
                  src="/assets/images/website/search.svg"
                  width={20}
                  height={20}
                  alt="search"
                />
              </Button>
              <Link href="#" className="p-2 flex items-center justify-center">
                <Image
                  src="/assets/images/website/settings.svg"
                  width={20}
                  height={20}
                  alt="settings"
                />
              </Link>
              <Link href="#" className="p-2 flex items-center justify-center">
                <Image
                  src="/assets/images/website/bell.svg"
                  width={20}
                  height={20}
                  alt="bell"
                />
              </Link>
            </div>

            <Link
              href="#"
              className="bg-[#F5F5F5] size-10 border border-[#E9EAEB] flex items-center justify-center rounded-full"
            >
              <Image
                src="/assets/images/website/user.svg"
                width={20}
                height={20}
                alt="user"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              className="px-3.5 py-2.5 text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white"
              onClick={() => router.push("/auth/login")}
            >
              Log in
            </Button>
            <Button 
              className="px-3.5 py-2.5 text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#00a3b3]"
              onClick={() => router.push("/auth/signup")}
            >
              Sign up
            </Button>
          </div>
        )}

        <div className="flex gap-1 items-center ml-4">
          <span className="bg-[#535862] size-[11px] rounded-full border border-[#E9EAEB]"></span>
          <span className="size-[11px] rounded-full border border-[#E9EAEB]"></span>
        </div>
      </div>
    </div>
  );
}