import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Info, Calendar } from 'lucide-react';
import Logo from '../../Logo';

interface PersonalInformationProps {
  onNext: () => void;
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

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
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

  const formatBVN = (value: string) => {
    // Remove any non-digit characters and limit to 11 digits
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const getSelectedLabel = (field: keyof FormData, options: SelectOption[]) => {
    const selected = options.find(option => option.value === formData[field]);
    return selected ? selected.label : '';
  };

  // Calendar functions
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
      const formattedDate = `${day.toString().padStart(2, '0')}/${(calendarDate.getMonth() + 1).toString().padStart(2, '0')}/${calendarDate.getFullYear()}`;
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
    const minYear = 1950; // Reasonable minimum year
    const maxYear = currentYear - 18; // Must be at least 18 (so 2007 for 2025)
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

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
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
          <div className="w-12 h-12 rounded-full border-4 border-teal-500 flex items-center justify-center relative">
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

          {/* Date of Birth with Calendar */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('calendar')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
            >
              <span className={formData.dateOfBirth ? 'text-gray-900' : 'text-gray-500'}>
                {formData.dateOfBirth || 'dd/mm/yyyy'}
              </span>
              <Calendar className="w-5 h-5 text-gray-400" />
            </button>
            <p className="text-xs text-gray-500 mt-1">Must be above 18 years</p>

            {/* Calendar Dropdown */}
            {dropdownStates.calendar && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  {/* Year Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('yearDropdown')}
                      className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {calendarDate.getFullYear()}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownStates.yearDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Year Dropdown */}
                    {dropdownStates.yearDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 w-20">
                        <div className="max-h-32 overflow-y-auto">
                          {getYearOptions().map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => navigateYear(year)}
                              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors text-sm ${
                                year === calendarDate.getFullYear() ? 'bg-teal-50 text-teal-600 font-medium' : ''
                              }`}
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Month Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('monthDropdown')}
                      className="flex items-center space-x-1 px-3 py-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <span className="text-sm font-medium">
                        {months[calendarDate.getMonth()]}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${dropdownStates.monthDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Month Dropdown */}
                    {dropdownStates.monthDropdown && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-60 w-32">
                        <div className="max-h-40 overflow-y-auto">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              type="button"
                              onClick={() => navigateMonth(index)}
                              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 transition-colors text-sm ${
                                index === calendarDate.getMonth() ? 'bg-teal-50 text-teal-600 font-medium' : ''
                              }`}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="w-8 h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
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
                    onClick={() => selectOption('gender', option.value)}
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
                    onClick={() => selectOption('occupation', option.value)}
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
                    onClick={() => selectOption('sourceOfFunds', option.value)}
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Overlay for dropdowns */}
      {(dropdownStates.gender || dropdownStates.occupation || dropdownStates.sourceOfFunds || dropdownStates.calendar) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownStates({ gender: false, occupation: false, sourceOfFunds: false, calendar: false, yearDropdown: false, monthDropdown: false })}
        />
      )}
    </div>
  );
}

export default PersonalInformation;