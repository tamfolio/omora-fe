import Image from "next/image";
import { Newsroom, NewsroomData } from "../data";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const newsroomRecommendation: Newsroom = [
  {
    id: 1,
    title: "Bill Walsh leadership lessons",
    description:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    date: "17 Jan 2025",
    type: "Section 2",
    image: "/assets/images/website/default-insight.jpg",
    author: "Olivia Rhye",
    bookmark: false,
  },
  {
    id: 2,
    title: "Bill Walsh leadership lessons",
    description:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    date: "17 Jan 2025",
    type: "Section 1",
    image: "/assets/images/website/default-insight.jpg",
    author: "Olivia Rhye",
    bookmark: false,
  },
];

// Next.js 15 async params perfectly implemented
export default async function NewsroomDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsroom = NewsroomData.find((item) => item.id === Number(id));

  if (!newsroom) {
    redirect("/notfound");
  }

  return (
    // FIXED: Made main padding responsive (px-4 for mobile, lg:px-[112px] for desktop)
    <main className="px-4 md:px-8 lg:px-[112px] bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
      
      {/* HEADER SECTION */}
      <section className="py-12 md:py-24">
        <div className="max-w-[768px] text-center mx-auto">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-3 block">
            {newsroom.type}
          </span>
          {/* FIXED: Responsive text size for mobile */}
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            {newsroom.title}
          </h1>
          <p className="text-[#535862] font-normal text-lg md:text-[20px]">
            {newsroom.description}
          </p>
        </div>

        <div className="flex justify-center mt-6 md:mt-8 mb-10 md:mb-16">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/images/website/avatar-2.png"
              className="size-10 rounded-full border border-[#00000014]"
              alt="author-avatar"
              width={24}
              height={24}
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-[#181D27]">
                {newsroom.author}
              </p>
              {/* FIXED typo: iteems-center -> items-center */}
              <p className="text-[#535862] text-sm flex items-center justify-between">
                {newsroom.date}
              </p>
            </div>
          </div>
        </div>

        {/* FIXED: Removed huge mobile padding from image container */}
        <div className="px-0 md:px-12 lg:px-24 w-full">
          <Image
            src="/assets/images/website/default-headline.jpg"
            className="w-full rounded-xl object-cover border border-[#00000014] aspect-video md:aspect-auto"
            alt="article-hero-image"
            width={1024}
            height={560}
          />
        </div>
      </section>

      {/* ARTICLE BODY SECTION */}
      <section className="mb-16 md:mb-24">
        <p className="mb-10 md:mb-[74px] text-[#535862] max-w-[720px] mx-auto text-base md:text-lg">
          Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
          suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis
          montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere
          vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien
          varius id.
        </p>

        <div className="text-[#535862] mx-auto max-w-[720px] text-base md:text-[18px] leading-relaxed">
          <h2 className="text-[#181D27] text-2xl md:text-[30px] font-semibold mb-4 md:mb-5 capitalize">
            Introduction
          </h2>
          <p className="mb-6 md:mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p>
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>

          <div className="my-8 md:my-12">
            {/* FIXED: Allow height to adapt on mobile instead of strictly 480px */}
            <Image
              src="/assets/images/website/default-single-insight.jpg"
              className="h-[250px] md:h-[480px] w-full object-cover rounded-xl"
              alt="default-single-insight"
              width={720}
              height={480}
            />
            <span className="flex items-center gap-2 mt-4 text-xs md:text-sm text-gray-500">
              <Image
                src="/assets/images/website/image-clip.svg"
                alt="image-clip"
                width={12}
                height={12}
              />
              Image courtesy of Moose Photos via Pexels
            </span>
          </div>

          <p className="mb-6 md:mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>

          <h3 className="text-[#181D27] text-xl md:text-[24px] font-semibold mt-10 mb-4">
            Software and tools
          </h3>
          <p className="mb-6 md:mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>

          <h3 className="text-[#181D27] text-xl md:text-[24px] font-semibold mt-10 mb-4">
            Other resources
          </h3>
          <p className="mb-6 md:mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
        </div>

        {/* CALLOUT BOX */}
        <div className="mx-auto max-w-[720px] p-6 md:p-8 bg-[#FAFAFA] rounded-[16px] my-8 md:my-12">
          <h4 className="mb-3 text-[#181D27] font-semibold text-xl md:text-[24px]">
            Heading text
          </h4>
          <p className="mb-6 text-[#535862]">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p className="text-[#535862]">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
        </div>

        {/* SOCIAL SHARE BUTTONS */}
        <div className="mx-auto max-w-[720px] flex flex-wrap gap-3 items-center mt-10">
          <Button className="border text-[#414651] bg-transparent hover:bg-gray-50 border-[#D5D7DA] flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/copy-grey.png"
              alt="copy-link"
              className="mr-2"
              width={20}
              height={20}
            />
            Copy link
          </Button>
          <button className="size-10 border border-[#D5D7DA] hover:bg-gray-50 transition-colors flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/x-grey.png"
              alt="share-x"
              width={20}
              height={20}
            />
          </button>
          <button className="size-10 border border-[#D5D7DA] hover:bg-gray-50 transition-colors flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/facebook.png"
              alt="share-facebook"
              width={20}
              height={20}
            />
          </button>
          <button className="size-10 border border-[#D5D7DA] hover:bg-gray-50 transition-colors flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/linkedin.png"
              alt="share-linkedin"
              width={20}
              height={20}
            />
          </button>
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section className="py-12 md:py-24 border-t border-gray-100 flex flex-col lg:flex-row gap-10 lg:gap-16">
        <div className="w-full lg:max-w-[400px]">
          <h3 className="text-[#00717D] text-base font-semibold mb-2">Latest</h3>
          <h4 className="text-[32px] md:text-[36px] text-[#181D27] font-semibold mb-4 md:mb-5">
            News
          </h4>
          <p className="text-[#535862] text-base md:text-[18px]">
            The latest industry news, interviews, technologies, and resources.
          </p>
          <Button className="bg-[#008B99] hover:bg-teal-700 px-[18px] py-3 rounded-[8px] mt-6 md:mt-8">
            View all posts
          </Button>
        </div>

        {/* FIXED: Changed to grid-cols-1 on mobile, grid-cols-2 on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {newsroomRecommendation.map((insights, index) => (
            <Link href={`/newsroom/${insights.id}`} key={insights.id} className="block group">
              <div className="w-full h-full flex flex-col">
                <div className="relative mb-4 overflow-hidden rounded-t-[10px]">
                  <Image
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-[3/2]"
                    src={insights.image}
                    alt={insights.title}
                    height={256}
                    width={384}
                  />
                  <div className="absolute size-10 rounded-full flex items-center justify-center bg-white/30 backdrop-blur-sm right-4 top-4 hover:bg-white/50 transition-colors">
                    <Image
                      src="/assets/images/website/bookmark.svg"
                      alt="bookmark"
                      height={20}
                      width={20}
                    />
                  </div>
                </div>
                
                <h2 className="text-[#00717D] text-sm font-semibold mb-2">
                  {insights.type}
                </h2>
                
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-semibold text-[#181D27] text-lg md:text-[18px] leading-tight group-hover:text-[#00717D] transition-colors">
                    {insights.title}
                  </h2>
                  <Image
                    src="/assets/images/website/arrow-up-right.svg"
                    className="flex-shrink-0 mt-1 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    width={24}
                    height={24}
                    alt="arrow-up-right"
                  />
                </div>
                
                <p className="text-[#535862] text-sm md:text-base mb-5 line-clamp-2">
                  {insights.description}
                </p>
                
                <div className="flex items-center gap-3 mt-auto">
                  <Image
                    src="/assets/images/website/avatar-2.png"
                    className="size-10 rounded-full border border-[#00000014]"
                    alt="author"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#181D27]">
                      {insights.author}
                    </p>
                    <p className="text-[#535862] text-sm">
                      {insights.date}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}