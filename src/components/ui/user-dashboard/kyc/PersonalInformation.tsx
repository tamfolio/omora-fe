import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService, { verifyNIN, verifyBVN } from '@/lib/kyc-api-service';

interface PersonalInformationProps {
  onNext: (data?: any) => void;
  onBack: () => void;
  initialData?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: string;
    nin?: string;
    bvn?: string;
    occupation?: string;
    sourceOfFund?: string;
  };
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

export default function PersonalInformation({ onNext, onBack, initialData }: PersonalInformationProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    middleName: initialData?.middleName || '',
    lastName: initialData?.lastName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    nin: initialData?.nin || '',
    bvn: initialData?.bvn || '',
    gender: initialData?.gender || '',
    occupation: initialData?.occupation || '',
    sourceOfFunds: initialData?.sourceOfFund || ''
  });

  const [ninStatus, setNinStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [bvnStatus, setBvnStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCorporate, setIsCorporate] = useState(false);

  // Initialize verified status
// Initialize verified status
useEffect(() => {
  if (initialData?.nin) setNinStatus('success');
  if (initialData?.bvn) setBvnStatus('success');
  
  // Set dateOfBirth and gender from initialData (already in correct format from /me)
  setFormData(prev => ({
    ...prev,
    ...(initialData?.dateOfBirth && { dateOfBirth: initialData.dateOfBirth }),
    ...(initialData?.gender && { gender: initialData.gender })
  }));
}, [initialData]);



// Inside PersonalInformation.tsx

useEffect(() => {
  let mounted = true;
  const check = async () => {
    try {
      const res = await kycApiService.getUserKycStatus();
      const data = (res as any)?.data;
      if (!mounted) return;
      
      // 1. Check if corporate
      if (data?.business && data.business.businessId) {
        setIsCorporate(true);
      }
      
      // 2. Check for verified NIN/BVN
      if (data?.verification && Array.isArray(data.verification)) {
        const ninRecord = data.verification.find((v: any) => v.type === 'NIN' && v.status === 'C');
        const bvnRecord = data.verification.find((v: any) => v.type === 'BVN' && v.status === 'C');
        
        if (ninRecord) {
          setFormData(prev => ({ ...prev, nin: ninRecord.value }));
          setNinStatus('success');
        }
        
        if (bvnRecord) {
          setFormData(prev => ({ ...prev, bvn: bvnRecord.value }));
          setBvnStatus('success');
        }
        
        // 3. THE DATE FIX IS HERE
        if ((ninRecord || bvnRecord) && data.user) {
          if (data.user.dateOfBirth) {
            // Remove time portion first: "1996-05-12T00:00:00" -> "1996-05-12"
            const dateOnly = data.user.dateOfBirth.split('T')[0];
            const [year, month, day] = dateOnly.split('-');
            
            // Reformat to dd/mm/yyyy
            setFormData(prev => ({ ...prev, dateOfBirth: `${day}/${month}/${year}` }));
          }
          
          if (data.user.gender) {
            const gender = data.user.gender.toUpperCase() === 'M' || data.user.gender.toUpperCase() === 'MALE' ? 'MALE' : 'FEMALE';
            setFormData(prev => ({ ...prev, gender }));
          }
        }
      }
    } catch (err) {
      // ignore
    }
  };
  check();
  return () => { mounted = false; };
}, []);

  // Auto-verify NIN on 11 digits
  useEffect(() => {
    if (formData.nin.length === 11 && ninStatus === 'idle') {
      verifyNINAuto();
    }
  }, [formData.nin]);

  // Auto-verify BVN on 11 digits
  useEffect(() => {
    if (formData.bvn.length === 11 && bvnStatus === 'idle') {
      verifyBVNAuto();
    }
  }, [formData.bvn]);

  const verifyNINAuto = async () => {
    setNinStatus('verifying');
    try {
      const response = await verifyNIN(formData.nin);
      if (response.status === 'VERIFIED') {
        setNinStatus('success');
        if (response.birthdate) {
          // Handle ISO format (yyyy-mm-ddT00:00:00) or dd-mm-yyyy
          let dateStr = response.birthdate.split('T')[0]; // Remove time portion if present
          let formattedDate = '';
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            // If yyyy-mm-dd format (year is first and 4 digits)
            if (parts[0].length === 4) {
              formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
              // If dd-mm-yyyy format
              formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
            }
          }
          if (formattedDate) {
            setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
          }
        }
        if (response.gender) {
          const gender = response.gender.toLowerCase() === 'm' ? 'MALE' : 'FEMALE';
          setFormData(prev => ({ ...prev, gender }));
        }
      } else {
        setNinStatus('error');
      }
    } catch (error) {
      setNinStatus('error');
    }
  };

  const verifyBVNAuto = async () => {
    setBvnStatus('verifying');
    try {
      const response = await verifyBVN(formData.bvn);
      if (response.status === 'VERIFIED') {
        setBvnStatus('success');
        if (response.birthdate && !formData.dateOfBirth) {
          // Handle ISO format (yyyy-mm-ddT00:00:00) or dd-mm-yyyy
          let dateStr = response.birthdate.split('T')[0]; // Remove time portion if present
          let formattedDate = '';
          if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            // If yyyy-mm-dd format (year is first and 4 digits)
            if (parts[0].length === 4) {
              formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            } else {
              // If dd-mm-yyyy format
              formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
            }
          }
          if (formattedDate) {
            setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
          }
        }
        if (response.gender && !formData.gender) {
          const gender = response.gender.toLowerCase() === 'm' ? 'MALE' : 'FEMALE';
          setFormData(prev => ({ ...prev, gender }));
        }
      } else {
        setBvnStatus('error');
      }
    } catch (error) {
      setBvnStatus('error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset verification status if user changes input
    if (field === 'nin' && value.length < 11) setNinStatus('idle');
    if (field === 'bvn' && value.length < 11) setBvnStatus('idle');
  };

  const getStatusIcon = (status: string) => {
    if (status === 'verifying') return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    if (status === 'success') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (status === 'error') return <XCircle className="w-5 h-5 text-red-500" />;
    return null;
  };

  const isFormValid = () => {
      return formData.firstName.trim() !== '' &&
        formData.lastName.trim() !== '' &&
        formData.dateOfBirth.trim() !== '' &&
        ninStatus === 'success' &&
        bvnStatus === 'success' &&
        formData.gender !== '' &&
        (isCorporate || (formData.occupation !== '' && formData.sourceOfFunds !== ''));
  };

  const handleNext = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Parse dateOfBirth defensively
      if (!formData.dateOfBirth || !formData.dateOfBirth.includes('/')) {
        setError('Date of birth must be in dd/mm/yyyy format');
        setIsSubmitting(false);
        return;
      }

      const parts = formData.dateOfBirth.split('/');
      if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
        setError('Date of birth must be in dd/mm/yyyy format');
        setIsSubmitting(false);
        return;
      }

      const [day, month, year] = parts;
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const apiData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        dateOfBirth: formattedDate,
        bvn: formData.bvn,
        nin: formData.nin,
        gender: formData.gender,
        ...(isCorporate ? {} : {
          occupation: formData.occupation ? formData.occupation.charAt(0).toUpperCase() + formData.occupation.slice(1) : undefined,
          sourceOfFund: formData.sourceOfFunds ? formData.sourceOfFunds.charAt(0).toUpperCase() + formData.sourceOfFunds.slice(1) : undefined,
        })
      };

      await kycApiService.submitPersonalInformation(apiData);
      onNext(apiData);
      
    } catch (err: any) {
      setError(err.message || 'Failed to submit');
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

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-4">
        <h1 className="text-xl font-bold text-center mb-5">Personal Information</h1>

        <div className="space-y-3">
          {/* First Name */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">Middle Name</label>
            <input
              type="text"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            />
            <p className="text-xs text-gray-500 mt-0.5">Must be above 18 years</p>
          </div>

          {/* NIN with auto-verify */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">
              NIN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit number"
                value={formData.nin}
                onChange={(e) => handleInputChange('nin', e.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={11}
                disabled={ninStatus === 'success'}
                className={`w-full px-3 py-2 pr-10 text-sm border rounded-xl ${
                  ninStatus === 'success' ? 'bg-green-50 border-green-500' : 
                  ninStatus === 'error' ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {getStatusIcon(ninStatus)}
              </div>
            </div>
          </div>

          {/* BVN with auto-verify */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">
              BVN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit number"
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={11}
                disabled={bvnStatus === 'success'}
                className={`w-full px-3 py-2 pr-10 text-sm border rounded-xl ${
                  bvnStatus === 'success' ? 'bg-green-50 border-green-500' : 
                  bvnStatus === 'error' ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {getStatusIcon(bvnStatus)}
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-gray-700 mb-0.5">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
            >
              <option value="">Select gender</option>
              {genderOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {!isCorporate && (
            <>
              {/* Occupation */}
              <div>
                <label className="block text-xs text-gray-700 mb-0.5">
                  Occupation <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
                >
                  <option value="">Enter your occupation</option>
                  {occupationOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Source of Funds */}
              <div>
                <label className="block text-xs text-gray-700 mb-0.5">
                  Source of Funds <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.sourceOfFunds}
                  onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl"
                >
                  <option value="">Select source</option>
                  {sourceOfFundsOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!isFormValid() || isSubmitting}
            className={`w-full py-2 rounded-lg font-semibold text-sm text-white ${
              isFormValid() && !isSubmitting
                ? 'bg-teal-500 hover:bg-teal-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}