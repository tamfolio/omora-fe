// components/CompletedDashboard.tsx
import React, { useState } from 'react';
import PostsGrid from './PostGrid';

interface Post {
  id: string;
  author: string;
  date: string;
  title: string;
  description: string;
  category: 'NFT' | 'BTC' | 'ALT';
  image: string;
}

interface CompletedDashboardProps {
  recentPosts: Post[];
  onReadPost: (postId: string) => void;
  userName?: string;

}

function CompletedDashboard({ recentPosts, onReadPost, userName = 'User' }: CompletedDashboardProps) {
  const [activeTimeframe, setActiveTimeframe] = useState('12 months');
  const [isDcaActive, setIsDcaActive] = useState(true);

  const timeframes = ['12 months', '30 days', '7 days', '24 hours'];

  const assetData = [
    { name: 'BTC', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-cyan-500' },
    { name: 'ETH', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-blue-500' },
    { name: 'LTC', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-purple-500' },
    { name: 'XRP', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-orange-500' }
  ];

  const dogeData = [
    { name: 'DOGE', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-yellow-500' },
    { name: 'ETH', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-indigo-500' },
    { name: 'LTC', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-pink-500' },
    { name: 'XRP', percentage: '45%', value: '$56,631', change: '+6.2%', color: 'bg-green-500' }
  ];

  const toggleDca = () => {
    setIsDcaActive(!isDcaActive);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto px-20">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {userName}
        </h1>

        {/* Time Toggle and Status Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Based on your Risk Profile</span>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Time Toggle Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setActiveTimeframe(timeframe)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    activeTimeframe === timeframe
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>

            {/* DCA Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">DCA Active</span>
              <span className="text-sm text-gray-400">Conservative</span>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Portfolio Overview</h2>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Today&apos;s Realized PnL: <span className="text-green-600 font-medium">+0.00 (+0.00%)</span></p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-500 mb-2">Wallet Balance (USDT)</p>
                <p className="text-3xl font-bold text-gray-900">1000.56</p>
                <p className="text-sm text-gray-500">≈ $1000</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Wallet Balance (NGN)</p>
                <p className="text-3xl font-bold text-gray-900">200,000</p>
                <p className="text-sm text-gray-500">≈ ₦105.22</p>
              </div>
            </div>

            <div className="mt-6 pt-4 text-xs text-gray-500">
              <p>Conversion Rate: 1 USDT = ₦1,380.00 <button className="text-cyan-600 underline ml-2">Charges</button></p>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Asset Allocation</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                {assetData.map((asset) => (
                  <div key={asset.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${asset.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                      <span className="text-xs text-gray-500">({asset.percentage})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{asset.value}</div>
                      <div className="text-xs text-green-600">{asset.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {dogeData.map((asset) => (
                  <div key={asset.name + '_right'} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${asset.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                      <span className="text-xs text-gray-500">({asset.percentage})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{asset.value}</div>
                      <div className="text-xs text-green-600">{asset.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DCA Section and Market Sentiment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* DCA Bot Status */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleDca}
                  className="relative"
                >
                  <div className={`w-12 h-6 ${isDcaActive ? 'bg-green-500' : 'bg-gray-200'} rounded-full p-1 transition-colors`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDcaActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </button>
                <span className="text-sm font-medium text-gray-900">Your DCA is Active</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Dolar Cost Averaging Bot</h3>
              <p className="text-sm text-gray-500">CSC-IT-124</p>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <span>🔄</span>
                <span>Repeats everyday</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕰️</span>
                <span>7 PM, 9PM, 10:30 PM</span>
              </div>
            </div>
          </div>

          {/* Crypto Network Promotion */}
          <div className="lg:col-span-1 bg-[#E5FAFC] rounded-2xl p-6 text-white">
            <h3 className="text-lg font-bold mb-2 text-[#181D27]">Join our exclusive Crypto Currency Network and never miss out</h3>
            <p className="text-sm opacity-90 mb-6 text-[#535862]">There is an exclusive Regulated Crypto Currency Network that will be exclusive to Omora members</p>
            <button className="w-full bg-[#008B99] text-[white] font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:text-[#181D27] transition-colors">
              Join Now
            </button>
          </div>

          {/* Market Sentiment */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Market Sentiment</h3>
            
            <div className="relative flex items-center justify-center mb-4">
              {/* Semi-circular progress indicator */}
              <div className="relative w-32 h-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full"></div>
                <div className="absolute inset-2 bg-white rounded-t-full"></div>
                
                {/* Needle pointing to neutral */}
                <div className="absolute bottom-0 left-1/2 w-0.5 h-12 bg-gray-800 transform -translate-x-0.5 origin-bottom rotate-0"></div>
                
                {/* Center circle */}
                <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>0</span>
              <span>25</span>
              <span className="font-medium text-gray-900">50</span>
              <span>75</span>
              <span>100</span>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-1">Neutral</div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Latest Bitcoin Dolar Ahert $4 Market is current normal. Lorem Ipsum Dolar Ahert $4 Market is currently normal
              </p>
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <PostsGrid posts={recentPosts} onReadPost={onReadPost} />
      </div>
    </div>
  );
}

export default CompletedDashboard;