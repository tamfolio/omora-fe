import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown, Info } from "lucide-react";
import Logo from "../../Logo";
import kycApiService from "@/lib/kyc-api-service";

// ✅ FIX 1: Allow onNext to accept data (payload)
interface BusinessInformationProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

// ✅ FIX 2: Added rcType to interface (optional)
interface FormData {
  businessName: string;
  rcNumber: string;
  rcType: string; 
  city: string;
  state: string;
  businessType: string;
  businessAddress: string;
  taxIdentificationNumber: string;
  businessDescription: string;
  website: string;
}

const businessTypeOptions = [
  { value: "limited-liability", label: "Limited Liability Company" },
  { value: "partnership", label: "Partnership" },
  { value: "sole-proprietorship", label: "Sole Proprietorship" },
  { value: "public-company", label: "Public Company" },
  { value: "non-profit", label: "Non-Profit Organization" },
  { value: "cooperative", label: "Cooperative" },
  { value: "other", label: "Other" },
];

function BusinessInformation({ onNext, onBack }: BusinessInformationProps) {
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    rcNumber: "",
    rcType: "RC", // Defaulting to RC, or you can leave empty
    city: "",
    state: "",
    businessType: "",
    businessAddress: "",
    taxIdentificationNumber: "",
    businessDescription: "",
    website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dropdownStates, setDropdownStates] = useState({
    businessType: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDropdown = (dropdown: keyof typeof dropdownStates) => {
    setDropdownStates((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const selectOption = (field: keyof FormData, value: string) => {
    handleInputChange(field, value);
    setDropdownStates((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  const formatRCNumber = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const formatTIN = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 11);
  };

  const isFormValid = () => {
    return (
      formData.businessType !== "" &&
      formData.businessAddress.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.state.trim() !== "" &&
      formData.taxIdentificationNumber.trim() !== "" &&
      formData.businessDescription.trim() !== ""
    );
  };

  const handleNext = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // ✅ FIX 3: Construct the Complete JSON Payload
      // This now includes ALL fields collected in the form
      const payload = {
        businessName: formData.businessName,
        rcNumber: formData.rcNumber,
        rcType: formData.rcType,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        taxIdentificationNumber: formData.taxIdentificationNumber,
        businessDescription: formData.businessDescription,
        website: formData.website,
      };

      // 2. Call the 'Information' Endpoint
      const response = await fetch('/api/proxy/user/api/v1/onboarding/business/information', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update business details');
      }

      // 3. Move to Step 7
      onNext(payload); 
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedLabel = (field: keyof FormData, options: SelectOption[]) => {
    const selected = options.find((option) => option.value === formData[field]);
    return selected ? selected.label : "";
  };

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await kycApiService.getUserKycStatus();

        if (response.status === "success" && response.data?.business) {
          const { businessName, registrationNumber } = response.data.business;

          // Logic to separate RC Number and Type if needed
          const cleanRC = registrationNumber
            ? registrationNumber.replace(/^RC/i, "")
            : "";
            
          setFormData((prev) => ({
            ...prev,
            businessName: businessName || prev.businessName,
            rcNumber: cleanRC || prev.rcNumber,
            // You might want to auto-set rcType here if your API provides it
          }));
        }
      } catch (err) {
        console.error("Error fetching user data for auto-populate:", err);
      }
    };

    fetchBusinessData();
  }, []);

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
            <div className="text-sm font-medium text-gray-700">
              Business Information
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500 flex items-center justify-center relative">
            <span className="text-sm font-semibold text-cyan-600">40%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Business Information
        </h1>

        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              readOnly
              value={formData.businessName}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* RC Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RC Number
            </label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
                <span className="text-gray-600 text-sm font-medium">RC</span>
              </div>
              <input
                type="text"
                readOnly
                value={formData.rcNumber}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 bg-gray-100 rounded-r-xl cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Business Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Type <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown("businessType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white text-left flex items-center justify-between hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-sm"
            >
              <span
                className={
                  formData.businessType ? "text-gray-900" : "text-gray-500"
                }
              >
                {formData.businessType
                  ? getSelectedLabel("businessType", businessTypeOptions)
                  : "Select"}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${dropdownStates.businessType ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownStates.businessType && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {businessTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectOption("businessType", option.value)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Address <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Enter your business address"
              value={formData.businessAddress}
              onChange={(e) =>
                handleInputChange("businessAddress", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Tax Identification Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Identification Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="11 digit number"
                value={formData.taxIdentificationNumber}
                onChange={(e) =>
                  handleInputChange(
                    "taxIdentificationNumber",
                    formatTIN(e.target.value),
                  )
                }
                maxLength={11}
                className="w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="group inline-block relative">
                  <button
                    aria-describedby="tin-tooltip"
                    type="button"
                    className="focus:outline-none"
                  >
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                  </button>
                  <div
                    id="tin-tooltip"
                    role="tooltip"
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:block group-focus:block w-56 p-3 bg-white border border-gray-200 text-sm text-gray-700 rounded-lg shadow-lg"
                  >
                    This is a unique number used to identify you for tax
                    purposes.
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your Tax Identification Number (TIN) for compliance and
              verification purposes.
            </p>
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your business"
              value={formData.businessDescription}
              onChange={(e) =>
                handleInputChange("businessDescription", e.target.value)
              }
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors resize-none"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <div className="relative">
              <div className="flex">
                <div className="flex items-center px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
                  <span className="text-gray-600 text-sm">http://</span>
                </div>
                <input
                  type="text"
                  placeholder="www.loremipsum.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This is a hint text to help user.
            </p>
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
            className={`w-full py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 ${
              isFormValid() && !isSubmitting
                ? "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Next"}
          </button>
        </div>
      </div>

      {/* Support Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Overlay for dropdowns */}
      {dropdownStates.businessType && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownStates({ businessType: false })}
        />
      )}
    </div>
  );
}

export default BusinessInformation;