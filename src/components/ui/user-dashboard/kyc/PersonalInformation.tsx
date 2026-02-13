import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from '../../Logo';
import { useUserData } from '@/contexts/UserDataContext';
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

const mapGenderToFull = (gender: string): string => {
  const g = gender?.toLowerCase();
  if (g === 'm' || g === 'male') return 'MALE';
  if (g === 'f' || g === 'female') return 'FEMALE';
  return gender?.toUpperCase() || '';
};
const formatToBackendDate = (dateString: string) => {
  if (!dateString || !dateString.includes('-')) return dateString;
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
};

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

  const isOldEnough = (dobString: string): boolean => {
    const [day, month, year] = dobString.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

useEffect(() => {
  if (!userData) return;
  const { user, verification } = userData;

  setFormData(prev => ({
    ...prev,
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    dateOfBirth: prev.dateOfBirth || user?.dateOfBirth || '',
    gender: prev.gender || user?.gender || '',
  }));

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


  useEffect(() => {
    if (formData.bvn.length === 11 && bvnStatus === 'idle') handleVerifyBVN();
  }, [formData.bvn]);

  useEffect(() => {
    if (formData.nin.length === 11 && ninStatus === 'idle') handleVerifyNIN();
  }, [formData.nin]);


const handleVerifyBVN = async () => {
  console.log('🔵 Starting BVN verification...', formData.bvn);
  setBvnStatus('verifying');
  setBvnError(null);
  
  try {
    const response = await fetch('/api/proxy/user/verification/verify/bvn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idNumber: formData.bvn }),
    });
    
    console.log('🔵 BVN Response status:', response.status, response.ok);
    
    const result = await response.json();
    console.log('🔵 BVN Result:', result);
    
    if (response.ok && result.status === 'VERIFIED') {
      console.log('✅ BVN Verified!');
      console.log('🔵 Gender from response:', result.gender);
      console.log('🔵 Birthdate from response:', result.birthdate);
      
      // Check age
      if (!isOldEnough(result.birthdate)) {
        console.log('❌ User is under 18');
        setBvnStatus('error');
        setBvnError('Must be at least 18 years old');
        return;
      }
      
      setBvnStatus('success');
      
      // Update form data
      const newGender = mapGenderToFull(result.gender)  ; // "Male" → "MALE"
      const newDob = result.birthdate; 
      
      console.log('🔵 Setting formData:', { gender: newGender, dateOfBirth: newDob });
      
      setFormData(prev => ({ 
  ...prev, 
  gender: mapGenderToFull(result.gender), 
  dateOfBirth: result.birthdate
}));

      await refreshUserData();
      console.log('✅ BVN verification complete!');
    } else {
      console.log('❌ BVN verification failed:', result.message);
      setBvnStatus('error');
      setBvnError(result.message || 'BVN verification failed');
    }
  } catch (err) {
    console.error('❌ BVN Error:', err);
    setBvnStatus('error');
    setBvnError('Verification failed');
  }
};

const handleVerifyNIN = async () => {
  console.log('🟢 Starting NIN verification...', formData.nin);
  setNinStatus('verifying');
  setNinError(null);
  
  try {
    const response = await fetch('/api/proxy/user/verification/verify/nin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idNumber: formData.nin }),
    });
    
    console.log('🟢 NIN Response status:', response.status, response.ok);
    
    const result = await response.json();
    console.log('🟢 NIN Result:', result);
    
    if (response.ok && result.status === 'VERIFIED') {
      console.log('✅ NIN Verified!');
      console.log('🟢 Gender from response:', result.gender);
      console.log('🟢 Birthdate from response:', result.birthdate);
      
      // Check age
      if (!isOldEnough(result.birthdate)) {
        console.log('❌ User is under 18');
        setNinStatus('error');
        setNinError('Must be at least 18 years old');
        return;
      }
      
      setNinStatus('success');
      
      // Update form data
      const newGender = mapGenderToFull(result.gender)  ; // "Male" → "MALE"
      const newDob = result.birthdate; // "01-04-2003"
      
      console.log('🟢 Setting formData:', { gender: newGender, dateOfBirth: newDob });
      
      setFormData(prev => ({ 
  ...prev, 
  gender: mapGenderToFull(result.gender), 
  dateOfBirth: result.birthdate
}));
      
      await refreshUserData();
      console.log('✅ NIN verification complete!');
    } else {
      console.log('❌ NIN verification failed:', result.message);
      setNinStatus('error');
      setNinError(result.message || 'NIN verification failed');
    }
  } catch (err) {
    console.error('❌ NIN Error:', err);
    setNinStatus('error');
    setNinError('Verification failed');
  }
};


{process.env.NODE_ENV === 'development' && (
  <div className="p-4 bg-gray-100 rounded text-xs font-mono">
    <div>Gender: {formData.gender || 'empty'}</div>
    <div>DOB: {formData.dateOfBirth || 'empty'}</div>
    <div>BVN Status: {bvnStatus}</div>
    <div>NIN Status: {ninStatus}</div>
  </div>
)}

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'bvn' && bvnStatus === 'error') setBvnStatus('idle');
    if (field === 'nin' && ninStatus === 'error') setNinStatus('idle');
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation check before attempting save
  if (bvnStatus !== 'success' || ninStatus !== 'success') {
    setError('Please verify your identity first');
    return;
  }
  
  setIsSubmitting(true);
  setError(null); // Clear previous errors

  try {
    const response = await fetch('/api/proxy/user/api/v1/onboarding/personal/information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...formData, 
        // 1. Convert "01-04-2003" -> "2003-04-01" to fix potential backend validation errors
        dateOfBirth: formatToBackendDate(formData.dateOfBirth),
        // 2. Map to the singular 'sourceOfFund' expected by the backend
        sourceOfFund: formData.sourceOfFunds 
      }),
    });

    if (!response.ok) {
      // Handle the 404 or other server errors gracefully
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error('Onboarding endpoint not found (404). Please verify the proxy path.');
      }
      throw new Error(errorData.message || `Failed to save (Status: ${response.status})`);
    }

    // Refresh the context so other steps have the updated info
    await refreshUserData();
    onNext(formData);
  } catch (err: any) {
    console.error('❌ Save Error:', err);
    setError(err.message);
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

      <div className="max-w-md mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Personal Information</h2>
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">First Name</label>
            <input type="text" value={formData.firstName} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50" disabled />
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Middle Name</label>
            <input type="text" value={formData.middleName} onChange={(e) => handleInputChange('middleName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-teal-500" placeholder="Racheal" />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Last Name</label>
            <input type="text" value={formData.lastName} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-gray-50" disabled />
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
    className={`w-full px-3 py-2 border border-gray-300 rounded-xl text-sm ${
      (bvnStatus === 'success' || ninStatus === 'success') ? 'bg-gray-50' : ''
    }`}
    placeholder="DD-MM-YYYY"
    disabled={bvnStatus === 'success' || ninStatus === 'success'} // ✅ Disable only AFTER verification
    readOnly={bvnStatus === 'success' || ninStatus === 'success'}
  />
  <p className="text-xs text-gray-500 mt-1">Must be above 18 years</p>
</div>


          {/* BVN */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">BVN <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={`w-full px-3 py-2 border rounded-xl text-sm ${bvnStatus === 'error' ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="11 digit number"
              />
              {bvnStatus === 'verifying' && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
              {bvnStatus === 'success' && <div className="absolute right-3 top-2 text-green-500">✓</div>}
            </div>
            {bvnError && <p className="text-xs text-red-500 mt-1">{bvnError}</p>}
          </div>

          {/* NIN */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">NIN <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="text"
                value={formData.nin}
                onChange={(e) => handleInputChange('nin', e.target.value.replace(/\D/g, '').slice(0, 11))}
                className={`w-full px-3 py-2 border rounded-xl text-sm ${ninStatus === 'error' ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="11 digit number"
              />
              {ninStatus === 'verifying' && <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>}
              {ninStatus === 'success' && <div className="absolute right-3 top-2 text-green-500">✓</div>}
            </div>
            {ninError && <p className="text-xs text-red-500 mt-1">{ninError}</p>}
          </div>

          {/* Gender */}
         <div>
  <label className="block text-sm text-gray-700 mb-1.5">
    Gender <span className="text-red-500">*</span>
  </label>
  <select 
    value={formData.gender} 
    onChange={(e) => handleInputChange('gender', e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-xl text-sm ${
      (bvnStatus === 'success' || ninStatus === 'success') ? 'bg-gray-50' : ''
    }`}
    disabled={bvnStatus === 'success' || ninStatus === 'success'} // ✅ Disable only AFTER verification
  >
    {genderOptions.map((option) => (
      <option key={option.value} value={option.value}>{option.label}</option>
    ))}
  </select>
</div>

          {/* Occupation */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Occupation <span className="text-red-500">*</span></label>
            <select value={formData.occupation} onChange={(e) => handleInputChange('occupation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-teal-500">
              {occupationOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Source of Funds */}
          <div>
            <label className="block text-sm text-gray-700 mb-1.5">Source of Funds <span className="text-red-500">*</span></label>
            <select value={formData.sourceOfFunds} onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-teal-500">
              {sourceOfFundsOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={isSubmitting || bvnStatus !== 'success' || ninStatus !== 'success'} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </form>
 {/* Debug Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-gray-100 rounded text-xs font-mono">
            <div>Gender: {formData.gender || 'empty'}</div>
            <div>DOB: {formData.dateOfBirth || 'empty'}</div>
            <div>BVN Status: {bvnStatus}</div>
            <div>NIN Status: {ninStatus}</div>
          </div>
        )}
        {/* Floating Help Button Re-added */}
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg text-white">
          <FiHeadphones className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}