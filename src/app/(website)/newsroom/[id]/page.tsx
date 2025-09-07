import Image from "next/image";
import { Newsroom, NewsroomData } from "../data";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const newsroomRecommendation: Newsroom = [
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

export default function NewsroomDetail({ params }: { params: { id: string } }) {
  const newsroom = NewsroomData.find((item) => item.id === Number(params.id));

  if (!newsroom) {
    redirect("/notfound");
  }

  return (
    <main className="px-[112px] bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
      <section className="py-24">
        <div className="max-w-[768px] text-center mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            {newsroom.type}
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            {newsroom.title}
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            {newsroom.description}
          </p>
        </div>
        <div className="flex justify-center mt-8 mb-16">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/website/avatar-2.png"
              className="size-10 rounded-full border border-[#00000014]"
              alt="arrow-up-right-white"
              width={24}
              height={24}
            />
            <div>
              <p className="text-sm font-semibold text-[#181D27]">
                {newsroom.author}
              </p>
              <p className="text-[#535862] text-sm flex iteems-center justify-between">
                {newsroom.date}
              </p>
            </div>
          </div>
        </div>
        <div className="px-24">
          <Image
            src="/assets/images/website/default-headline.jpg"
            className="w-full border border-[#00000014]"
            alt="arrow-up-right-white"
            width={1024}
            height={560}
          />
        </div>
      </section>
      <section className="mb-24">
        <p className="mb-[74px] text-[#535862] max-w-[720px] mx-auto">
          Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
          suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis
          montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere
          vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien
          varius id.
        </p>
        <div className="text-[#535862] mx-auto max-w-[720px] text-[18px]">
          <h2 className="text-[#181D27] text-[30px] font-semibold mb-5">
            introduction
          </h2>
          <p className="mb-7">
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
          <div className="my-12">
            <Image
              src="/assets/images/website/default-single-insight.jpg"
              className="h-[480px] object-cover"
              alt="default-single-insight"
              width={720}
              height={480}
            />
            <span className="flex items-center gap-1 mt-4 text-sm">
              <Image
                src="/assets/images/website/image-clip.svg"
                alt="default-single-insight"
                width={12}
                height={12}
              />{" "}
              Image courtesy of Moose Photos via Pexels
            </span>
          </div>
          <p className="mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p className="mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <h3 className="text-[#181D27] text-[24px] font-semibold mb-4">
            Software and tools
          </h3>
          <p className="mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p className="mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <h3 className="text-[#181D27] text-[24px] font-semibold mb-4">
            Other resources
          </h3>
          <p className="mb-7">
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
          <div className="my-12">
            <Image
              src="/assets/images/website/default-single-insight.jpg"
              className="h-[480px] object-cover"
              alt="default-single-insight"
              width={720}
              height={480}
            />
            <span className="flex items-center gap-1 mt-4 text-sm">
              <Image
                src="/assets/images/website/image-clip.svg"
                alt="default-single-insight"
                width={12}
                height={12}
              />{" "}
              Image courtesy of Moose Photos via Pexels
            </span>
          </div>
          <p className="mb-7">
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
        </div>

        <div className="mx-auto max-w-[720px] p-8 bg-[#FAFAFA] rounded-[16px] my-12">
          <h4 className="mb-3 text-[#181D27] font-semibold text-[24px]">
            Heading text
          </h4>
          <p className="mb-7">
            Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam
            suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum
            quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris
            posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At
            feugiat sapien varius id.
          </p>
          <p className="mb-7">
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
        </div>

        <div className="mx-auto max-w-[720px] flex gap-3 items-center mt-10">
          <Button className="border text-[#414651] bg-transparent hover:bg-transparent border-[#D5D7DA] flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/copy-grey.png"
              alt="image-clip"
              width={20}
              height={20}
            />
            Copy link
          </Button>
          <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/x-grey.png"
              alt="image-clip"
              width={20}
              height={20}
            />
          </span>
          <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/facebook.png"
              alt="image-clip"
              width={20}
              height={20}
            />
          </span>
          <span className="size-10 border border-[#D5D7DA] flex items-center justify-center rounded-[8px]">
            <Image
              src="/assets/images/website/linkedin.png"
              alt="image-clip"
              width={20}
              height={20}
            />
          </span>
        </div>
      </section>
      <section className="py-24 flex flex-col md:flex-row gap-16">
        <div className="max-w-[400px]">
          <h3 className="text-[#00717D] text-base font-semibold">Latest</h3>
          <h4 className="text-[36px] text-[#181D27] font-semibold mb-5">
            News
          </h4>
          <p className="text-[#535862] text-[18px]">
            The latest industry news, interviews, technologies, and resources.
          </p>
          <Button className="bg-[#008B99] px-[18px] py-3 rounded-[8px] mt-8">
            View all posts
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full">
          {newsroomRecommendation.map((insights, index) => (
            <Link href={`/newsroom/${index + 1}`} key={index} className="block">
              <div key={index} className="w-full">
                <div className="relative mb-[10px]">
                  <Image
                    className="rounded-t-[10px] w-full"
                    src={insights.image}
                    alt={insights.title}
                    height={256}
                    width={384}
                  />
                  <div className="absolute size-10 rounded-full flex items-center justify-center bg-[#FFFFFF50] right-5 top-4">
                    <Image
                      className="mt-3"
                      src="/assets/images/website/bookmark.svg"
                      alt="bookmark"
                      height={24}
                      width={24}
                    />
                  </div>
                </div>
                <h2 className="text-[#00717D] text-sm font-semibold mb-2">
                  {insights.type}
                </h2>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-[#181D27] text-[18px] mb-1">
                    {insights.title}
                  </h2>{" "}
                  <Image
                    src="/assets/images/website/arrow-up-right.svg"
                    width={24}
                    height={24}
                    alt="arrow-up-right"
                  />
                </div>
                <p className="text-[#535862] text-base mb-5">
                  {insights.description}
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/images/website/avatar-2.png"
                    className="size-10 rounded-full border border-[#00000014]"
                    alt="arrow-up-right-white"
                    width={24}
                    height={24}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#181D27]">
                      {insights.author}
                    </p>
                    <p className="text-[#535862] text-sm flex iteems-center justify-between">
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
