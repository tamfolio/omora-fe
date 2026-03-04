import NewsoomGrid from "@/components/website/NewsoomGrid";
import Image from "next/image";

export default function NewsRoom() {
  return (
    // FIXED: Responsive main padding
    <main className="px-4 md:px-8 lg:px-[112px]">
      <section className="pt-12 md:pt-24 pb-12 md:pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        {/* FIXED: Replaced fixed w-[768px] with max-w */}
        <div className="w-full max-w-[768px] mx-auto px-4 md:px-0">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            Newsroom
          </span>
          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            Latest News on Omora
          </h1>
          <p className="text-[#535862] font-normal text-base md:text-[20px]">
            Our Moves, Milestones & Market Presence — All in One Place
          </p>
        </div>
      </section>
      
      <section>
        <div className="flex justify-center">
          {/* FIXED: Added overflow-hidden and group for hover effects */}
          <div className="relative text-white w-full rounded-[16px] overflow-hidden group">
            <Image
              // FIXED: Added fixed mobile heights so text doesn't spill out, and object-cover to prevent squishing
              className="w-full h-[450px] md:h-[500px] lg:h-[720px] object-cover transition-transform duration-700 group-hover:scale-105"
              src="/assets/images/website/default-headline.jpg"
              alt="default-headline"
              width={1216}
              height={720}
            />
            
            {/* FIXED: Added a gradient overlay so white text is always readable over the image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

            {/* FIXED: Responsive absolute positioning paddings */}
            <div className="absolute bottom-4 right-4 left-4 md:bottom-8 md:right-8 md:left-8">
              <div className="mb-4 md:mb-6">
                <div className="flex items-start md:items-center justify-between gap-4">
                  <h2 className="font-semibold text-xl md:text-[24px] mb-1 md:mb-2 leading-tight">
                    Omora News Headline goes here
                  </h2>
                  <Image
                    src="/assets/images/website/arrow-up-right-white.svg"
                    className="flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    alt="arrow-up-right-white"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-sm md:text-base font-normal text-gray-200 line-clamp-2 md:line-clamp-none">
                  Tools and trends change, but good design is timeless. Learn
                  how to quickly develop an &quot;eye&quot; for design.
                </p>
              </div>
              
              {/* FIXED: Stacked author/date and file-under on mobile, side-by-side on desktop */}
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-0">
                <div className="flex gap-6 md:gap-8 items-start">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-300">Written by</h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/images/website/avatar-2.png"
                        className="size-8 md:size-10 rounded-full border border-[#00000014]"
                        alt="author-avatar"
                        width={24}
                        height={24}
                      />
                      <span className="text-xs md:text-sm font-semibold">
                        Amélie Laurent
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 md:gap-4">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-300">Published on</h3>
                    <span className="text-sm md:text-base font-semibold">
                      10 April 2025
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-gray-300 mb-1.5 md:mb-0">File under</h3>
                  <div className="flex gap-2 items-center md:mt-4 text-[10px] md:text-xs font-medium">
                    <span className="px-2 py-1 border border-[#FFFFFF]/40 backdrop-blur-sm rounded-full">
                      Section 1
                    </span>
                    <span className="px-2 py-1 border border-[#FFFFFF]/40 backdrop-blur-sm rounded-full">
                      Section 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsoomGrid />
    </main>
  );
}