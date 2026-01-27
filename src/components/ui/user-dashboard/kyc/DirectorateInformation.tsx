import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Info } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface DirectorInformationProps {
  onNext: () => void;
  onBack: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
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
    firstName: '',
    lastName: '',
    mobileNumber: '',
    address: '',
    city: '',
    state: '',
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
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');
    
    // Handle different input formats
    if (digits.startsWith('234')) {
      digits = digits.slice(0, 13); // 234 + 10 digits
    } else if (digits.startsWith('0')) {
      digits = '234' + digits.slice(1, 11);
    } else if (digits.length > 0) {
      digits = '234' + digits.slice(0, 10);
    }
    
    return digits ? `+${digits}` : '';
  };

  const formatBVN = (value: string) => {
    // Remove any non-digit characters and limit to 11 digits
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.mobileNumber.trim() !== '' &&
           formData.mobileNumber.length >= 14 && // +234 + 10 digits
           formData.address.trim() !== '' &&
           formData.city.trim() !== '' &&
           formData.state.trim() !== '' &&
           formData.role !== '' &&
           formData.bvn.trim() !== '' &&
           formData.bvn.length === 11;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        mobileNumber: formData.mobileNumber,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        role: formData.role,
        bvn: formData.bvn
      };

      console.log('Submitting director information:', apiData);
      const response = await kycApiService.submitDirectorInformation(apiData);
      
      console.log('Director information submitted successfully:', response);
      onNext();
    } catch (err: any) {
      console.error('Error submitting director information:', err);
      setError(err.message || 'Failed to submit director information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedLabel = (field: keyof FormData, options: SelectOption[]) => {
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
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+2348012345678"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', formatPhoneNumber(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +234XXXXXXXXXX</p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter street address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
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
              BVN <span className="text-red-500">*</span>
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
            <p className="text-xs text-gray-500 mt-1">Enter 11-digit Bank Verification Number</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-8">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid() && !isSubmitting
                  ? 'bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
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