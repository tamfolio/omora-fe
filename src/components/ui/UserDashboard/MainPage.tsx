import React from 'react';

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
  const setupSteps: SetupStep[] = [
    {
      id: 1,
      title: 'Verify Account',
      description: 'Start your KYC to get started with OMORA',
      completed: false,
      current: true
    },
    {
      id: 2,
      title: 'Set Risk Profile',
      description: 'Complete a short quiz to personalize your investment strategy',
      completed: false
    },
    {
      id: 3,
      title: 'Fund Your Account',
      description: 'Top up your account to activate your investment wallet',
      completed: false
    },
    {
      id: 4,
      title: 'Start Investment',
      description: 'Turn on automation and let Omora grow your portfolio',
      completed: false
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
  const progressPercentage = Math.round((completedSteps / setupSteps.length) * 100);

  const handleStepAction = (stepId: number) => {
    console.log(`Action for step: ${stepId}`);
  };

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

  const handleReadPost = (postId: string) => {
    console.log(`Reading post: ${postId}`);
  };

  const getCategoryColor = (category: Post['category']) => {
    switch (category) {
      case 'NFT':
        return 'bg-purple-100 text-purple-800';
      case 'BTC':
        return 'bg-orange-100 text-orange-800';
      case 'ALT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto px-20">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, Olivia
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
                        onClick={() => handleStepAction(step.id)}
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent posts</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0" style={{background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)'}} />
                  
                  {/* Author, Date and Category */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-semibold drop-shadow-lg mb-1">{post.author}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs opacity-90 drop-shadow-lg">{post.date}</p>
                      <span className="text-xs font-semibold text-white drop-shadow-lg">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {post.description}
                  </p>
                  <button
                    onClick={() => handleReadPost(post.id)}
                    className="text-cyan-600 hover:text-cyan-700 text-sm font-semibold flex items-center space-x-2 transition-all duration-200 group"
                  >
                    <span>Read post</span>
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;