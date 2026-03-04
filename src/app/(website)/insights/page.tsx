import InsightsGrid from "@/components/website/InsightsGrid";

export default function Insights() {
  return (
    <main className="px-4 md:px-8 lg:px-[112px] overflow-hidden">
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-full max-w-[768px] mx-auto px-4 md:px-0">
          <span className="text-[#00717D] font-semibold text-sm md:text-base mb-2 md:mb-3 block">
            Insights
          </span>

          <h1 className="text-[#181D27] font-semibold text-3xl md:text-[48px] leading-tight md:leading-normal mb-4 md:mb-6">
            Market Research & Crypto Insights
          </h1>

          <p className="text-[#535862] font-normal text-base md:text-[20px]">
            The latest industry news, interviews, technologies, and resources.
          </p>
        </div>
      </section>

      <InsightsGrid />
    </main>
  );
}
