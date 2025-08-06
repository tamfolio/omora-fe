"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const howWeWorkAtOmora = [
  {
    title: "Share team inboxes",
    description:
      "Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.",
    icon: "/assets/images/website/message-chat-circle-black.svg",
  },
  {
    title: "Deliver instant answers",
    description:
      "An all-in-one customer service platform that helps you balance everything your customers need to be happy.",
    icon: "/assets/images/website/zap-black.svg",
  },
  {
    title: "Manage your team with reports",
    description:
      "Measure what matters with Untitled's easy-to-use reports. You can filter, export, and drilldown on the data in a couple clicks.",
    icon: "/assets/images/website/chart-breakout-square-black.svg",
  },
  {
    title: "Connect with customers",
    description:
      "Solve a problem or close a sale in real-time with chat. If no one is available, customers are seamlessly routed to email without confusion.",
    icon: "/assets/images/website/message-smile-circle-black.svg",
  },
  {
    title: "Connect the tools you already use",
    description:
      "Explore 100+ integrations that make your day-to-day workflow more efficient and familiar. Plus, our extensive developer tools.",
    icon: "/assets/images/website/command-black.svg",
  },
  {
    title: "Our people make the difference",
    description:
      "We're an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.",
    icon: "/assets/images/website/message-heart-circle-black.svg",
  },
];

const team = [
    {
        name: "Alisa Hester",
        position: "Founder & CEO",
        image: "/assets/images/website/about-us/alisa-hester.jpg",
        description: "Former frontend dev for Linear, Coinbase, and Postscript.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
    {
        name: "Rich Wilson",
        position: "Engineering Manager",
        image: "/assets/images/website/about-us/rich-wilson.jpg",
        description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
    {
        name: "Annie Stanley",
        position: "Product Manager",
        image: "/assets/images/website/about-us/annie-stanley.jpg",
        description: "Former PM for Airtable, Medium, Ghost, and Lumi.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
    {
        name: "Johnny Bell",
        position: "Frontend Developer",
        image: "/assets/images/website/about-us/johnny-bell.jpg",
        description: "Former frontend dev for Linear, Coinbase, and Postscript.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
    {
        name: "Mia Ward",
        position: "Backend Developer",
        image: "/assets/images/website/about-us/mia-ward.jpg",
        description: "Lead backend dev at Clearbit. Former Clearbit and Loom.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
    {
        name: "Archie Young",
        position: "Product Designer",
        image: "/assets/images/website/about-us/alisa-hester.jpg",
        description: "Founding design team at Figma. Former Pleo, Stripe, and Tile.",
        social: {
            twitter: "#",
            linkedin: "#",
            web: "#"
        }
    },
]

export default function AboutUs() {
  return (
    <main>
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.2)_0%,rgba(174,220,224,0.2)_15.35%,rgba(255,255,255,0.2)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            About us
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Our mission is to increase the GDP of your startup
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            Untitled is a technology company that builds infrastructure for your
            startup, so you don&apos;t have to. Businesses of every size—from
            new startups to public companies—use our software to manage their
            businesses.
          </p>
        </div>
      </section>

      <section className="bg-[url(/assets/images/website/about-us/stats-bg.jpg)] bg-cover bg-no-repeat bg-center mb-24 h-[340px] mx-[112px]">
        <div className="bg-[#005963B5] h-full flex justify-center gap-8 items-center">
          <div className="bg-[#FFFFFF4D] h-[212px] w-[341px] rounded-[16px] border border-[#FFFFFF4D] p-6 text-center">
            <h2 className="font-semibold text-white mb-3 text-[60px] leading-[72px]">
              400+
            </h2>
            <h3 className="font-semibold text-white text-[18px] leading-[28px]">
              Projects completed
            </h3>
            <p className="text-base text-white">
              We&apos;ve helped build over 400 projects with great companies.
            </p>
          </div>
          <div className="bg-[#FFFFFF4D] h-[212px] w-[341px] rounded-[16px] border border-[#FFFFFF4D] p-6 text-center">
            <h2 className="font-semibold text-white mb-3 text-[60px] leading-[72px]">
              600%
            </h2>
            <h3 className="font-semibold text-white text-[18px] leading-[28px]">
              Return on investment
            </h3>
            <p className="text-base text-white">
              We&apos;ve helped build over 400 projects with great companies.
            </p>
          </div>
          <div className="bg-[#FFFFFF4D] h-[212px] w-[341px] rounded-[16px] border border-[#FFFFFF4D] p-6 text-center">
            <h2 className="font-semibold text-white mb-3 text-[60px] leading-[72px]">
              10k
            </h2>
            <h3 className="font-semibold text-white text-[18px] leading-[28px]">
              Global downloads
            </h3>
            <p className="text-base text-white">
              Our free UI kit has been downloaded over 10k times.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FAFAFA]">
        <div className="text-center mb-16">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Our values
          </span>
          <h3 className="text-[#181D27] font-semibold text-[36px] mb-5">
            How we work at Omora
          </h3>
          <p className="text-[#535862] font-normal text-[20px]">
            Our shared values keep us connected and guide us as one team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-[112px]">
          {howWeWorkAtOmora.map((why, index) => (
            <div key={index} className=" text-center">
              <div className="mb-4 flex justify-center">
                <div className="size-12 flex justify-center items-center bg-white border border-[#D5D7DA] rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.08),_0px_-2px_0px_0px_rgba(255,255,255,0.6)_inset,_0px_0px_0px_1px_rgba(0,0,0,0.06)_inset]">
                  <Image
                    src={why.icon}
                    alt={why.title}
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <h4 className="font-semibold text-[18px] text-[#181D27] mb-1">
                {why.title}
              </h4>
              <p className="text-[#535862] text-base">{why.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-[112px]">
        <div className="text-center mb-16">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Our story
          </span>
          <h3 className="text-[#181D27] font-semibold text-[36px] mb-5">
            We&apos;re just getting started
          </h3>
          <p className="text-[#535862] font-normal text-[20px]">
            We&apos;ve already helped over 4,000 companies achieve remarkable
            results.
          </p>
        </div>

        <div className="flex gap-16">
          <div className="space-y-[28px]">
            <p className="text-[18px] leading-[28px]">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
              suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
              quis montes, sit sit. Tellus aliquam enim urna, etiam.
            </p>
            <p className="text-[18px] leading-[28px]">
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat
              mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu
              quis fusce augue enim. Quis at habitant diam at. Suscipit
              tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum
              molestie aliquet sodales id est ac volutpat.
            </p>
            <p className="text-[18px] leading-[28px]">
              Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
              aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare
              id morbi eget ipsum. Sapien, dictum molestie sem tempor. Diam
              elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor
              tellus. Sed vel, congue felis elit erat nam nibh orci.
            </p>
          </div>
          <div className="space-y-[28px]">
            <p className="text-[18px] leading-[28px]">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
              suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
              quis montes, sit sit. Tellus aliquam enim urna, etiam.
            </p>
            <ul className="text-[18px] leading-[28px] list-disc pl-5">
                <li>Nam elementum urna nisi aliquet erat dolor enim. Ornare</li>
                <li>eleifend faucibus eget vestibulum felis d quisque ligula ac diam amet. Vel etiam</li>
                <li>sit sit. Tellus aliquam enim urna</li>
            </ul>
            <p className="text-[18px] leading-[28px]">
              Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce
              aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare
              id morbi eget ipsum. Sapien, dictum molestie sem tempor. Diam
              elit, orci, tincidunt aenean tempus. Quis velit eget ut tortor
              tellus. Sed vel, congue felis elit erat nam nibh orci.
            </p>
          </div>
        </div>
      </section>
      <section className="py-24 mx-[112px] border-t border-[#E9EAEB]">
        <div className="text-center mb-16">
          <h3 className="text-[#181D27] font-semibold text-[36px] mb-5">
            Meet our team
          </h3>
          <p className="text-[#535862] font-normal text-[20px] w-[768px] mx-auto">
            Our philosophy is simple — hire a team of diverse, passionate people and foster a culture that empowers you to do your best work.
          </p>
        </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="relative h-[512px] w-[384px] flex flex-col justify-end items-center">
                <Image className="grayscale w-fit" src={member.image}  alt={member.name} height={512} width={384}/>
                <div className="absolute z-10 bottom-0 w-full bg-gradient-to-b from-black/0 to-black/40">
                    <div className="backdrop-blur-[24px] text-white bg-[#FFFFFF4D] p-5 rounded-[12px] border border-[#FFFFFF4D] m-4">
                    <h4 className="font-semibold text-[20px] mb-2">{member.name}</h4>
                    <h5 className="text-base font-semibold">{member.position}</h5>
                    <p>{member.description}</p>
                    
                    <div className="flex gap-5 mt-4">
                        <Link href={member.social.twitter}><Image src='assets\images\website\x.svg' alt="x" width={20} height={20} /></Link>
                        <Link href={member.social.linkedin}><Image src='assets\images\website\linkedin.svg' alt="linkedin" width={20} height={20} /></Link>
                        <Link href={member.social.web}><Image src='assets\images\website\web.svg' alt="web" width={20} height={20} /></Link>
                    </div>
                </div>
                </div>
            </div>
          ))}
        </div>
          </div>
      </section>
    </main>
  );
}
