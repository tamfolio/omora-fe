import React from 'react';
import PostsGrid from './PostGrid';

interface SetupStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
  userName?: string; 
}

interface Post {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  category: 'NFT' | 'BTC' | 'ALT';
  image: string;
}

interface SetupDashboardProps {
  setupSteps: SetupStep[];
  recentPosts: Post[];
  onStepAction: (stepId: number) => void;
  onReadPost: (postId: string) => void;
  userName?: string;
}

function SetupDashboard({ setupSteps, recentPosts, onStepAction, onReadPost, userName = 'User' }: SetupDashboardProps) {
  const completedSteps = setupSteps.filter(step => step.completed).length;
  const progressPercentage = Math.round((completedSteps / setupSteps.length) * 100);
// 
  const getStepButtonText = (step: SetupStep) => {
    if (step.completed) return 'Completed';
    if (step.current) {
      switch (step.id) {
        case 1: return 'Start KYC';
        case 2: return 'Continue';
        case 3: return 'Continue';
        case 4: return 'Begin Your Investment';
        default: return 'Continue';
      }
    }
    return 'Locked';
  };

  const isStepActionable = (step: SetupStep) => {
    return step.current || step.completed;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto px-20">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {userName}
        </h1>

        {/* Setup Progress Card */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Setup
              </h2>
              <p className="text-gray-600">
                You&apos;re almost ready to invest
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercentage}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-cyan-600">
                    {progressPercentage}%
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>

          {/* Setup Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="relative">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.completed 
                        ? 'bg-green-500 text-white' 
                        : step.current 
                          ? 'bg-cyan-500 text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }
                    `}>
                      {step.completed ? '✓' : step.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">
                        {step.description}
                      </p>
                      <button
                        onClick={() => onStepAction(step.id)}
                        disabled={!isStepActionable(step)}
                        className={`
                          text-xs font-medium px-3 py-1.5 rounded-md transition-colors duration-200
                          ${step.completed 
                            ? 'bg-green-100 text-green-700 cursor-default' 
                            : step.current 
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        {getStepButtonText(step)}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Connection line */}
                {index < setupSteps.length - 1 && (
                  <div className="hidden md:block absolute top-4 left-8 w-full h-0.5 bg-gray-200 -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts Section */}
        <PostsGrid posts={recentPosts} onReadPost={onReadPost} />
      </div>
    </div>
  );
}

export default SetupDashboard