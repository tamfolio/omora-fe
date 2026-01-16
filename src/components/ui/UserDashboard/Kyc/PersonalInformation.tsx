import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Info, Calendar } from 'lucide-react';
import Logo from '../../Logo';
import kycApiService from '@/lib/kyc-api-service';

interface PersonalInformationProps {
  onNext: (data?: any) => void;
  onBack: () => void;
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
  nin: string; // ✅ NEW - NIN field
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

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

function PersonalInformation({ onNext, onBack }: PersonalInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    bvn: '',
    nin: '', // ✅ NEW
    gender: '',
    occupation: '',
    sourceOfFunds: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dropdownStates, setDropdownStates] = useState({
    gender: false,
    occupation: false,
    sourceOfFunds: false,
    calendar: false,
    yearDropdown: false,
    monthDropdown: false
  });

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

  const isFormValid = () => {
    return formData.firstName.trim() !== '' &&
           formData.lastName.trim() !== '' &&
           formData.dateOfBirth.trim() !== '' &&
           formData.bvn.trim() !== '' &&
           formData.nin.trim() !== '' && // ✅ NIN also required
           formData.gender !== '' &&
           formData.occupation !== '' &&
           formData.sourceOfFunds !== '';
  };

  const handleNext = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Validate date format
      if (!formData.dateOfBirth.includes('/')) {
        throw new Error("Invalid date format. Please select a date from the calendar.");
      }
      
      const [day, month, year] = formData.dateOfBirth.split('/');
      const dateObject = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0);

      // Format date as YYYY-MM-DD only (no time)
      const formattedDate = dateObject.toISOString().split('T')[0];
      
      const apiData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        middleName: formData.middleName.trim(),
        dateOfBirth: formattedDate,
        bvn: formData.bvn,
        nin: formData.nin, // ✅ Send NIN
        gender: formData.gender === 'MALE' ? 'Male' : formData.gender === 'FEMALE' ? 'Female' : 'Other',
        occupation: capitalizeFirstLetter(formData.occupation),
        sourceOfFund: capitalizeFirstLetter(formData.sourceOfFunds)
      };

      console.log('DEBUG PAYLOAD:', JSON.stringify(apiData, null, 2));

      const response = await kycApiService.submitPersonalInformation(apiData);
      
      console.log('Success:', response);
      
      // ✅ Pass data to parent including firstName, lastName, NIN
      onNext({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: formattedDate,
        bvn: formData.bvn,
        nin: formData.nin, // ✅ Pass NIN
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

  const getSelectedLabel = (field: keyof FormData, options: SelectOption[]) => {
    const selected = options.find(option => option.value === formData[field]);
    return selected ? selected.label : '';
  };

  // --- CALENDAR LOGIC START ---
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateValid = (date: Date) => {
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return date <= eighteenYearsAgo;
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    if (isDateValid(selected)) {
      setSelectedDate(selected);
      const dayStr = day.toString().padStart(2, '0');
      const monthStr = (calendarDate.getMonth() + 1).toString().padStart(2, '0');
      const yearStr = calendarDate.getFullYear();
      
      const formattedDate = `${dayStr}/${monthStr}/${yearStr}`;
      handleInputChange('dateOfBirth', formattedDate);
      setDropdownStates(prev => ({ ...prev, calendar: false }));
    }
  };

  const navigateYear = (year: number) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setDropdownStates(prev => ({ ...prev, yearDropdown: false }));
  };

  const navigateMonth = (monthIndex: number) => {
    setCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(monthIndex);
      return newDate;
    });
    setDropdownStates(prev => ({ ...prev, monthDropdown: false }));
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const minYear = 1950;
    const maxYear = currentYear - 18;
    const years = [];
    for (let year = maxYear; year >= minYear; year--) {
      years.push(year);
    }
    return years;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(calendarDate);
    const firstDay = getFirstDayOfMonth(calendarDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
      const isValid = isDateValid(date);
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === calendarDate.getMonth() && 
        selectedDate.getFullYear() === calendarDate.getFullYear();

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateSelect(day)}
          disabled={!isValid}
          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-teal-500 text-white'
              : isValid
                ? 'hover:bg-teal-100 text-gray-700'
                : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };
  // --- CALENDAR LOGIC END ---

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
            <div className="text-sm text-gray-500">Step 3/6</div>
            <div className="text-sm font-medium text-gray-700">Personal Information</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center">
            <span className="text-sm font-semibold text-teal-500">50%</span>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-500 mt-1">Must match ID and NIN</p>
          </div>

          {/* Middle Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              type="text"
              placeholder="Enter your middle name"
              value={formData.middleName}
              onChange={(e) => handleInputChange('middleName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date of Birth with Calendar */}
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
            <p className="text-xs text-gray-500 mt-1">Must be above 18 years</p>

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

          {/* BVN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              BVN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit BVN"
                value={formData.bvn}
                onChange={(e) => handleInputChange('bvn', formatBVN(e.target.value))}
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Bank Verification Number</p>
          </div>

          {/* NIN - NEW FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit NIN"
                value={formData.nin}
                onChange={(e) => handleInputChange('nin', formatNIN(e.target.value))}
                maxLength={11}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Info className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">National Identity Number (Used for facial verification)</p>
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender <span className="text-red-500">*</span></label>
            <button type="button" onClick={() => toggleDropdown('gender')} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between">
              <span className={formData.gender ? 'text-gray-900' : 'text-gray-500'}>
                {formData.gender ? getSelectedLabel('gender', genderOptions) : 'Select gender'}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
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

      {/* Overlay */}
      {(dropdownStates.gender || dropdownStates.occupation || dropdownStates.sourceOfFunds || dropdownStates.calendar) && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownStates({ gender: false, occupation: false, sourceOfFunds: false, calendar: false, yearDropdown: false, monthDropdown: false })} />
      )}
    </div>
  );
}

export default PersonalInformation;