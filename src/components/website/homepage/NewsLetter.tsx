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
    <div className="flex items-start justify-between px-[112px] py-16 bg-[#FAFAFA]">
      <h3 className="font-semibold text-[#181D27] text-[30px] max-w-[620px] text-wrap">
        Sign up to receive the latest crypto trends, insights, and company news.
      </h3>

      <form
        className="flex items-center gap-4"
        onSubmit={(e) => subscribeToNewsletter(e)}
      >
        <Input
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="py-[10px] px-[14px]  rounded-[8px] border border-[#D5D7DA] bg-transparent focus-visible:ring-[#008B99]"
          type="email"
        />
        <Button
          className="bg-[#008B99] px-4 py-[10px] text-white font-semibold rounded-[8px]"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
