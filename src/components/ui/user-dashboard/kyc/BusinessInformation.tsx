import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Info } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface BusinessInformationProps {
  onNext: () => void;
  onBack: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}
interface FormData {
  businessName: string;
  rcType: string;
  rcNumber: string;
  businessType: string;
  businessAddress: string;
  taxIdentificationNumber: string;
  businessDescription: string;
  website: string;
}

const rcTypeOptions = [
  { value: 'rc', label: 'RC (Certificate of Incorporation)' },
  { value: 'bn', label: 'BN (Business Name)' },
];

const businessTypeOptions = [
  { value: 'limited-liability', label: 'Limited Liability Company' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole-proprietorship', label: 'Sole Proprietorship' },
  { value: 'public-company', label: 'Public Company' },
  { value: 'non-profit', label: 'Non-Profit Organization' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'other', label: 'Other' }
];

function BusinessInformation({ onNext, onBack }: BusinessInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    rcType: '',
    rcNumber: '',
    businessType: '',
    businessAddress: '',
    taxIdentificationNumber: '',
    businessDescription: '',
    website: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dropdownStates, setDropdownStates] = useState({
    rcType: false,
    businessType: false
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

  const formatRCNumber = (value: string) => {
    // Remove any non-digit characters and limit to reasonable length
    return value.replace(/\D/g, '').slice(0, 10);
  };

  const formatTIN = (value: string) => {
    // Remove any non-digit characters and limit to 11 digits
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const isFormValid = () => {
    return formData.businessName.trim() !== '' &&
           formData.rcType !== '' &&
           formData.rcNumber.trim() !== '' &&
           formData.businessType !== '' &&
           formData.businessAddress.trim() !== '' &&
           formData.taxIdentificationNumber.trim() !== '' &&
           formData.businessDescription.trim() !== '';
    // Website is optional, so not included in validation
  };

  const handleNext = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        businessName: formData.businessName.trim(),
        rcType: formData.rcType,
        rcNumber: formData.rcNumber,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress.trim(),
        taxIdentificationNumber: formData.taxIdentificationNumber,
        businessDescription: formData.businessDescription.trim(),
        website: formData.website.trim() || undefined
      };

      console.log('Submitting business information:', apiData);
      const response = await kycApiService.submitBusinessInformation(apiData);
      
      console.log('Business information submitted successfully:', response);
      onNext();
    } catch (err: any) {
      console.error('Error submitting business information:', err);
      setError(err.message || 'Failed to submit business information. Please try again.');
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
            <div className="text-sm text-gray-500">Step 2/4</div>
            <div className="text-sm font-medium text-gray-700">Business Information</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-cyan-600">40%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
          Business Information
        </h1>

        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your business name"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Business name must match CAC document</p>
          </div>

          {/* RC Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RC TYPE <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('rcType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            >
              <span className={formData.rcType ? 'text-gray-900' : 'text-gray-500'}>
                {formData.rcType ? getSelectedLabel('rcType', rcTypeOptions) : 'Select'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.rcType ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.rcType && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {rcTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('rcType', option.value)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RC Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RC Number
            </label>
            <div className="relative">
              <div className="flex">
                <div className="flex items-center px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  <span className="text-gray-600 text-sm font-medium">
                    {formData.rcType === 'bn' ? 'BN' : 'RC'}
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="234566"
                  value={formData.rcNumber}
                  onChange={(e) => handleInputChange('rcNumber', formatRCNumber(e.target.value))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">This is a hint text to help user.</p>
          </div>

          {/* Business Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('businessType')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
            >
              <span className={formData.businessType ? 'text-gray-900' : 'text-gray-500'}>
                {formData.businessType ? getSelectedLabel('businessType', businessTypeOptions) : 'Select'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.businessType ? 'rotate-180' : ''}`} />
            </button>
            {dropdownStates.businessType && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {businessTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption('businessType', option.value)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Business Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter your business address"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Tax Identification Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Identification Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit number"
                value={formData.taxIdentificationNumber}
                onChange={(e) => handleInputChange('taxIdentificationNumber', formatTIN(e.target.value))}
                maxLength={11}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="group relative">
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                    This is a unique number used to identify you for tax purposes.
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your Tax Identification Number (TIN) for compliance and verification purposes.</p>
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your business"
              value={formData.businessDescription}
              onChange={(e) => handleInputChange('businessDescription', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <div className="flex">
                <div className="flex items-center px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                  <span className="text-gray-600 text-sm">http://</span>
                </div>
                <input
                  type="text"
                  placeholder="www.loremipsum.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">This is a hint text to help user.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Next Button */}
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

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Overlay for dropdowns */}
      {(dropdownStates.rcType || dropdownStates.businessType) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownStates({ rcType: false, businessType: false })}
        />
      )}
    </div>
  );
}

export default BusinessInformation;