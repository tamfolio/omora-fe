"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "@/components/ui/input";

export default function NewsLetter() {
  const [email, setEmail] = useState<string | null>(null);
  const subscribeToNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
  };
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-6 md:gap-8 px-4 sm:px-6 md:px-12 lg:px-[112px] py-10 sm:py-12 md:py-16 bg-[#FAFAFA]">
      <h3 className="font-semibold text-[#181D27] text-xl sm:text-2xl md:text-[28px] lg:text-[30px] max-w-full md:max-w-[520px] lg:max-w-[620px]">
        Sign up to receive the latest crypto trends, insights, and company news.
      </h3>

      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto"
        onSubmit={(e) => subscribeToNewsletter(e)}
      >
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="py-[10px] px-[14px] rounded-[8px] border border-[#D5D7DA] bg-transparent focus-visible:ring-[#008B99] w-full sm:w-auto sm:min-w-[280px]"
          type="email"
        />
        <Button
          className="bg-[#008B99] px-4 py-[10px] text-white font-semibold rounded-[8px] w-full sm:w-auto"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}