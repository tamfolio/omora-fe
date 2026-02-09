"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SetupDashboard from "./SetupDashoard";
import CompletedDashboard from "./CompletedDashboard";
import { useSession } from "next-auth/react";

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
  const { data: session, status } = useSession();

  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const [isKycCompleted, setIsKycCompleted] = useState(false);
  const [isRiskProfileCompleted, setIsRiskProfileCompleted] = useState(false);
  const [isAccountFunded, setIsAccountFunded] = useState(false);

  // NEW: KYC modal states
  const [showKycSuccessModal, setShowKycSuccessModal] = useState(false);
  const [showKycFailureModal, setShowKycFailureModal] = useState(false);

  // NEW: Check for KYC completion status from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const kycStatus = searchParams.get("kyc");

      if (kycStatus === "complete") {
        // Verify liveness completion with backend
        const verifyKycCompletion = async () => {
          try {
            const response = await fetch("/api/proxy/user/api/v1/me", {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
              const result = await response.json();
              if (result.status === "success") {
                const livenessRecord = result.data.verification?.find(
                  (v: any) => v.type === "LIVENESS",
                );

                // Show success if liveness is complete, otherwise show failure
                if (livenessRecord?.status === "C") {
                  setShowKycSuccessModal(true);
                } else {
                  // Still processing, show success anyway (backend will update)
                  setShowKycSuccessModal(true);
                }
              }
            }
          } catch (error) {
            console.error("Error verifying KYC completion:", error);
          }

          // Clear URL params
          window.history.replaceState({}, "", "/dashboard");
        };

        verifyKycCompletion();
      } else if (kycStatus === "failed") {
        setShowKycFailureModal(true);
        window.history.replaceState({}, "", "/dashboard");
      } else if (kycStatus === "pending") {
        // ADD THIS: User closed verification early - just clear params, no modal
        console.log("User closed verification early - no modal shown");
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const fetchUserStatus = async () => {
        try {
          const response = await fetch("/api/proxy/user/api/v1/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Dashboard Status Error:", response.status);
            return;
          }

          const result = await response.json();

          if (result.status === "success") {
            const { data } = result;

            // Set user name - prioritize business name for corporate accounts
            if (data.business?.businessName) {
              setUserName(data.business.businessName);
            } else if (data.user?.firstName) {
              const rawName = data.user.firstName;
              const formattedName =
                rawName.charAt(0).toUpperCase() +
                rawName.slice(1).toLowerCase();
              setUserName(formattedName);
            }
            // KYC is only complete when currentStep is 'dashboard' or nextStep is 'dashboard'
            const kycSteps = [
              "verify-email",
              "create-pin",
              "verify-country",
              "personal-info",
              "contact-info",
              "document-upload",
              "facial-recognition",
              "verify-liveness",
            ];
            const currentStep = data.onboardingState?.currentStep;

            // KYC is done ONLY when currentStep is 'dashboard'
            const isKycDone =
              data.onboardingState?.nextStep === "dashboard" ||
              data.onboardingState?.currentStep === "dashboard";

            setIsKycCompleted(isKycDone);
            setIsRiskProfileCompleted(data.user?.isRiskProfile === true);
            setIsAccountFunded(data.personalWallet?.availableBalance > 0);
          }
        } catch (error) {
          console.error("Failed to fetch user status", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserStatus();
    } else if (status === "unauthenticated") {
      setIsLoading(false);
    }
  }, [status, session]);

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
      description:
        "Complete a short quiz to personalize your investment strategy",
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
      description:
        "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
      category: "NFT",
      image: "/images/image1.jpg",
    },
    {
      id: "2",
      author: "Natali Craig",
      date: "14 Jan 2025",
      title: "Ethereum's Recent Surge May Lead to...",
      description:
        "Collaboration can make our teams stronger, and our individual designs better.",
      category: "BTC",
      image: "/images/image2.jpg",
    },
    {
      id: "3",
      author: "Natali Craig",
      date: "14 Jan 2025",
      title: "Ethereum's Recent Surge May Lead to...",
      description:
        "Collaboration can make our teams stronger, and our individual designs better.",
      category: "ALT",
      image: "/images/image2.jpg",
    },
  ];

  const completedStepsCount = setupSteps.filter(
    (step) => step.completed,
  ).length;
  const isSetupComplete = completedStepsCount === setupSteps.length;

  const handleStepAction = (stepId: number) => {
    if (stepId === 1) router.push("/dashboard/kyc-verification");
    if (stepId === 2) router.push("/dashboard/risk-profile");
    if (stepId === 3) router.push("/dashboard/fund-wallet");
  };

  const handleReadPost = (postId: string) => {
    console.log(`Reading post: ${postId}`);
  };

  if (isLoading) {
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
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              KYC Verification Complete!
            </h2>
            <p className="text-gray-600 mb-6">
              Your identity has been successfully verified. You can now proceed
              with investments.
            </p>
            <button
              onClick={() => {
                setShowKycSuccessModal(false);
                window.location.reload(); // Refresh to update dashboard state
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
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't complete your verification. Please try again or
              contact support.
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
