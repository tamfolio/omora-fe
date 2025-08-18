import Navbar from '@/components/fund-wallet/Navbar';
import FundWalletComponent from '@/components/fund-wallet/page';

export default function FundWalletPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <FundWalletComponent />
    </div>
  );
}