import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Info, Calendar, CheckCircle2, XCircle } from 'lucide-react';
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

interface SelectOption {
  value: string;
  label: string;
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  bvn: string;
  nin: string;
  gender: string;
  occupation: string;
  sourceOfFunds: string;
}

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function PersonalInformation({ onNext, onBack, initialData }: PersonalInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: initialData?.firstName || '',
    middleName: initialData?.middleName || '',
    lastName: initialData?.lastName || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    bvn: initialData?.bvn || '',
    nin: initialData?.nin || '',
    gender: initialData?.gender || '',
    occupation: initialData?.occupation || '',
    sourceOfFunds: initialData?.sourceOfFund || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: Verification states
  const [ninVerified, setNinVerified] = useState(false);
  const [bvnVerified, setBvnVerified] = useState(false);
  const [ninVerifying, setNinVerifying] = useState(false);
  const [bvnVerifying, setBvnVerifying] = useState(false);
  const [verificationErrors, setVerificationErrors] = useState({ nin: '', bvn: '' });

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    occupation: false,
    sourceOfFunds: false,
    calendar: false,
    yearDropdown: false,
    monthDropdown: false
  });

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // NEW: Initialize from initialData
  useEffect(() => {
    if (initialData) {
      // If NIN/BVN exist in initialData, mark as verified
      if (initialData.nin) setNinVerified(true);
      if (initialData.bvn) setBvnVerified(true);
      
      // Convert date format if needed
      if (initialData.dateOfBirth && initialData.dateOfBirth.includes('-')) {
        const [year, month, day] = initialData.dateOfBirth.split('T')[0].split('-');
        setFormData(prev => ({
          ...prev,
          dateOfBirth: `${day}/${month}/${year}`
        }));
      }
    }
  }, [initialData]);

  // NEW: Verify NIN
  const handleVerifyNIN = async () => {
    if (!formData.nin || formData.nin.length !== 11) {
      setVerificationErrors(prev => ({ ...prev, nin: 'NIN must be 11 digits' }));
      return;
    }

    setNinVerifying(true);
    setVerificationErrors(prev => ({ ...prev, nin: '' }));

    try {
      const response = await verifyNIN(formData.nin);
      
      if (response.status === 'VERIFIED') {
        setNinVerified(true);
        
        // Auto-populate DOB and Gender
        if (response.birthdate) {
          const [day, month, year] = response.birthdate.split('-');
          setFormData(prev => ({ 
            ...prev, 
            dateOfBirth: `${day}/${month}/${year}` 
          }));
        }
        
        if (response.gender) {
          const gender = response.gender.toLowerCase() === 'm' ? 'MALE' : 'FEMALE';
          setFormData(prev => ({ ...prev, gender }));
        }
      } else {
        setVerificationErrors(prev => ({ 
          ...prev, 
          nin: 'NIN verification failed. Please check the number.' 
        }));
      }
    } catch (error: any) {
      setVerificationErrors(prev => ({ 
        ...prev, 
        nin: error.message || 'Failed to verify NIN' 
      }));
    } finally {
      setNinVerifying(false);
    }
  };

  // NEW: Verify BVN
  const handleVerifyBVN = async () => {
    if (!formData.bvn || formData.bvn.length !== 11) {
      setVerificationErrors(prev => ({ ...prev, bvn: 'BVN must be 11 digits' }));
      return;
    }

    setBvnVerifying(true);
    setVerificationErrors(prev => ({ ...prev, bvn: '' }));

    try {
      const response = await verifyBVN(formData.bvn);
      
      if (response.status === 'VERIFIED') {
        setBvnVerified(true);
        
        // Auto-populate DOB and Gender if not already set
        if (response.birthdate && !formData.dateOfBirth) {
          const [day, month, year] = response.birthdate.split('-');
          setFormData(prev => ({ 
            ...prev, 
            dateOfBirth: `${day}/${month}/${year}` 
          }));
        }
        
        if (response.gender && !formData.gender) {
          const gender = response.gender.toLowerCase() === 'm' ? 'MALE' : 'FEMALE';
          setFormData(prev => ({ ...prev, gender }));
        }
      } else {
        setVerificationErrors(prev => ({ 
          ...prev, 
          bvn: 'BVN verification failed. Please check the number.' 
        }));
      }
    } catch (error: any) {
      setVerificationErrors(prev => ({ 
        ...prev, 
        bvn: error.message || 'Failed to verify BVN' 
      }));
    } finally {
      setBvnVerifying(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Reset verification if NIN/BVN changes
    if (field === 'nin' && ninVerified) {
      setNinVerified(false);
      setVerificationErrors(prev => ({ ...prev, nin: '' }));
    }
    if (field === 'bvn' && bvnVerified) {
      setBvnVerified(false);
      setVerificationErrors(prev => ({ ...prev, bvn: '' }));
    }
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

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.dateOfBirth.trim() !== '' &&
           ninVerified && // Must be verified
           bvnVerified && // Must be verified
           formData.gender !== '' &&
           formData.occupation !== '' &&
           formData.sourceOfFunds !== '';
  };

  const handleNext = async () => {
    if (!isFormValid()) {
      if (!ninVerified || !bvnVerified) {
        setError('Please verify both NIN and BVN before proceeding');
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.dateOfBirth.includes('/')) {
        throw new Error("Invalid date format. Please select a date from the calendar.");
      }
      
      const [day, month, year] = formData.dateOfBirth.split('/');
      const dateObject = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);
      const formattedDate = dateObject.toISOString().split('T')[0];
      
      const apiData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        dateOfBirth: formattedDate,
        bvn: formData.bvn,
        nin: formData.nin,
        gender: formData.gender === 'MALE' ? 'Male' : formData.gender === 'FEMALE' ? 'Female' : 'Other',
        occupation: capitalizeFirstLetter(formData.occupation),
        sourceOfFund: capitalizeFirstLetter(formData.sourceOfFunds)
      };

      const response = await kycApiService.submitPersonalInformation(apiData);
      
      console.log('Success:', response);
      
      onNext({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: formattedDate,
        bvn: formData.bvn,
        nin: formData.nin,
        gender: formData.gender,
        occupation: formData.occupation,
        sourceOfFund: formData.sourceOfFunds
      });
      
    } catch (err: any) {
      console.error('Error submitting:', err);
      setError(err.message || 'Failed to submit. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBVN = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const formatNIN = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const getSelectedLabel = (field: string, options: SelectOption[]) => {
    const selected = options.find(opt => opt.value === formData[field as keyof FormData]);
    return selected ? selected.label : '';
  };

  const navigateMonth = (monthIndex: number) => {
    setCalendarDate(new Date(calendarDate.getFullYear(), monthIndex, 1));
    setDropdownStates(prev => ({ ...prev, monthDropdown: false }));
  };

  const navigateYear = (year: number) => {
    setCalendarDate(new Date(year, calendarDate.getMonth(), 1));
    setDropdownStates(prev => ({ ...prev, yearDropdown: false }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear - 18; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  const selectDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    handleInputChange('dateOfBirth', formattedDate);
    setSelectedDate(date);
    setDropdownStates(prev => ({ ...prev, calendar: false }));
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const currentYear = new Date().getFullYear();
    const maxDate = new Date(currentYear - 18, 11, 31);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isFutureDate = date > maxDate;
      
      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isFutureDate && selectDate(date)}
          disabled={isFutureDate}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors
            ${isSelected ? 'bg-teal-500 text-white' : ''}
            ${!isSelected && !isFutureDate ? 'hover:bg-gray-100' : ''}
            ${isFutureDate ? 'text-gray-300 cursor-not-allowed' : ''}`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="w-full max-w-2xl mx-auto px-6 py-8 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <Logo />
          <div className="w-10" />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
          <p className="text-gray-600 mb-8">Please provide your accurate personal details</p>

          <div className="space-y-4">
            {/* First Name - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-populated from your account</p>
            </div>

            {/* Last Name - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-populated from your account</p>
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
              <input
                type="text"
                placeholder="Optional"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* NIN with Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIN <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="11 digit NIN"
                    value={formData.nin}
                    onChange={(e) => handleInputChange('nin', formatNIN(e.target.value))}
                    maxLength={11}
                    disabled={ninVerified}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      ninVerified ? 'bg-green-50 border-green-500' : 'border-gray-300'
                    } ${ninVerified ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyNIN}
                  disabled={ninVerifying || ninVerified || formData.nin.length !== 11}
                  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
                    ninVerified
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {ninVerifying ? (
                    'Verifying...'
                  ) : ninVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
              {verificationErrors.nin && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {verificationErrors.nin}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">National Identity Number (Used for facial verification)</p>
            </div>

            {/* BVN with Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BVN <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="11 digit BVN"
                    value={formData.bvn}
                    onChange={(e) => handleInputChange('bvn', formatBVN(e.target.value))}
                    maxLength={11}
                    disabled={bvnVerified}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      bvnVerified ? 'bg-green-50 border-green-500' : 'border-gray-300'
                    } ${bvnVerified ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyBVN}
                  disabled={bvnVerifying || bvnVerified || formData.bvn.length !== 11}
                  className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 ${
                    bvnVerified
                      ? 'bg-green-500 text-white cursor-default'
                      : 'bg-teal-500 text-white hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {bvnVerifying ? (
                    'Verifying...'
                  ) : bvnVerified ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Verified
                    </>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
              {verificationErrors.bvn && (
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  {verificationErrors.bvn}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">Bank Verification Number</p>
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown('calendar')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <span className={formData.dateOfBirth ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.dateOfBirth || 'dd/mm/yyyy'}
                </span>
                <Calendar className="w-5 h-5 text-gray-400" />
              </button>
              <p className="text-xs text-gray-500 mt-1">
                {ninVerified || bvnVerified ? 'Auto-populated from verification' : 'Must be above 18 years'}
              </p>

              {dropdownStates.calendar && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <button type="button" onClick={() => toggleDropdown('yearDropdown')} className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-md">
                        <span className="text-sm font-medium">{calendarDate.getFullYear()}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {dropdownStates.yearDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 w-20 max-h-32 overflow-y-auto">
                          {getYearOptions().map((year) => (
                            <button key={year} type="button" onClick={() => navigateYear(year)} className="w-full px-3 py-1.5 text-left hover:bg-gray-50 text-sm">{year}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button type="button" onClick={() => toggleDropdown('monthDropdown')} className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-md">
                        <span className="text-sm font-medium">{months[calendarDate.getMonth()]}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {dropdownStates.monthDropdown && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 w-32 max-h-40 overflow-y-auto">
                          {months.map((month, index) => (
                            <button key={month} type="button" onClick={() => navigateMonth(index)} className="w-full px-3 py-1.5 text-left hover:bg-gray-50 text-sm">{month}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
              <button 
                type="button" 
                onClick={() => toggleDropdown('gender')} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between"
              >
                <span className={formData.gender ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.gender ? getSelectedLabel('gender', genderOptions) : 'Select gender'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {ninVerified || bvnVerified ? (
                <p className="text-xs text-gray-500 mt-1">Auto-populated from verification</p>
              ) : null}
              {dropdownStates.gender && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {genderOptions.map((option) => (
                    <button key={option.value} type="button" onClick={() => selectOption('gender', option.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50">
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Occupation */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Occupation <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => toggleDropdown('occupation')} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between">
                <span className={formData.occupation ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.occupation ? getSelectedLabel('occupation', occupationOptions) : 'Select occupation'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {dropdownStates.occupation && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {occupationOptions.map((option) => (
                    <button key={option.value} type="button" onClick={() => selectOption('occupation', option.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50">
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Source of Funds */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Source of Funds <span className="text-red-500">*</span></label>
              <button type="button" onClick={() => toggleDropdown('sourceOfFunds')} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between">
                <span className={formData.sourceOfFunds ? 'text-gray-900' : 'text-gray-500'}>
                  {formData.sourceOfFunds ? getSelectedLabel('sourceOfFunds', sourceOfFundsOptions) : 'Select source'}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              {dropdownStates.sourceOfFunds && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {sourceOfFundsOptions.map((option) => (
                    <button key={option.value} type="button" onClick={() => selectOption('sourceOfFunds', option.value)} className="w-full px-4 py-3 text-left hover:bg-gray-50">
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Status Banner */}
            {(ninVerified || bvnVerified) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-medium text-blue-900 mb-2">Verification Status:</p>
                <div className="space-y-1">
                  <p className={`text-sm flex items-center gap-2 ${ninVerified ? 'text-green-600' : 'text-gray-600'}`}>
                    {ninVerified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    NIN: {ninVerified ? 'Verified' : 'Not verified'}
                  </p>
                  <p className={`text-sm flex items-center gap-2 ${bvnVerified ? 'text-green-600' : 'text-gray-600'}`}>
                    {bvnVerified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    BVN: {bvnVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
            )}

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
                  ? 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {(dropdownStates.gender || dropdownStates.occupation || dropdownStates.sourceOfFunds || dropdownStates.calendar) && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownStates({ gender: false, occupation: false, sourceOfFunds: false, calendar: false, yearDropdown: false, monthDropdown: false })} />
      )}
    </div>
  );
}

export default PersonalInformation;