import React, { useState } from 'react';
import { ArrowLeft, Camera, Check } from 'lucide-react';
import Logo from '../../Logo';

interface FacialRecognitionProps {
  onNext: () => void;
  onBack: () => void;
}

function FacialRecognition({ onNext, onBack }: FacialRecognitionProps) {
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowAccess = async () => {
    setIsRequesting(true);
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // If we get here, permission was granted
      setIsPermissionGranted(true);
      
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach(track => track.stop());
      
      // Simulate processing time before moving to next step
      setTimeout(() => {
        console.log('Camera permission granted, proceeding to facial recognition');
        onNext();
      }, 1500);
      
    } catch (error) {
      console.error('Camera permission denied:', error);
      alert('Camera access is required for facial recognition. Please allow camera access and try again.');
    } finally {
      setIsRequesting(false);
    }
  };

  return 
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 font-medium">Back</span>
          <div className="flex items-center space-x-2">
            <Logo width={150} height={40} />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Step 5/5</div>
            <div className="text-sm font-medium text-gray-700">Upload Your Document</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-teal-500">40%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Facial Recognition
          </h1>
          
          <p className="text-gray-600 mb-12 leading-relaxed">
            Please allow us to have access to the following for fast and wide facial detection.
          </p>

          {/* Permission Card */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-gray-700 font-medium">
                  Allow access to camera and photos
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isPermissionGranted}
                  readOnly
                  className="sr-only"
                />
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  isPermissionGranted 
                    ? 'bg-teal-500 border-teal-500' 
                    : 'border-gray-300 bg-white'
                }`}>
                  {isPermissionGranted && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Allow Button */}
          <button
            onClick={handleAllowAccess}
            disabled={isRequesting || isPermissionGranted}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isRequesting
                ? 'bg-teal-400 cursor-not-allowed'
                : isPermissionGranted
                ? 'bg-green-500'
                : 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
            }`}
          >
            {isRequesting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Requesting Access...</span>
              </div>
            ) : isPermissionGranted ? (
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Access Granted</span>
              </div>
            ) : (
              'Allow'
            )}
          </button>

          {isPermissionGranted && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                Camera access granted! Proceeding to facial recognition...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  ;
}

export default FacialRecognition;