import NewsoomGrid from "@/components/website/NewsoomGrid";
import Image from "next/image";

export default function NewsRoom() {
  return (
    <main className="px-[112px]">
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Newsroom
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Latest News on Omora
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            Our Moves, Milestones & Market Presence — All in One Place
          </p>
        </div>
      </section>
      <section>
        <div className="flex justify-center">
          <div className="relative text-white">
            <Image
              className="rounded-[16px]"
              src="/assets/images/website/default-headline.jpg"
              alt="default-headline.jpg"
              width={1216}
              height={720}
            />
            <div className="absolute bottom-8 right-8 left-8">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[24px] mb-2">
                    Omora News Headline goes here
                  </h2>
                  <Image
                    src="/assets/images/website/arrow-up-right-white.svg"
                    alt="arrow-up-right-white"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-base font-normal">
                  Tools and trends change, but good design is timeless. Learn
                  how to quickly develop an &quot;eye&quot; for design.
                </p>
              </div>
              <div className="flex items-start justify-between">
                <div className="flex gap-8 items-start">
                  <div className="flex flex-col justify-between gap-2">
                    <h3 className="text-sm font-semibold">Written by</h3>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/assets/images/website/avatar-2.png"
                        className="size-10 rounded-full border border-[#00000014]"
                        alt="arrow-up-right-white"
                        width={24}
                        height={24}
                      />
                      <span className="text-sm font-semibold">
                        Amélie Laurent
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold">Published on</h3>
                    <span className="text-base font-semibold">
                      10 April 2025
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">File under</h3>
                  <div className="flex gap-2 items-center mt-4 text-xs font-medium">
                    <span className="px-2 py-[2px] border border-[#FFFFFF] rounded-full">
                      Section 1
                    </span>
                    <span className="px-2 py-[2px] border border-[#FFFFFF] rounded-full">
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
