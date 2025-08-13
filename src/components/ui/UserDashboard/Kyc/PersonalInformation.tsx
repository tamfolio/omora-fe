import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Info } from 'lucide-react';

interface PersonalInformationProps {
  onNext: () => void;
  onBack: () => void;
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  bvn: string;
  gender: string;
  occupation: string;
  sourceOfFunds: string;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
];

const occupationOptions = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
  { value: 'other', label: 'Other' }
];

const sourceOfFundsOptions = [
  { value: 'salary', label: 'Salary/Employment Income' },
  { value: 'business', label: 'Business Income' },
  { value: 'investment', label: 'Investment Returns' },
  { value: 'inheritance', label: 'Inheritance' },
  { value: 'gift', label: 'Gift' },
  { value: 'savings', label: 'Personal Savings' },
  { value: 'other', label: 'Other' }
];

function PersonalInformation({ onNext, onBack }: PersonalInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    bvn: '',
    gender: '',
    occupation: '',
    sourceOfFunds: ''
  });

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    occupation: false,
    sourceOfFunds: false
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

  const selectOption = (field: keyof FormData, value: string, label: string) => {
    handleInputChange(field, value);
    setDropdownStates(prev => ({
      ...prev,
      [field]: false
    }));
  };

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
           formData.middleName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.dateOfBirth.trim() !== '' &&
           formData.bvn.trim() !== '' &&
           formData.gender !== '' &&
           formData.occupation !== '' &&
           formData.sourceOfFunds !== '';
  };

  const handleNext = () => {
    if (isFormValid()) {
      console.log('Form data:', formData);
      onNext();
    }
  };

  const formatDate = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as dd/mm/yyyy
    if (digits.length >= 8) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    } else if (digits.length >= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const formatBVN = (value: string) => {
    // Remove any non-digit characters and limit to 11 digits
    return value.replace(/\D/g, '').slice(0, 11);
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
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-800">MORA</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Step 2/5</div>
            <div className="text-sm font-medium text-gray-700">Personal Information</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-teal-500">40%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Personal Information
        </h1>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Must match ID and BVN</p>
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your middle name"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Must match ID and BVN</p>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Must match ID and BVN</p>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', formatDate(e.target.value))}
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Must be above 18 years</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('gender')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            >
              <span className={formData.gender ? 'text-gray-900' : 'text-gray-500'}>
                {formData.gender ? getSelectedLabel('gender', genderOptions) : 'Select gender'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.gender ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.gender && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('gender', option.value, option.label)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Occupation */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupation <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('occupation')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            >
              <span className={formData.occupation ? 'text-gray-900' : 'text-gray-500'}>
                {formData.occupation ? getSelectedLabel('occupation', occupationOptions) : 'Enter your occupation'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.occupation ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.occupation && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {occupationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('occupation', option.value, option.label)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Source of Funds */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source of Funds <span className="text-red-500">*</span>
              <Info className="inline w-4 h-4 text-gray-400 ml-1" />
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('sourceOfFunds')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            >
              <span className={formData.sourceOfFunds ? 'text-gray-900' : 'text-gray-500'}>
                {formData.sourceOfFunds ? getSelectedLabel('sourceOfFunds', sourceOfFundsOptions) : 'Select source'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.sourceOfFunds ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.sourceOfFunds && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {sourceOfFundsOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('sourceOfFunds', option.value, option.label)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isFormValid()
                ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinecoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Overlay for dropdowns */}
      {(dropdownStates.gender || dropdownStates.occupation || dropdownStates.sourceOfFunds) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownStates({ gender: false, occupation: false, sourceOfFunds: false })}
        />
      )}
    </div>
  );
}

export default PersonalInformation;