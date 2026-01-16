import FundWalletComponent from "@/components/fund-wallet/FundWallet";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function FundWalletPage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <FundWalletComponent />
    </div>
    </ProtectedRoute>
  );
}
