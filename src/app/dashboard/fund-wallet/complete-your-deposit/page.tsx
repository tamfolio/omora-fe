import CompleteYourDeposit from "@/components/fund-wallet/CompleteYourDeposit";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CompleteYourDepositPage() {
  return (
    <ProtectedRoute>
<CompleteYourDeposit />
 </ProtectedRoute>
  );
  
}
