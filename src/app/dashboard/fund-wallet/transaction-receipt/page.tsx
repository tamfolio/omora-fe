import TransactionReceipt from "@/components/fund-wallet/TransactionReceipt";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TransactionReceiptPage() {
  return (
    <ProtectedRoute>
      <TransactionReceipt />
    </ProtectedRoute>
  );
}
