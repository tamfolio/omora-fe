import React from "react";
import { Button } from "../../ui/button";
import Image from "next/image";

const insights = [
  {
    tag: "Design",
    title: "UX review presentations",
    description:
      "How do you create compelling presentations that wow your colleagues and impress your managers?",
    img: "/assets/images/website/insights/Image-1.png",
    date: "20 Jan 2025",
    name: "Olivia Rhye",
    userImg: "/assets/images/website/avatar-1.png",
  },
  {
    tag: "Product",
    title: "Migrating to Linear 101",
    description:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    img: "/assets/images/website/insights/Image-2.png",
    date: "19 Jan 2025",
    name: "Phoenix Baker",
    userImg: "/assets/images/website/avatar-2.png",
  },
  {
    tag: "Software Engineering",
    title: "Building your API stack",
    description:
      "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    img: "/assets/images/website/insights/Image-3.png",
    date: "18 Jan 2025",
    name: "Lana Steiner",
    userImg: "/assets/images/website/avatar-3.png",
  },
];

export default function Insights() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 lg:px-[112px]">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 sm:mb-12 md:mb-16 lg:mb-24">
        <div>
          <h2 className="text-[#00717D] font-semibold text-sm sm:text-base mb-2 sm:mb-3">
            Our Insights
          </h2>
          <p className="text-2xl sm:text-3xl md:text-[36px] text-[#181D27] font-semibold mb-3 sm:mb-4 md:mb-5">
            Curated by Omora just for you
          </p>
          <p className="text-base sm:text-lg md:text-[20px] font-normal">
            Smart crypto insights curated by us, simplified for clarity and
            confident decisions
          </p>
        </div>
        <Button className="bg-[#008B99] hover:bg-[#008B99] px-[18px] py-3 rounded-[8px] w-full sm:w-auto shrink-0">
          View all posts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
        {insights.map((insight, index) => (
          <div
            className="flex flex-col justify-between min-h-[132px]"
            key={index}
          >
            <Image
              className="rounded-2xl w-full h-auto"
              src={insight.img}
              alt={insight.tag}
              width={384}
              height={256}
            />
            <span className="text-[#00717D] font-semibold text-sm sm:text-[15px] md:text-base mt-3 sm:mt-4 mb-1.5 sm:mb-2 block">
              {insight.tag}
            </span>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[#181D27] text-base sm:text-[17px] md:text-[18px] font-semibold">
                {insight.title}
              </h3>
              <Image
                src="/assets/images/website/arrow-up-right.svg"
                alt="forward"
                width={20}
                height={20}
                className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px] shrink-0"
              />
            </div>
            <p className="text-[#535862] text-sm sm:text-[15px] md:text-base font-normal mb-4 sm:mb-5">
              {insight.description}
            </p>
            <div className="flex items-center gap-2 mt-4 sm:mt-5">
              <Image
                src={insight.userImg}
                alt={insight.tag}
                width={36}
                height={36}
                className="sm:w-[38px] sm:h-[38px] md:w-[40px] md:h-[40px]"
              />
              <div>
                <span className="block text-[#181D27] text-xs sm:text-[13px] md:text-sm font-semibold">
                  {insight.name}
                </span>
                <span className="block text-[#535862] text-xs sm:text-[13px] md:text-sm font-normal">
                  {insight.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}