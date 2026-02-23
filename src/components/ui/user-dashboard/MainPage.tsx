"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SetupDashboard from "./SetupDashoard";
import CompletedDashboard from "./CompletedDashboard";
import { useUserData } from "@/contexts/UserDataContext";

interface SetupStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
}

interface Post {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  category: "NFT" | "BTC" | "ALT";
  image: string;
}

function MainPage() {
  const router = useRouter();
  const { userData, loading, refreshUserData } = useUserData();

  const [userName, setUserName] = useState("User");
  const [isKycCompleted, setIsKycCompleted] = useState(false);
  const [isRiskProfileCompleted, setIsRiskProfileCompleted] = useState(false);
  const [isAccountFunded, setIsAccountFunded] = useState(false);

  // Modal states
  const [showKycSuccessModal, setShowKycSuccessModal] = useState(false);
  const [showKycFailureModal, setShowKycFailureModal] = useState(false);

  // ✅ 2. Refresh data on mount to ensure fresh status
  useEffect(() => {
    refreshUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      const { user, business, onboardingState, wallets } = userData;

      // Set user name logic
      if (business?.businessName) {
        setUserName(business.businessName);
      } else if (user?.firstName) {
        const rawName = user.firstName;
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
        setUserName(formattedName);
      }

      // Check KYC Status
      const isKycDone = 
        (onboardingState?.currentStep === 'dashboard') || 
        (onboardingState?.currentStepStatus === 'C' && onboardingState?.nextStep === 'dashboard'); 
      
      setIsKycCompleted(isKycDone);
      setIsRiskProfileCompleted(user?.isRiskProfile === true);
      
      const ngnWallet = wallets?.find((w: any) => w.currency === 'NGN');
      setIsAccountFunded(ngnWallet ? ngnWallet.availableBalance > 0 : false);
    }
  }, [userData]);

  const setupSteps: SetupStep[] = [
    {
      id: 1,
      title: "Verify Account",
      description: "Start your KYC to get started with OMORA",
      completed: isKycCompleted,
      current: !isKycCompleted,
    },
    {
      id: 2,
      title: "Set Risk Profile",
      description: "Complete a short quiz to personalize your investment strategy",
      completed: isRiskProfileCompleted,
      current: isKycCompleted && !isRiskProfileCompleted,
    },
    {
      id: 3,
      title: "Fund Your Account",
      description: "Top up your account to activate your investment wallet",
      completed: isAccountFunded,
      current: isKycCompleted && isRiskProfileCompleted && !isAccountFunded,
    },
    {
      id: 4,
      title: "Start Investment",
      description: "Turn on automation and let Omora grow your portfolio",
      completed: false,
      current: isKycCompleted && isRiskProfileCompleted && isAccountFunded,
    },
  ];

  const recentPosts: Post[] = [
    {
      id: "1",
      author: "Lana Steiner",
      date: "18 Jan 2025",
      title: "NFT Market Experiences Significant Development",
      description: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
      category: "NFT",
      image: "/images/image1.jpg",
    },
    {
      id: "2",
      author: "Natali Craig",
      date: "14 Jan 2025",
      title: "Ethereum's Recent Surge May Lead to...",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      category: "BTC",
      image: "/images/image2.jpg",
    },
    {
      id: "3",
      author: "Natali Craig",
      date: "14 Jan 2025",
      title: "Ethereum's Recent Surge May Lead to...",
      description: "Collaboration can make our teams stronger, and our individual designs better.",
      category: "ALT",
      image: "/images/image2.jpg",
    },
  ];

  const completedStepsCount = setupSteps.filter((step) => step.completed).length;
  const isSetupComplete = completedStepsCount === setupSteps.length;

  const handleStepAction = (stepId: number) => {
    if (stepId === 1) router.push("/dashboard/kyc-verification");
    if (stepId === 2) router.push("/dashboard/risk-profile");
    if (stepId === 3) router.push("/dashboard/fund-wallet");
  };

  const handleReadPost = (postId: string) => {
    console.log(`Reading post: ${postId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isSetupComplete ? (
        <CompletedDashboard
          recentPosts={recentPosts}
          onReadPost={handleReadPost}
          userName={userName}
        />
      ) : (
        <SetupDashboard
          setupSteps={setupSteps}
          recentPosts={recentPosts}
          onStepAction={handleStepAction}
          onReadPost={handleReadPost}
          userName={userName}
        />
      )}

      {/* KYC Success Modal */}
      {showKycSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              KYC Verification Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You can now proceed with investments.
            </p>
            <button
              onClick={() => {
                setShowKycSuccessModal(false);
                // ✅ 3. Call refresh instead of reload
                refreshUserData(); 
              }}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* KYC Failure Modal */}
      {showKycFailureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't complete your verification. Please try again or contact support.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowKycFailureModal(false);
                  router.push("/dashboard/kyc-verification");
                }}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-lg font-medium"
              >
                Retry Verification
              </button>
              <button
                onClick={() => setShowKycFailureModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPage;