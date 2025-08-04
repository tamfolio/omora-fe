"use client"

import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathName = usePathname();

    const excludedPaths = ['/auth', '/dashboard'];

    const isExcluded = excludedPaths.some((base) => pathName?.startsWith(base));

    if (isExcluded) return null

  return (
    <div className="flex items-center justify-between px-8 py-[18px]">
      <div className="flex items-center gap-11">
        <Link href="/">
          <Image
            src="/assets/images/logo/omora-logo.png"
            height={30}
            width={170}
            alt="omora logo"
          />
        </Link>

        <nav className="flex items-center">
          <Link className="px-3 py-2 font-semibold" href="#">About</Link>
          <Link className="px-3 py-2 font-semibold" href="#">Insights</Link>
          <Link className="px-3 py-2 font-semibold" href="#">NewsRoom</Link>
          <Link className="px-3 py-2 font-semibold" href="#">FAQs</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
        <Button className="px-3.5 py-2.5 text-sm text-[#414651] font-semibold rounded-[8px] border border-[#D5D7DA] bg-transparent hover:bg-[#008B99] hover:text-white" onClick={() => signIn()}>Log in</Button>
        <Button className="px-3.5 py-2.5 text-sm font-semibold rounded-[8px] bg-[#008B99] hover:bg-[#008B99]">Sign up</Button>
      </div>

      <div className="flex gap-1 items-center">
        <span className="bg-[#535862] size-[11px] rounded-full border border-[#E9EAEB]"></span>
        <span className="size-[11px] rounded-full border border-[#E9EAEB]"></span>
      </div>
      </div>
    </div>
  );
}
