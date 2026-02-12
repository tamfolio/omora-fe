import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Logo from '../../Logo';
import { useUserData } from '@/contexts/UserDataContext';
import { verifyNIN, verifyBVN } from '@/lib/kyc-api-service';

interface PersonalInformationProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const occupationOptions = [
  { value: 'student', label: 'Student' },
  { value: 'employed', label: 'Employed' },
  { value: 'self-employed', label: 'Self Employed' },
  { value: 'business-owner', label: 'Business Owner' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'retired', label: 'Retired' },
];

const sourceOfFundsOptions = [
  { value: 'salary', label: 'Salary/Employment Income' },
  { value: 'business', label: 'Business Income' },
  { value: 'investment', label: 'Investment Returns' },
  { value: 'savings', label: 'Personal Savings' },
];

export default function PersonalInformation({ onNext, onBack }: PersonalInformationProps) {
  // ✅ Get data from context
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorporate, setIsCorporate] = useState(false);

  // ✅ Initialize from context on mount
  useEffect(() => {
    if (!userData) return;

    const { user, business, verification } = userData;

    // 1. Check if corporate
    if (business?.businessId) {
      setIsCorporate(true);
    }

    // 2. Pull name from context
    setFormData(prev => ({
      ...prev,
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      lastName: user?.lastName || '',
    }));

    // 3. Pull DOB and gender from database (will be overwritten by BVN if verified)
    if (user?.dateOfBirth) {
      setFormData(prev => ({
        ...prev,
        dateOfBirth: user.dateOfBirth,
      }));
    }

    if (user?.gender) {
      setFormData(prev => ({
        ...prev,
        gender: user.gender,
      }));
    }

    // 4. Check for already verified BVN/NIN in verification array
    if (Array.isArray(verification)) {
      const bvnRecord = verification.find((v: any) => v.type === 'BVN' && v.status === 'C');
      const ninRecord = verification.find((v: any) => v.type === 'NIN' && v.status === 'C');

      if (bvnRecord) {
        setFormData(prev => ({ ...prev, bvn: bvnRecord.value }));
        setBvnStatus('success');
      }

      if (ninRecord) {
        setFormData(prev => ({ ...prev, nin: ninRecord.value }));
        setNinStatus('success');
      }
    }
  }, [userData]);

  // ✅ BVN Verification (happens FIRST)
  const handleVerifyBVN = async () => {
    if (!formData.bvn || formData.bvn.length !== 11) {
      setError('BVN must be exactly 11 digits');
      return;
    }

    setBvnStatus('verifying');
    setError(null);

    try {
      const response = await verifyBVN(formData.bvn); // ✅ Only pass BVN number

      // ✅ Check for success based on backend response
      if (response.status === 'VERIFIED') {
        setBvnStatus('success');

        // ✅ BVN response takes PRIORITY - always overwrite gender and DOB
        if (response.gender) {
          setFormData(prev => ({
            ...prev,
            gender: response.gender!.toUpperCase(), // "Male" -> "MALE"
          }));
        }

        if (response.birthdate) {
          // Convert "09-xx-19xx" format to YYYY-MM-DD
          const dob = convertBirthdate(response.birthdate);
          if (dob) {
            setFormData(prev => ({
              ...prev,
              dateOfBirth: dob,
            }));
          }
        }

        // Refresh context to get updated verification
        await refreshUserData();
      } else {
        // ✅ Verification failed - check if data exists in /me
        const bvnFromDb = userData?.verification?.find((v: any) => v.type === 'BVN' && v.status === 'C');
        
        if (bvnFromDb) {
          // Found verified BVN in database - auto-populate
          setBvnStatus('success');
          setFormData(prev => ({ ...prev, bvn: bvnFromDb.value }));
          
          // Use database DOB and gender if available
          if (userData?.user?.dateOfBirth) {
            setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
          }
          if (userData?.user?.gender) {
            setFormData(prev => ({ ...prev, gender: userData.user.gender }));
          }
          
          setError(null); // Clear error since we found it in DB
        } else {
          setBvnStatus('error');
          setError(response.message || 'BVN verification failed');
        }
      }
    } catch (err: any) {
      // ✅ Error occurred - check if data exists in /me
      const bvnFromDb = userData?.verification?.find((v: any) => v.type === 'BVN' && v.status === 'C');
      
      if (bvnFromDb) {
        setBvnStatus('success');
        setFormData(prev => ({ ...prev, bvn: bvnFromDb.value }));
        
        // Use database DOB and gender if available
        if (userData?.user?.dateOfBirth) {
          setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
        }
        if (userData?.user?.gender) {
          setFormData(prev => ({ ...prev, gender: userData.user.gender }));
        }
        
        setError(null);
      } else {
        setBvnStatus('error');
        setError(err.message || 'BVN verification failed');
      }
    }
  };

  // ✅ NIN Verification (happens AFTER BVN)
  const handleVerifyNIN = async () => {
    if (!formData.nin || formData.nin.length !== 11) {
      setError('NIN must be exactly 11 digits');
      return;
    }

    setNinStatus('verifying');
    setError(null);

    try {
      const response = await verifyNIN(formData.nin); // ✅ Only pass NIN number

      // ✅ Check for success based on backend response
      if (response.status === 'VERIFIED') {
        setNinStatus('success');

        // ✅ Auto-populate gender and DOB from NIN response (if not already set)
        if (!formData.gender && response.gender) {
          setFormData(prev => ({
            ...prev,
            gender: response.gender!.toUpperCase(),
          }));
        }

        if (!formData.dateOfBirth && response.birthdate) {
          const dob = convertBirthdate(response.birthdate);
          if (dob) {
            setFormData(prev => ({
              ...prev,
              dateOfBirth: dob,
            }));
          }
        }

        // Refresh context
        await refreshUserData();
      } else {
        // ✅ Verification failed - check if data exists in /me
        const ninFromDb = userData?.verification?.find((v: any) => v.type === 'NIN' && v.status === 'C');
        
        if (ninFromDb) {
          // Found verified NIN in database - auto-populate
          setNinStatus('success');
          setFormData(prev => ({ ...prev, nin: ninFromDb.value }));
          
          // Use database DOB and gender if not already set
          if (!formData.dateOfBirth && userData?.user?.dateOfBirth) {
            setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
          }
          if (!formData.gender && userData?.user?.gender) {
            setFormData(prev => ({ ...prev, gender: userData.user.gender }));
          }
          
          setError(null); // Clear error since we found it in DB
        } else {
          setNinStatus('error');
          setError(response.message || 'NIN verification failed');
        }
      }
    } catch (err: any) {
      // ✅ Error occurred - check if data exists in /me
      const ninFromDb = userData?.verification?.find((v: any) => v.type === 'NIN' && v.status === 'C');
      
      if (ninFromDb) {
        setNinStatus('success');
        setFormData(prev => ({ ...prev, nin: ninFromDb.value }));
        
        // Use database DOB and gender if not already set
        if (!formData.dateOfBirth && userData?.user?.dateOfBirth) {
          setFormData(prev => ({ ...prev, dateOfBirth: userData.user.dateOfBirth }));
        }
        if (!formData.gender && userData?.user?.gender) {
          setFormData(prev => ({ ...prev, gender: userData.user.gender }));
        }
        
        setError(null);
      } else {
        setNinStatus('error');
        setError(err.message || 'NIN verification failed');
      }
    }
  };

  // Helper function to convert birthdate "09-xx-19xx" to "YYYY-MM-DD"
  const convertBirthdate = (birthdate: string): string | null => {
    try {
      // Example: "09-xx-19xx" or "09-15-1990"
      const parts = birthdate.split('-');
      if (parts.length !== 3) return null;

      const day = parts[0].replace('x', '01'); // Replace xx with 01
      const month = parts[1].replace('x', '01');
      const year = parts[2].replace(/x/g, '0'); // Replace xxxx with 0000

      // If year is partial, try to estimate (e.g., 19xx -> 1990)
      let fullYear = year;
      if (year.includes('0')) {
        fullYear = year.replace(/0/g, '9'); // Estimate: 19xx -> 1999
      }

      return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return null;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // ✅ Validation: BVN must be verified first, then NIN
    if (bvnStatus !== 'success') {
      setError('Please verify your BVN first');
      return;
    }

    if (ninStatus !== 'success') {
      setError('Please verify your NIN');
      return;
    }

    // ✅ Validate required fields
    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
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
      // Submit to backend
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

      // Refresh context with updated data
      await refreshUserData();

      // Move to next step
      onNext(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="p-6">
        <Logo width={150} height={40} />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Personal Information
              </h2>
              <p className="text-gray-600">
                Please provide your personal details for verification
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields - Auto-populated from context */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                    disabled
                  />
                </div>
              </div>

              {/* BVN Verification - FIRST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  BVN (Bank Verification Number) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.bvn}
                    onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter 11-digit BVN"
                    maxLength={11}
                    required
                    disabled={bvnStatus === 'success'}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyBVN}
                    disabled={bvnStatus === 'verifying' || bvnStatus === 'success' || formData.bvn.length !== 11}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {bvnStatus === 'verifying' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {bvnStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {bvnStatus === 'error' && <XCircle className="w-4 h-4" />}
                    {bvnStatus === 'success' ? 'Verified' : bvnStatus === 'verifying' ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {bvnStatus === 'success' && (
                  <p className="text-xs text-green-600 mt-1">✓ BVN verified successfully</p>
                )}
                {bvnStatus === 'error' && (
                  <p className="text-xs text-red-600 mt-1">✗ Verification failed</p>
                )}
              </div>

              {/* NIN Verification - SECOND (only enabled after BVN success) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIN (National Identification Number) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.nin}
                    onChange={(e) => handleInputChange('nin', e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                    placeholder="Enter 11-digit NIN"
                    maxLength={11}
                    required
                    disabled={bvnStatus !== 'success' || ninStatus === 'success'}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyNIN}
                    disabled={bvnStatus !== 'success' || ninStatus === 'verifying' || ninStatus === 'success' || formData.nin.length !== 11}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {ninStatus === 'verifying' && <Loader2 className="w-4 h-4 animate-spin" />}
                    {ninStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {ninStatus === 'error' && <XCircle className="w-4 h-4" />}
                    {ninStatus === 'success' ? 'Verified' : ninStatus === 'verifying' ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {bvnStatus !== 'success' && (
                  <p className="text-xs text-gray-500 mt-1">⚠ Please verify BVN first</p>
                )}
                {ninStatus === 'success' && (
                  <p className="text-xs text-green-600 mt-1">✓ NIN verified successfully</p>
                )}
                {ninStatus === 'error' && (
                  <p className="text-xs text-red-600 mt-1">✗ Verification failed</p>
                )}
              </div>

              {/* Date of Birth - Auto-populated from BVN/NIN or database */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>

              {/* Gender - Auto-populated from BVN/NIN or database */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occupation - Always enabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation *
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select occupation</option>
                  {occupationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Source of Funds - Always enabled */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source of Funds *
                </label>
                <select
                  value={formData.sourceOfFunds}
                  onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="">Select source of funds</option>
                  {sourceOfFundsOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || bvnStatus !== 'success' || ninStatus !== 'success'}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}