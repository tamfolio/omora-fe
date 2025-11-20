import ConvertMoney from "@/components/fund-wallet/ConvertMoney";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ConvertMoneyPage() {
  return (
    <ProtectedRoute>
      <ConvertMoney />
    </ProtectedRoute>
  );
}
