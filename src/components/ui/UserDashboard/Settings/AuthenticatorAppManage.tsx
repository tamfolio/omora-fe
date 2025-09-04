import React, { useState } from 'react';
import { X, Shield, Mail, ChevronRight, Check, Copy } from 'lucide-react';

function AuthenticatorAppManage({ onClose, isActive = false }) {
  const [currentStep, setCurrentStep] = useState(isActive ? 'manage' : 'setup-intro'); // manage, setup-intro, verification, qr-setup, code-input, success, remove-confirm, remove-verify, remove-success
  const [verificationCode, setVerificationCode] = useState('');
  const [removeConfirmChecks, setRemoveConfirmChecks] = useState({
    withdrawals: false,
    twoFactor: false
  });
  const [completedSteps, setCompletedSteps] = useState({
    authenticator: false,
    email: false
  });

  const handleClose = () => {
    setCurrentStep(isActive ? 'manage' : 'setup-intro');
    setVerificationCode('');
    setRemoveConfirmChecks({ withdrawals: false, twoFactor: false });
    setCompletedSteps({ authenticator: false, email: false });
    if (onClose) onClose();
  };

  const handleAuthenticatorComplete = () => {
    setCompletedSteps(prev => ({ ...prev, authenticator: true }));
    // After completing setup, close the modal (user enabled authenticator)
    handleClose();
  };

  // Setup Introduction Screen (First screen for inactive users)
  const SetupIntroScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4">
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Enjoy Faster Login</h2>
          <p className="text-sm text-gray-600 mb-6">
            Instead of waiting for text messages, get verification codes from an authenticator app like Google Authenticator. It works even if your phone is offline.
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setCurrentStep('verification')}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium"
          >
            Enable Authenticator App
          </button>
          
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium">
            Download Authenticator App
          </button>
        </div>
      </div>
    </div>
  );

  // Manage Authenticator App Screen
  const ManageScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Manage Authenticator App</h2>
            <p className="text-sm text-gray-600">Protect your account and withdrawals with Passkeys and/or security keys, such as Yubikey.</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Authenticator app</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Use Google authenticator to get a verification code to enter every time you log into your Omora account.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentStep('remove-confirm')}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Security Verification Requirements Screen
  const VerificationScreen = () => {
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Security Verification Requirements</h2>
              <p className="text-sm text-gray-600">You need to complete all of the following verifications to continue.</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">{completedCount} / 2</h3>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                  completedSteps.authenticator ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => !completedSteps.authenticator && setCurrentStep('qr-setup')}
              >
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Authenticator app</span>
                </div>
                {completedSteps.authenticator ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>

              <div 
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                  completedSteps.email ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => !completedSteps.email && setCompletedSteps(prev => ({ ...prev, email: true }))}
              >
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Email</span>
                </div>
                {completedSteps.email ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <button className="text-sm text-teal-600 hover:text-teal-700">
              Security verification unavailable?
            </button>
          </div>
        </div>
      </div>
    );
  };

  // QR Setup Screen
  const QRSetupScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link an Authenticator</h2>
            <p className="text-sm text-gray-600">Scan this QR code in the authenticator app</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          {/* QR Code placeholder */}
          <div className="w-48 h-48 mx-auto mb-4 bg-white border border-gray-200 flex items-center justify-center">
            <div className="w-40 h-40 bg-black" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Cg fill='black'%3E%3Crect x='0' y='0' width='7' height='7'/%3E%3Crect x='14' y='0' width='7' height='7'/%3E%3Crect x='28' y='0' width='7' height='7'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: 'cover'
            }}>
              {/* Simplified QR pattern */}
              <div className="grid grid-cols-8 gap-1 w-full h-full p-2">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} w-full h-full`} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded">
              4K3DDKUJW74SH4CO
            </span>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Copy className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            If you are unable to scan the QR code, please enter this code manually into the app.
          </p>

          <button 
            onClick={() => setCurrentStep('code-input')}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  // Code Input Screen
  const CodeInputScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your Authenticator App</h2>
            <p className="text-sm text-gray-600">We sent a 6-digit code sent to your authenticator app</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input 6-digit key
          </label>
          <div className="relative">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
              maxLength="6"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 text-sm font-medium">
              Paste
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Didn't receive the 6-digit key?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Click to resend
            </button>
          </p>
        </div>

        <button 
          onClick={() => setCurrentStep('success')}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium"
        >
          Verify
        </button>
      </div>
    </div>
  );

  // Remove Confirmation Screen
  const RemoveConfirmScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4">
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Are You Sure You Want to Remove Authenticator App Verification?
          </h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={removeConfirmChecks.withdrawals}
              onChange={(e) => setRemoveConfirmChecks(prev => ({ ...prev, withdrawals: e.target.checked }))}
              className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded"
            />
            <p className="text-sm text-gray-600">
              Withdrawals and Investing will be disabled for 24 hours after removing your authenticator app verification to ensure the safety of your assets.
            </p>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={removeConfirmChecks.twoFactor}
              onChange={(e) => setRemoveConfirmChecks(prev => ({ ...prev, twoFactor: e.target.checked }))}
              className="mt-1 h-4 w-4 text-teal-600 border-gray-300 rounded"
            />
            <p className="text-sm text-gray-600">
              Two security verification methods are required for withdrawals and other actions. Using only one verification method will put your account at greater risk.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setCurrentStep('remove-verify')}
            disabled={!removeConfirmChecks.withdrawals || !removeConfirmChecks.twoFactor}
            className={`w-full py-3 rounded-lg font-medium ${
              removeConfirmChecks.withdrawals && removeConfirmChecks.twoFactor
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
          
          <button 
            onClick={handleClose}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Remove Verification Screen
  const RemoveVerifyScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4">
          <X className="h-6 w-6" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticator App Verification</h2>
          <p className="text-sm text-gray-600">
            Enter the 6-digit code generated by the authenticator app.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Authenticator app
          </label>
          <div className="relative">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg tracking-widest"
              maxLength="6"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 text-sm font-medium">
              Paste
            </button>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Didn't receive the 6-digit key?{' '}
            <button className="text-teal-600 hover:text-teal-700 font-medium">
              Click to resend
            </button>
          </p>
        </div>

        <button 
          onClick={() => setCurrentStep('remove-success')}
          className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium"
        >
          Submit
        </button>
      </div>
    </div>
  );

  // Remove Success Screen
  const RemoveSuccessScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">2FA successfully disabled</h2>
          <p className="text-sm text-gray-600 mb-6">
            You'll not be required to enter a code at login.
          </p>
          
          <button 
            onClick={handleClose}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            Go to home
          </button>
        </div>
      </div>
    </div>
  );

  // Success Screen (After completing setup)
  const SuccessScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authenticator App Enabled!</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your authenticator app has been successfully set up. You can now use it for faster and more secure login.
          </p>
          
          <button 
            onClick={handleAuthenticatorComplete}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'setup-intro':
        return <SetupIntroScreen />;
      case 'manage':
        return <ManageScreen />;
      case 'verification':
        return <VerificationScreen />;
      case 'qr-setup':
        return <QRSetupScreen />;
      case 'code-input':
        return <CodeInputScreen />;
      case 'success':
        return <SuccessScreen />;
      case 'remove-confirm':
        return <RemoveConfirmScreen />;
      case 'remove-verify':
        return <RemoveVerifyScreen />;
      case 'remove-success':
        return <RemoveSuccessScreen />;
      default:
        return <SetupIntroScreen />;
    }
  };

  return (
    <div>
      {renderCurrentStep()}
      
      {/* Demo controls - Updated with removal flow */}
      <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border space-x-2 z-40">
        <div className="text-xs text-gray-500 mb-2">Demo Controls</div>
        <div className="space-y-2">
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">Setup Flow:</div>
            <div className="space-x-2">
              <button onClick={() => setCurrentStep('setup-intro')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Intro</button>
              <button onClick={() => setCurrentStep('verification')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">0/2</button>
              <button onClick={() => setCurrentStep('qr-setup')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">QR</button>
              <button onClick={() => setCurrentStep('code-input')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Code</button>
              <button onClick={() => setCurrentStep('success')} className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Success</button>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-1">Remove Flow:</div>
            <div className="space-x-2">
              <button onClick={() => setCurrentStep('manage')} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Manage</button>
              <button onClick={() => setCurrentStep('remove-confirm')} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Confirm</button>
              <button onClick={() => setCurrentStep('remove-verify')} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Verify</button>
              <button onClick={() => setCurrentStep('remove-success')} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Disabled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatorAppManage;