import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Mail, Info } from 'lucide-react';
import Logo from '../../Logo';

interface DirectorInformationProps {
  onNext: () => void;
  onBack: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  bvn: string;
}

const roleOptions = [
  { value: 'ceo', label: 'Chief Executive Officer (CEO)' },
  { value: 'managing-director', label: 'Managing Director' },
  { value: 'chairman', label: 'Chairman' },
  { value: 'director', label: 'Director' },
  { value: 'secretary', label: 'Company Secretary' },
  { value: 'contact-person', label: 'Authorized Contact Person' },
  { value: 'other', label: 'Other' }
];

function DirectorInformation({ onNext, onBack }: DirectorInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    role: '',
    bvn: ''
  });

  const [dropdownStates, setDropdownStates] = useState({
    role: false
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const selectOption = (field: keyof FormData, value: string) => {
    handleInputChange(field, value);
    setDropdownStates(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const formatPhoneNumber = (value: string) => {
    // Remove any non-digit characters
    return value.replace(/\D/g, '');
  };

  const formatBVN = (value: string) => {
    // Remove any non-digit characters and limit to 11 digits
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return formData.fullName.trim() !== '' &&
           formData.email.trim() !== '' &&
           isValidEmail(formData.email) &&
           formData.phoneNumber.trim() !== '' &&
           formData.address.trim() !== '' &&
           formData.role !== '' &&
           formData.bvn.trim() !== '' &&
           formData.bvn.length === 11;
  };

  const handleNext = () => {
    if (isFormValid()) {
      console.log('Director Information:', formData);
      onNext();
    }
  };

  const getSelectedLabel = (field: keyof FormData, options: any[]) => {
    const selected = options.find(option => option.value === formData[field]);
    return selected ? selected.label : '';
  };

  return (
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
            <div className="text-sm text-gray-500">Step 3/4</div>
            <div className="text-sm font-medium text-gray-700">Contact Details</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-cyan-600">40%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Director/Contact Person Information
        </h1>

        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Surname First</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="olivia@untitledui.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', formatPhoneNumber(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              placeholder="Enter your street name"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
              <Info className="inline w-4 h-4 text-gray-400 ml-1" />
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('role')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            >
              <span className={formData.role ? 'text-gray-900' : 'text-gray-500'}>
                {formData.role ? getSelectedLabel('role', roleOptions) : 'Select Role'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.role ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.role && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('role', option.value)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">This is a hint text to help user.</p>
          </div>

          {/* BVN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BVN
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit number"
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', formatBVN(e.target.value))}
                maxLength={11}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">This is a hint text to help user.</p>
          </div>

          {/* Next Button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid()}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid()
                  ? 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Overlay for dropdowns */}
      {dropdownStates.role && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownStates({ role: false })}
        />
      )}
    </div>
  );
}

export default DirectorInformation;