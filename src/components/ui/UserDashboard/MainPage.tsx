"use client"; // ensuring client-side rendering for hooks
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

  const [isLoading, setIsLoading] = useState(true);
  const [isKycCompleted, setIsKycCompleted] = useState(false);
  const [isRiskProfileCompleted, setIsRiskProfileCompleted] = useState(false);
  const [isAccountFunded, setIsAccountFunded] = useState(false);

  useEffect(() => {
    // Only fetch if we are authenticated and have a token
    if (status === "authenticated" && session?.accessToken) {
      const fetchUserStatus = async () => {
        try {
          const response = await fetch("/api/proxy/user/api/v1/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // You don't technically need to pass "Authorization" here anymore
              // because your route.ts does `await getToken(...)` and adds it automatically!
            },
          });

          if (!response.ok) {
            console.error("Dashboard Status Error:", response.status);
            return;
          }

          const result = await response.json();
          console.log("API Result:", result); // Debug log

          if (result.status === "success") {
            const { data } = result;

            // Logic to update state
            setIsKycCompleted(data.onboardingState?.currentStepStatus === "C");
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
      // Handle unauthenticated state if needed
      setIsLoading(false);
    }
  }, [status, session]);
  // Define Steps based on Real Data
  const setupSteps: SetupStep[] = [
    {
      id: 1,
      title: "Verify Account",
      description: "Start your KYC to get started with OMORA",
      completed: isKycCompleted,
      // Current if KYC is NOT done
      current: !isKycCompleted,
    },
    {
      id: 2,
      title: "Set Risk Profile",
      description:
        "Complete a short quiz to personalize your investment strategy",
      completed: isRiskProfileCompleted,
      // Current only if KYC is DONE but Risk Profile is NOT
      current: isKycCompleted && !isRiskProfileCompleted,
    },
    {
      id: 3,
      title: "Fund Your Account",
      description: "Top up your account to activate your investment wallet",
      completed: isAccountFunded,
      // Current only if KYC & Risk are DONE but Funding is NOT
      current: isKycCompleted && isRiskProfileCompleted && !isAccountFunded,
    },
    {
      id: 4,
      title: "Start Investment",
      description: "Turn on automation and let Omora grow your portfolio",
      completed: false, // Usually completed when they activate a bot
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

  // Logic to switch between SetupDashboard and CompletedDashboard
  // You can adjust this logic. Currently, it switches only if all 4 steps are "completed".
  // If you want it to switch earlier (e.g., after Funding), change the condition below.
  const completedStepsCount = setupSteps.filter(
    (step) => step.completed
  ).length;
  // Let's say Dashboard unlocks fully when Step 3 (Funding) is done?
  // Or stick to your original logic:
  const isSetupComplete = completedStepsCount === setupSteps.length;

  const handleStepAction = (stepId: number) => {
    if (stepId === 1) {
      router.push("/dashboard/kyc-verification");
    }
    if (stepId === 2) {
      router.push("/dashboard/risk-profile");
    }
    if (stepId === 3) {
      router.push("/dashboard/wallet/deposit"); // or wherever funding happens
    }
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
        />
      ) : (
        <SetupDashboard
          setupSteps={setupSteps}
          recentPosts={recentPosts}
          onStepAction={handleStepAction}
          onReadPost={handleReadPost}
        />
      )}
    </div>
  );
}

export default MainPage;
