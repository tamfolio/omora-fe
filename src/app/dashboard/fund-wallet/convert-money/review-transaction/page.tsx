import ReviewTransaction from "@/components/fund-wallet/ReviewTransaction";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ConvertMoneyPage() {
  return (
    <ProtectedRoute>
      <ReviewTransaction />
    </ProtectedRoute>
  );
}
