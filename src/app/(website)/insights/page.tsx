import InsightsGrid from "@/components/website/InsightsGrid";

export default function Insigts() {
  return (
    <main>
      <section className="pt-24 pb-16 text-center bg-[linear-gradient(180deg,rgba(121,183,188,0.08)_0%,rgba(174,220,224,0.08)_15.35%,rgba(255,255,255,0.08)_34.1%)] bg-blend-overlay">
        <div className="w-[768px] mx-auto">
          <span className="text-[#00717D] font-semibold text-base mb-3">
            Insights
          </span>
          <h1 className="text-[#181D27] font-semibold text-[48px] mb-6">
            Market Research & Crypto Insights
          </h1>
          <p className="text-[#535862] font-normal text-[20px]">
            The latest industry news, interviews, technologies, and resources.
          </p>
        </div>
      </section>
      <InsightsGrid />
    </main>
  );
}
