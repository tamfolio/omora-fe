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

            // Set user name
            if (data.user?.firstName) {
              const rawName = data.user.firstName;
              const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
              setUserName(formattedName);
            }

            // FIX: Check if user has COMPLETED KYC (including liveness)
            // currentStepStatus 'C' at 'verify-liveness' means user is ON that step, not completed
            // KYC is only complete when currentStep is 'dashboard' or nextStep is 'dashboard'
            const kycSteps = [
              'verify-email', 
              'create-pin', 
              'verify-country', 
              'personal-info', 
              'contact-info', 
              'document-upload', 
              'facial-recognition',
              'verify-liveness'
            ];
            const currentStep = data.onboardingState?.currentStep;
            
            // KYC is done ONLY when currentStep is 'dashboard'
            const isKycDone = currentStep === 'dashboard';
            
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

  const completedStepsCount = setupSteps.filter((step) => step.completed).length;
  const isSetupComplete = completedStepsCount === setupSteps.length;

  const handleStepAction = (stepId: number) => {
    if (stepId === 1) router.push("/dashboard/kyc-verification");
    if (stepId === 2) router.push("/dashboard/risk-profile");
    if (stepId === 3) router.push("/dashboard/fund-wallet");
  };

  const handleReadPost = (postId: string) => {
   
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
    </div>
  );
}

export default MainPage;