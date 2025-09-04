import React, { useState } from 'react';
import { Shield, Key, Mail, Phone, Monitor, MoreVertical } from 'lucide-react';
import AuthenticatorAppManage from './AuthenticatorAppManage';
import UpdatePassword from './UpdatePassword';

// Fix 1: Replace empty interface with proper type
interface SecurityProps {
  className?: string;
}

const Security: React.FC<SecurityProps> = () => {
  const [showAuthenticatorManage, setShowAuthenticatorManage] = useState<boolean>(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState<boolean>(false);
  const [hasActiveAuthenticator, setHasActiveAuthenticator] = useState<boolean>(true); // Toggle for demo
  
  return (
    <div className="w-full px-24 py-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Security Details</h2>
          <p className="text-sm text-gray-600 mt-1">Protect your account and withdrawals with Passkeys and/or security keys, such as Yubikey.</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Authenticator App */}
          <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="p-2">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">Authenticator App</h3>
                <p className="text-sm text-gray-600">Use Google Authenticator to protect your account and transactions.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                hasActiveAuthenticator 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {hasActiveAuthenticator ? 'Active' : 'Inactive'}
              </span>
              <button 
                onClick={() => setShowAuthenticatorManage(true)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                type="button"
              >
                {hasActiveAuthenticator ? 'Manage' : 'Setup'}
              </button>
            </div>
          </div>

          {/* Update Password */}
          <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="p-2">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">Update Password</h3>
                <p className="text-sm text-gray-600">Login password is used to log in to your account.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowUpdatePassword(true)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                type="button"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="p-2">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">Email</h3>
                <p className="text-sm text-gray-600">Use your email to protect your account and transactions.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">ja****00@gmail.com</span>
              <button 
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                type="button"
              >
                Manage
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-start space-x-4">
              <div className="p-2">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-1">Phone Number</h3>
                <p className="text-sm text-gray-600">Use your phone number to protect your account and transactions.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">813****364</span>
              <button 
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                type="button"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Where you're logged in */}
      <div className="bg-white rounded-lg shadow-sm mt-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Where you&apos;re logged in</h2>
              <p className="text-sm text-gray-600 mt-1">
                We&apos;ll alert you via <span className="font-medium">olivia@untitledui.com</span> if there is any unusual activity on your account.
              </p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" type="button">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Active Session */}
          <div className="flex items-start space-x-4 py-3">
            <div className="p-2">
              <Monitor className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-base font-medium text-gray-900">2024 MacBook Pro 14-inch</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ● Active now
                </span>
              </div>
              <p className="text-sm text-gray-600">Melbourne, Australia • 22 Jan at 10:40am</p>
            </div>
          </div>

          {/* Previous Session */}
          <div className="flex items-start space-x-4 py-3">
            <div className="p-2">
              <Monitor className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-1">2024 MacBook Pro 14-inch</h3>
              <p className="text-sm text-gray-600">Melbourne, Australia • 22 Jan at 4:20pm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Authenticator App Management Modal */}
      {showAuthenticatorManage && (
        <AuthenticatorAppManage 
          onClose={() => setShowAuthenticatorManage(false)} 
          isActive={hasActiveAuthenticator}
        />
      )}

      {/* Update Password Modal */}
      {showUpdatePassword && (
        <UpdatePassword 
          onClose={() => setShowUpdatePassword(false)}
        />
      )}

      {/* Enhanced Demo Toggle Controls */}
      <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-40 min-w-[280px]">
        <div className="text-sm font-semibold text-gray-700 mb-3">🔧 Demo Controls</div>
        
        <div className="space-y-3">
          {/* Main Toggle */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Authenticator Status:</label>
            <button
              onClick={() => setHasActiveAuthenticator(!hasActiveAuthenticator)}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                hasActiveAuthenticator 
                  ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                  : 'bg-red-500 text-white shadow-md hover:bg-red-600'
              }`}
              type="button"
            >
              {hasActiveAuthenticator ? '✓ ACTIVE' : '✗ INACTIVE'}
            </button>
          </div>

          {/* Flow Information */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-gray-700 mb-1">
              Current Flow: {hasActiveAuthenticator ? 'MANAGE' : 'SETUP'}
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              {hasActiveAuthenticator ? (
                <>
                  <strong>Manage Flow:</strong><br/>
                  • Shows &ldquo;Manage&rdquo; button<br/>
                  • Opens management screen<br/>
                  • Allows removal of 2FA
                </>
              ) : (
                <>
                  <strong>Setup Flow:</strong><br/>
                  • Shows &ldquo;Setup&rdquo; button<br/>
                  • Opens intro → verification → QR<br/>
                  • Enables 2FA authentication
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setHasActiveAuthenticator(false);
                setShowAuthenticatorManage(true);
              }}
              className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200 transition-colors"
              type="button"
            >
              Test Setup
            </button>
            <button
              onClick={() => {
                setHasActiveAuthenticator(true);
                setShowAuthenticatorManage(true);
              }}
              className="flex-1 px-3 py-2 bg-purple-100 text-purple-700 text-xs rounded hover:bg-purple-200 transition-colors"
              type="button"
            >
              Test Manage
            </button>
          </div>

          {/* Password Update Test */}
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={() => setShowUpdatePassword(true)}
              className="w-full px-3 py-2 bg-teal-100 text-teal-700 text-xs rounded hover:bg-teal-200 transition-colors"
              type="button"
            >
              Test Password Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;