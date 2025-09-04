import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SetupDashboard from './SetupDashoard';
import CompletedDashboard from './CompletedDashboard';


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
  category: 'NFT' | 'BTC' | 'ALT';
  image: string;
}

function MainPage() {
  const router = useRouter();
  
  // State to control which dashboard to show
  const [isKycCompleted, setIsKycCompleted] = useState(true);
  const [isRiskProfileCompleted, setIsRiskProfileCompleted] = useState(true);

  const setupSteps: SetupStep[] = [
    {
      id: 1,
      title: 'Verify Account',
      description: 'Start your KYC to get started with OMORA',
      completed: isKycCompleted,
      current: !isKycCompleted
    },
    {
      id: 2,
      title: 'Set Risk Profile',
      description: 'Complete a short quiz to personalize your investment strategy',
      completed: isRiskProfileCompleted,
      current: isKycCompleted && !isRiskProfileCompleted
    },
    {
      id: 3,
      title: 'Fund Your Account',
      description: 'Top up your account to activate your investment wallet',
      completed: true,
      current: isKycCompleted && isRiskProfileCompleted
    },
    {
      id: 4,
      title: 'Start Investment',
      description: 'Turn on automation and let Omora grow your portfolio',
      completed: true
    }
  ];

  const recentPosts: Post[] = [
    {
      id: '1',
      author: 'Lana Steiner',
      date: '18 Jan 2025',
      title: 'NFT Market Experiences Significant Development',
      description: 'The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.',
      category: 'NFT',
      image: '/images/image1.jpg'
    },
    {
      id: '2',
      author: 'Natali Craig',
      date: '14 Jan 2025',
      title: "Ethereum's Recent Surge May Lead to...",
      description: 'Collaboration can make our teams stronger, and our individual designs better.',
      category: 'BTC',
      image: '/images/image2.jpg'
    },
    {
      id: '3',
      author: 'Natali Craig',
      date: '14 Jan 2025',
      title: "Ethereum's Recent Surge May Lead to...",
      description: 'Collaboration can make our teams stronger, and our individual designs better.',
      category: 'ALT',
      image: '/images/image2.jpg'
    }
  ];

  const completedSteps = setupSteps.filter(step => step.completed).length;
  const isSetupComplete = completedSteps === setupSteps.length;

  const handleStepAction = (stepId: number) => {
    console.log(`Action for step: ${stepId}`);
    
    if (stepId === 1) {
      router.push('/dashboard/kyc-verification');
    }
    if (stepId === 2) {
      router.push('/dashboard/risk-profile');
    }
  };

  const handleReadPost = (postId: string) => {
    console.log(`Reading post: ${postId}`);
  };

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

      {/* Debug Controls - Remove in production */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Debug Controls:</p>
        <div className="space-y-2">
          <button
            onClick={() => setIsKycCompleted(!isKycCompleted)}
            className="block w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle KYC: {isKycCompleted ? 'Completed' : 'Pending'}
          </button>
          <button
            onClick={() => setIsRiskProfileCompleted(!isRiskProfileCompleted)}
            className="block w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          >
            Toggle Risk Profile: {isRiskProfileCompleted ? 'Completed' : 'Pending'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainPage;