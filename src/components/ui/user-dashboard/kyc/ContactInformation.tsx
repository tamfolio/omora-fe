import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface ContactInformationProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

interface ContactFormData {
  mobileNumber: string;
  address: string;
  city: string;
  state: string;
}

function ContactInformation({ onNext, onBack }: ContactInformationProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    mobileNumber: '',
    address: '',
    city: '',
    state: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPhoneNumber = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('+234')) {
      return cleaned.slice(0, 14);
    }
    
    cleaned = cleaned.replace(/\+/g, '');
    
    if (cleaned.startsWith('234')) {
      cleaned = cleaned.slice(0, 13);
      return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
      cleaned = '234' + cleaned.slice(1, 11);
      return '+' + cleaned;
    } else if (cleaned.length > 0) {
      cleaned = '234' + cleaned.slice(0, 10);
      return '+' + cleaned;
    }
    
    return cleaned;
  };

  const isFormValid = () => {
    return formData.mobileNumber.trim() !== '' &&
           formData.mobileNumber.length >= 14 &&
           formData.address.trim() !== '' &&
           formData.city.trim() !== '' &&
           formData.state.trim() !== '';
  };

  const handleNext = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const apiData = {
        mobileNumber: formData.mobileNumber,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim()
      };

      // Direct fetch through the proxy to avoid any hidden issues in kycApiService
      const response = await fetch('/api/user/api/v1/onboarding/personal/contact/information', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Specifically catch 404s to verify pathing
        if (response.status === 404) {
          throw new Error('Contact endpoint not found. Please verify the URL: /user/api/v1/onboarding/personal/contact/information');
        }
        throw new Error(errorData.message || 'Failed to submit contact information.');
      }

      onNext(apiData);
    } catch (err: any) {
      console.error('❌ Contact Save Error:', err);
      setError(err.message || 'Failed to submit contact information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="bg-white px-4 py-4 flex items-center justify-between shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600 font-medium">Back</span>
          <Logo width={150} height={40} />
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Step 3/5</div>
            <div className="text-sm font-medium text-gray-700">Contact Details</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-teal-500">60%</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-12">
          Contact Details
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="+2348012345678"
              value={formData.mobileNumber}
              onChange={(e) => handleInputChange('mobileNumber', formatPhoneNumber(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Format: +234XXXXXXXXXX</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your street address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="pt-8">
            <button
              type="button"
              onClick={handleNext}
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isFormValid() && !isSubmitting
                  ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInformation;