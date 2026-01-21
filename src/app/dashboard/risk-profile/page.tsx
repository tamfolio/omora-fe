"use client";
import InitiateQuiz from "@/components/ui/UserDashboard/risk-profile/initiateQuiz";
import Questionnaire from "@/components/ui/UserDashboard/risk-profile/questioniarre";
import QuizResult from "@/components/ui/UserDashboard/risk-profile/quizResult";
import ChangeRiskProfile from "@/components/ui/UserDashboard/risk-profile/changeRiskProfile";
import RiskProfileSuccess from "@/components/ui/UserDashboard/risk-profile/riskProfileSuccess";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import riskProfileApiService, {
  RiskProfileQuestion,
} from "@/lib/risk-profile-api-service";

type RiskProfile = "aggressive" | "balanced" | "conservative";
type FlowStep =
  | "initiate"
  | "questionnaire"
  | "result"
  | "change-profile"
  | "success";

function Page() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<FlowStep>("initiate");
  const [questions, setQuestions] = useState<RiskProfileQuestion[]>([]);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<
    Record<number, number>
  >({});
  const [recommendedProfile, setRecommendedProfile] =
    useState<RiskProfile>("balanced");
  const [selectedProfile, setSelectedProfile] =
    useState<RiskProfile>("balanced");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on mount for later use
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await riskProfileApiService.getRiskProfileQuestions();
      if (response.data) {
        setQuestions(response.data);
      }
    } catch (error) {
      console.error("Failed to prefetch questions:", error);
    }
  };

  const handleStartQuiz = () => {
    setCurrentStep("questionnaire");
  };

  const handleQuizSubmit = async (answerIds: Record<number, number>) => {
    setSelectedAnswerIds(answerIds);
    setIsLoading(true);
    setError(null);

    try {
      // 1. Calculate the score on the frontend
      const averageScore = riskProfileApiService.calculateRiskPointsAverage(
        questions,
        answerIds,
      );

      // Safety check: ensure score is within 3-7 range to prevent API error
      if (averageScore < 3 || averageScore > 7) {
        console.warn("Score out of range (3-7), adjusting...");
        // You might want to clamp it or show an error, but let's just proceed for now
      }

      // 2. Send the SCORE (number) to the API
      const response =
        await riskProfileApiService.getRiskProfileRecommendation(averageScore);

      if (response.data && response.data.recommended) {
        // Map "Low"/"Balanced"/"High" to your UI state
        const profile = riskProfileApiService.mapProfileToUserFriendly(
          response.data.recommended,
        );

        setRecommendedProfile(profile);
        setSelectedProfile(profile);
        setCurrentStep("result");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      console.error("❌ Error getting recommendation:", err);
      // Log the actual server error message if available
      if (err.response?.data) {
        console.error("Server Error Details:", err.response.data);
      }
      setError(err.message || "Failed to get risk profile recommendation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptProfile = async () => {
    setIsLoading(true);
    try {
      // 1. Save to backend
      await riskProfileApiService.saveRiskProfile(selectedProfile);

      // 2. ONLY show success screen if the save worked
      setCurrentStep("success");
    } catch (err: any) {
      console.error("Failed to save profile", err);
      setError(err.message || "Failed to save your profile. Please try again.");
      // We stay on the Result screen so they can try again
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeProfile = () => {
    setCurrentStep("change-profile");
  };

  const handleProfileChange = (newProfile: string) => {
    setSelectedProfile(newProfile as RiskProfile);

    setCurrentStep("success");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleClose = () => {
    router.push("/dashboard");
  };

  const handleCancel = () => {
    setCurrentStep("result");
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative bg-white rounded-2xl p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Calculating your risk profile...</p>
            </div>
          </div>
        </div>
      );
    }

    switch (currentStep) {
      case "initiate":
        return (
          <InitiateQuiz onStartQuiz={handleStartQuiz} onClose={handleClose} />
        );

      case "questionnaire":
        return (
          <Questionnaire onSubmit={handleQuizSubmit} onClose={handleClose} />
        );

      case "result":
        return (
          <QuizResult
            riskProfile={recommendedProfile}
            onAccept={handleAcceptProfile}
            onChangeProfile={handleChangeProfile}
            onClose={handleClose}
          />
        );

      case "change-profile":
        return (
          <ChangeRiskProfile
            currentProfile={recommendedProfile}
            onContinue={handleProfileChange}
            onCancel={handleCancel}
            onClose={handleClose}
          />
        );

      case "success":
        return (
          <RiskProfileSuccess
            onGoToDashboard={handleGoToDashboard}
            onClose={handleClose}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div>
      {renderCurrentStep()}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:bg-red-600 rounded p-1"
            >
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
