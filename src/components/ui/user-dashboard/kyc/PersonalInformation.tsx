import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from '../../Logo';
import { useUserData } from '@/contexts/UserDataContext';
import { verifyNIN, verifyBVN } from '@/lib/kyc-api-service';
import { FiHeadphones } from 'react-icons/fi';

interface PersonalInformationProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

const genderOptions = [
  { value: '', label: 'Select gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const occupationOptions = [
  { value: '', label: 'Enter your occupation' },
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
];

const sourceOfFundsOptions = [
  { value: '', label: 'Select source' },
  { value: 'salary', label: 'Salary/Employment Income' },
  { value: 'business', label: 'Business Income' },
  { value: 'investment', label: 'Investment Returns' },
  { value: 'savings', label: 'Personal Savings' },
];

export default function PersonalInformation({ onNext, onBack }: PersonalInformationProps) {
  const { userData, refreshUserData } = useUserData();

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    bvn: '',
    nin: '',
    gender: '',
    occupation: '',
    sourceOfFunds: ''
  });

  const [bvnStatus, setBvnStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [ninStatus, setNinStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [bvnError, setBvnError] = useState<string | null>(null);
  const [ninError, setNinError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from context
  useEffect(() => {
    if (!userData) return;

    const { user, verification } = userData;

    setFormData(prev => ({
      ...prev,
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      lastName: user?.lastName || '',
      dateOfBirth: user?.dateOfBirth || '',
      gender: user?.gender || '',
    }));

    if (Array.isArray(verification)) {
      const bvnRecord = verification.find((v: any) => v.type === 'BVN' && v.status === 'C');
      const ninRecord = verification.find((v: any) => v.type === 'NIN' && v.status === 'C');

      if (bvnRecord) {
        setFormData(prev => ({ ...prev, bvn: bvnRecord.value }));
      }

      if (ninRecord) {
        setFormData(prev => ({ ...prev, nin: ninRecord.value }));
      }
    }
  }, [userData]);

  // Auto-verify BVN when 11 digits entered
  useEffect(() => {
    if (formData.bvn.length === 11 && bvnStatus === 'idle') {
      handleVerifyBVN();
    }
  }, [formData.bvn]);

  // Auto-verify NIN when 11 digits entered
  useEffect(() => {
    if (formData.nin.length === 11 && ninStatus === 'idle') {
      handleVerifyNIN();
    }
  }, [formData.nin]);

  const handleVerifyBVN = async () => {
    setBvnStatus('verifying');
    setBvnError(null);
    setError(null);

    try {
      const response = await verifyBVN(formData.bvn);

      if (response.status === 'VERIFIED') {
        setBvnStatus('success');

        // Auto-populate from BVN
        if (response.gender) {
          setFormData(prev => ({ ...prev, gender: response.gender!.toUpperCase() }));
        }

        if (response.birthdate) {
          const dob = convertBirthdate(response.birthdate);
          if (dob) {
            setFormData(prev => ({ ...prev, dateOfBirth: dob }));
          }
        }

        await refreshUserData();
      } else {
        // Check database as fallback
        const bvnFromDb = userData?.verification?.find((v: any) => v.type === 'BVN' && v.status === 'C');
        
        if (bvnFromDb) {
          setBvnStatus('success');
          if (userData?.user?.dateOfBirth) {
            setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
          }
          if (userData?.user?.gender) {
            setFormData(prev => ({ ...prev, gender: userData.user.gender }));
          }
        } else {
          // ✅ Show error with message
          setBvnStatus('error');
          setBvnError(response.message || 'BVN verification failed');
        }
      }
    } catch (err: any) {
      // Check database as fallback
      const bvnFromDb = userData?.verification?.find((v: any) => v.type === 'BVN' && v.status === 'C');
      
      if (bvnFromDb) {
        setBvnStatus('success');
        if (userData?.user?.dateOfBirth) {
          setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
        }
        if (userData?.user?.gender) {
          setFormData(prev => ({ ...prev, gender: userData.user.gender }));
        }
      } else {
        // ✅ Show error with message
        setBvnStatus('error');
        setBvnError(err.message || 'BVN verification failed');
      }
    }
  };

  const handleVerifyNIN = async () => {
    setNinStatus('verifying');
    setNinError(null);
    setError(null);

    try {
      const response = await verifyNIN(formData.nin);

      if (response.status === 'VERIFIED') {
        setNinStatus('success');

        if (!formData.gender && response.gender) {
          setFormData(prev => ({ ...prev, gender: response.gender!.toUpperCase() }));
        }

        if (!formData.dateOfBirth && response.birthdate) {
          const dob = convertBirthdate(response.birthdate);
          if (dob) {
            setFormData(prev => ({ ...prev, dateOfBirth: dob }));
          }
        }

        await refreshUserData();
      } else {
        // Check database as fallback
        const ninFromDb = userData?.verification?.find((v: any) => v.type === 'NIN' && v.status === 'C');
        
        if (ninFromDb) {
          setNinStatus('success');
          if (!formData.dateOfBirth && userData?.user?.dateOfBirth) {
            setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
          }
          if (!formData.gender && userData?.user?.gender) {
            setFormData(prev => ({ ...prev, gender: userData.user.gender }));
          }
        } else {
          // ✅ Show error with message
          setNinStatus('error');
          setNinError(response.message || 'NIN verification failed');
        }
      }
    } catch (err: any) {
      // Check database as fallback
      const ninFromDb = userData?.verification?.find((v: any) => v.type === 'NIN' && v.status === 'C');
      
      if (ninFromDb) {
        setNinStatus('success');
        if (!formData.dateOfBirth && userData?.user?.dateOfBirth) {
          setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
        }
        if (!formData.gender && userData?.user?.gender) {
          setFormData(prev => ({ ...prev, gender: userData.user.gender }));
        }
      } else {
        // ✅ Show error with message
        setNinStatus('error');
        setNinError(err.message || 'NIN verification failed');
      }
    }
  };

  const convertBirthdate = (birthdate: string): string | null => {
    try {
      const parts = birthdate.split('-');
      if (parts.length !== 3) return null;

      const day = parts[0].replace('x', '01');
      const month = parts[1].replace('x', '01');
      const year = parts[2].replace(/x/g, '0');

      let fullYear = year;
      if (year.includes('0')) {
        fullYear = year.replace(/0/g, '9');
      }

      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return null;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    
    // ✅ Reset status when user edits after error - allows retry
    if (field === 'bvn' && bvnStatus === 'error') {
      setBvnStatus('idle');
      setBvnError(null);
    }
    if (field === 'nin' && ninStatus === 'error') {
      setNinStatus('idle');
      setNinError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }

    if (!formData.bvn || formData.bvn.length !== 11) {
      setError('Valid BVN is required');
      return;
    }

    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return;
    }

    if (!formData.gender) {
      setError('Gender is required');
      return;
    }

    if (!formData.occupation) {
      setError('Occupation is required');
      return;
    }

    if (!formData.sourceOfFunds) {
      setError('Source of funds is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/proxy/user/api/v1/onboarding/personal-information', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          bvn: formData.bvn,
          nin: formData.nin,
          occupation: formData.occupation,
          sourceOfFund: formData.sourceOfFunds,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save personal information');
      }

      await refreshUserData();
      onNext(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <Logo />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500">Step 3/5</div>
              <div className="text-xs font-medium text-gray-700">Personal Information</div>
            </div>
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#14b8a6" strokeWidth="4"
                   strokeDasharray="125.6" strokeDashoffset={125.6 * (1 - 0.6)} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">60%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-md mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Personal Information</h2>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Jane"
              disabled
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Middle Name</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Racheal"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Oblote"
              disabled
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="dd/mm/yy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
            />
            <p className="text-xs text-gray-500 mt-1">Must be above 18 years</p>
          </div>

          {/* BVN */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              BVN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  bvnStatus === 'error' ? 'border-red-500' : 'border-gray-300'
                } ${bvnStatus === 'success' ? 'text-gray-900' : 'text-gray-400'}`}
                placeholder="11 digit number"
                maxLength={11}
              />
              {/* Status Icons */}
              {bvnStatus === 'verifying' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {bvnStatus === 'success' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {bvnStatus === 'error' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            {/* Error Message */}
            {bvnError && (
              <p className="text-xs text-red-500 mt-1">{bvnError}</p>
            )}
          </div>

          {/* NIN */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              NIN
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.nin}
                onChange={(e) => handleInputChange('nin', e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={`w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                  ninStatus === 'error' ? 'border-red-500' : 'border-gray-300'
                } ${ninStatus === 'success' ? 'text-gray-900' : 'text-gray-400'}`}
                placeholder="11 digit number"
                maxLength={11}
              />
              {/* Status Icons */}
              {ninStatus === 'verifying' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {ninStatus === 'success' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {ninStatus === 'error' && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            {/* Error Message */}
            {ninError && (
              <p className="text-xs text-red-500 mt-1">{ninError}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Occupation <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.occupation}
              onChange={(e) => handleInputChange('occupation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {occupationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source of Funds */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">
              Source of Funds <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.sourceOfFunds}
              onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {sourceOfFundsOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </form>

        {/* Help Button */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg text-white">
          <FiHeadphones className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}