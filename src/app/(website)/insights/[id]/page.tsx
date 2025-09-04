import Image from "next/image";
import { insightsData } from "../data";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InsightDetail({ params }: { params: { id: string } }) {
  const insight = insightsData.find((item) => item.id === Number(params.id));

  if (!insight) {
    redirect("/notfound");
  }

  return (
    <main className="px-[112px] bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
      <section className="py-24">
        <div
          className={`${insight.type === "Bullish" ? "bg-[#F3FEE7] border-[#D0F8AB]" : insight.type === "Bearish" ? "bg-[#FEF3F2] border-[#FECDCA]" : "bg-[#FAFAFA] border-[#E9EAEB]"} p-1 pr-3 min-w-[144px] w-fit rounded-full border mb-4 text-xs font-medium flex gap-2 justify-between items-center`}
        >
          <span
            className={`py-[2px] px-2 bg-white rounded-full ${insight.type === "Bullish" ? "text-[#326212] border-[#66C61C]" : insight.type === "Bearish" ? "text-[#B42318] border-[#FECDCA]" : "text-[#414651] border-[#E9EAEB]"} border`}
          >
            {insight.type}
          </span>
          <span className="text-[#535862] text-xs">{insight.readingTime}</span>
        </div>

        <h1 className="text-[#181D27] text-[48px] font-semibold">
          {insight.title}
        </h1>
        <p className="text-[#535862] max-w-[720px] text-wrap text-base mt-6">{insight.description}Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi.</p>
      </section>
      <section className="mb-24 flex gap-24">
        <div className="text-[#535862] max-w-[720px] text-[18px]">
          <h2 className="text-[#181D27] text-[30px] font-semibold mb-5">introduction</h2>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p>Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <div className="my-12">
          <Image src='/assets/images/website/default-single-insight.jpg' className="h-[480px] object-cover" alt="default-single-insight" width={720} height={480}/>
          <span className="flex items-center gap-1 mt-4 text-sm"><Image src='/assets/images/website/image-clip.svg' alt="default-single-insight" width={12} height={12}/> Image courtesy of Moose Photos via Pexels</span>
          </div>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <h3 className="text-[#181D27] text-[24px] font-semibold mb-4">Software and tools</h3>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <h3 className="text-[#181D27] text-[24px] font-semibold mb-4">Other resources</h3>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p>Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <div className="my-12">
          <Image src='/assets/images/website/default-single-insight.jpg' className="h-[480px] object-cover" alt="default-single-insight" width={720} height={480}/>
          <span className="flex items-center gap-1 mt-4 text-sm"><Image src='/assets/images/website/image-clip.svg' alt="default-single-insight" width={12} height={12}/> Image courtesy of Moose Photos via Pexels</span>
          </div>
          <p className="mb-7">Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
          <p>Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.</p>
        </div>
        <div className="max-w-[384px]">
          <div className="bg-[#FAFAFA] p-8 rounded-[16px] border border-[#E9EAEB]">
            <h2 className="text-[#008B99] mb-1 text-base">Grab up to 5,000 USDT in rewards</h2>
            <p className="text-[#535862] text-sm">Grab additional 50 USDT welcome gift instantly when you sign up today!</p>
            <Button className="mt-8 rounded-[8px] w-full bg-[#008B99] hover:bg-[#008B99] px-[18px] py-3 text-white text-base font-semibold">Join the bull run</Button>
          </div>

          <div  className="bg-[#FAFAFA] mt-10 p-8 rounded-[16px] border border-[#E9EAEB]">
            <h2 className="text-[#008B99] text-base">Related articles</h2>
            <div className="mt-4">
              <Link href='#' className="text-[#181D27] block font-medium text-sm">Mi tincidunt elit,  id quisque ligula ac diam, amet. Vel etiam.</Link>
              <span className="text-[#535862] text-base">Jul 23, 2025</span>
            </div>
            <div className="mt-4">
              <Link href='#' className="text-[#181D27] block font-medium text-sm">Mi tincidunt elit,  id quisque ligula ac diam, amet. Vel etiam.</Link>
              <span className="text-[#535862] text-base">Jul 23, 2025</span>
            </div>
            <div className="mt-4">
              <Link href='#' className="text-[#181D27] block font-medium text-sm">Mi tincidunt elit,  id quisque ligula ac diam, amet. Vel etiam.</Link>
              <span className="text-[#535862] text-base">Jul 23, 2025</span>
            </div>
          </div>
          <div className="flex gap-3 items-center mt-10">
            <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]"><Image src='/assets/images/website/image-clip.svg' alt="image-clip" width={20} height={20} /></span>
            <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]"><Image src='/assets/images/website/x-grey.png' alt="image-clip" width={20} height={20} /></span>
            <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]"><Image src='/assets/images/website/facebook.png' alt="image-clip" width={20} height={20} /></span>
            <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]"><Image src='/assets/images/website/linkedin.png' alt="image-clip" width={20} height={20} /></span>
          </div>
        </div>
      </section>
    </main>
  );
}
