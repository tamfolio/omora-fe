import Portfolio from "@/components/portfolio/page";
import Navbar from "@/components/Navbar";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Portfolio />
    </div>
  );
}
