"use client"
import InitiateQuiz from '@/components/ui/UserDashboard/risk-profile/InitiateQuiz'
import Questionnaire from '@/components/ui/UserDashboard/risk-profile/Questioniarre'
import QuizResult from '@/components/ui/UserDashboard/risk-profile/QuizResult'
import ChangeRiskProfile from '@/components/ui/UserDashboard/risk-profile/ChangeRiskProfile'
import RiskProfileSuccess from '@/components/ui/UserDashboard/risk-profile/RiskProfileSuccess'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// Types
type RiskProfile = 'aggressive' | 'balanced' | 'conservative';
type FlowStep = 'initiate' | 'questionnaire' | 'result' | 'change-profile' | 'success';

function Page() {
  const router = useRouter();
  
  // State management
  const [currentStep, setCurrentStep] = useState<FlowStep>('initiate');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [recommendedProfile, setRecommendedProfile] = useState<RiskProfile>('balanced');
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>('balanced');

  // Function to calculate risk profile based on quiz answers
  const calculateRiskProfile = (answers: Record<number, string>): RiskProfile => {
    let score = 0;
    
    // Scoring logic based on answers
    Object.values(answers).forEach((answer) => {
      // Conservative answers (score 1)
      if (answer.includes('Preserve capital') || 
          answer.includes('Less than 5%') || 
          answer.includes('Less than 1 year') ||
          answer.includes('Sell immediately') ||
          answer.includes('beginner') ||
          answer.includes('Less than 10%') ||
          answer.includes('Rarely') ||
          answer.includes('avoid it')) {
        score += 1;
      }
      // Aggressive answers (score 3)
      else if (answer.includes('Maximize returns') ||
               answer.includes('More than 15%') ||
               answer.includes('More than 3 years') ||
               answer.includes('Buy more') ||
               answer.includes('actively trade') ||
               answer.includes('More than 30%') ||
               answer.includes('Actively') ||
               answer.includes('embrace')) {
        score += 3;
      }
      // Balanced answers (score 2)
      else {
        score += 2;
      }
    });

    // Calculate average score
    const averageScore = score / Object.keys(answers).length;
    
    if (averageScore <= 1.5) return 'conservative';
    if (averageScore >= 2.5) return 'aggressive';
    return 'balanced';
  };

  // Flow handlers
  const handleStartQuiz = () => {
    setCurrentStep('questionnaire');
  };

  const handleQuizSubmit = (answers: Record<number, string>) => {
    setQuizAnswers(answers);
    const profile = calculateRiskProfile(answers);
    setRecommendedProfile(profile);
    setSelectedProfile(profile);
    setCurrentStep('result');
  };

  const handleAcceptProfile = () => {
    setCurrentStep('success');
  };

  const handleChangeProfile = () => {
    setCurrentStep('change-profile');
  };

  const handleProfileChange = (newProfile: string) => {
    setSelectedProfile(newProfile as RiskProfile);
    setCurrentStep('success');
  };

  const handleGoToDashboard = () => {
    // Here you would typically save the selected profile to your backend
    console.log('Selected Risk Profile:', selectedProfile);
    router.push('/dashboard');
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  const handleCancel = () => {
    setCurrentStep('result');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'initiate':
        return (
          <InitiateQuiz 
            onStartQuiz={handleStartQuiz}
            onClose={handleClose}
          />
        );
      
      case 'questionnaire':
        return (
          <Questionnaire 
            onSubmit={handleQuizSubmit}
            onClose={handleClose}
          />
        );
      
      case 'result':
        return (
          <QuizResult 
            riskProfile={recommendedProfile}
            onAccept={handleAcceptProfile}
            onChangeProfile={handleChangeProfile}
            onClose={handleClose}
          />
        );
      
      case 'change-profile':
        return (
          <ChangeRiskProfile 
            currentProfile={recommendedProfile}
            onContinue={handleProfileChange}
            onCancel={handleCancel}
            onClose={handleClose}
          />
        );
      
      case 'success':
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
    </div>
  );
}

export default Page;