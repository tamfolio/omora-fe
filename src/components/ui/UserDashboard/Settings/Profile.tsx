import React, { useState } from 'react';
import { User, Mail, Phone, Hash, MapPin, Upload } from 'lucide-react';
import Security from './Security';
import Notifications from './Notifications';
import Logout from './Logout';

function Profile() {
  const [isKYCCompleted, setIsKYCCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('My Profile');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const tabs = [
    { name: 'My Profile' },
    { name: 'Security' },
    { name: 'Notifications', badge: '2' },
    { name: 'Log out' }
  ];

  const handleTabClick = (tabName) => {
    if (tabName === 'Log out') {
      setShowLogoutModal(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('User logged out');
    setShowLogoutModal(false);
    // For example, you might redirect to login page or clear user session
    // window.location.href = '/login';
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const PreKYCProfile = () => (
    <div className="w-full px-24 py-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Personal Info</h2>
          <p className="text-sm text-gray-600 mt-1">Protect your account and withdrawals with Passkeys and/or security keys, such as Yubikey.</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-start">
                <div className="relative mb-4">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your photo •</p>
                  <p className="text-xs text-gray-500">This will be displayed on your profile.</p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center bg-teal-50">
                  <Upload className="h-12 w-12 text-teal-600 mx-auto mb-3" />
                  <p className="text-teal-700 font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-teal-600 mb-2">or drag and drop</p>
                  <p className="text-xs text-gray-500 mb-3">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                  <div className="flex items-center justify-center">
                    <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded mr-2">JPG</span>
                    <span className="text-xs text-gray-500">2MB</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 self-start">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">Olivia Rhye</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="font-medium text-gray-900">07023456789</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:col-span-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">olivia@untitledui.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PostKYCProfile = () => (
    <div className="w-full px-24 py-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Personal Info</h2>
          <p className="text-sm text-gray-600 mt-1">Protect your account and withdrawals with Passkeys and/or security keys, such as Yubikey.</p>
        </div>

        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-start">
                <div className="relative mb-4">
                  <img
                    src="/api/placeholder/80/80"
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your photo •</p>
                  <p className="text-xs text-gray-500">This will be displayed on your profile.</p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="border-2 border-dashed border-teal-300 rounded-lg p-8 text-center bg-teal-50">
                  <Upload className="h-12 w-12 text-teal-600 mx-auto mb-3" />
                  <p className="text-teal-700 font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-teal-600 mb-2">or drag and drop</p>
                  <p className="text-xs text-gray-500 mb-3">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                  <div className="flex items-center justify-center">
                    <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded mr-2">JPG</span>
                    <span className="text-xs text-gray-500">2MB</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 self-start">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">Olivia Rhye</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone number</p>
                <p className="font-medium text-gray-900">07023456789</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">olivia@untitledui.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">NIN</p>
                <p className="font-medium text-gray-900">21234216141</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Hash className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">BVN</p>
                <p className="font-medium text-gray-900">21234216141</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium text-gray-900">Nig</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-teal-600">
              "To change your account details, please contact your Relationship Manager through the Help option"
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-24">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="w-full px-24">
          <nav className="flex space-x-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabClick(tab.name)}
                className={`py-4 px-3 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.name && tab.name !== 'Log out'
                    ? 'bg-white border border-gray-300 shadow-sm rounded-xl'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={activeTab === tab.name && tab.name !== 'Log out' ? { boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)' } : {}}
              >
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Demo Toggle */}
      <div className="px-24 pt-4">
        <button
          onClick={() => setIsKYCCompleted(!isKYCCompleted)}
          className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
        >
          Toggle KYC: {isKYCCompleted ? 'Completed' : 'Pending'}
        </button>
      </div>

      {activeTab === 'My Profile' && (
        isKYCCompleted ? <PostKYCProfile /> : <PreKYCProfile />
      )}
      
      {activeTab === 'Security' && <Security />}
      
      {activeTab === 'Notifications' && <Notifications />}

      <Logout 
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogout}
      />
    </div>
  );
}

export default Profile;