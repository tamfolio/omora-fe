"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiChevronDown } from "react-icons/fi";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface CorporateSignupProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CorporateSignup({
  onSuccess,
  onError,
  loading,
  setLoading,
}: CorporateSignupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [showRcTypeDropdown, setShowRcTypeDropdown] = useState(false);
  const [rcType, setRcType] = useState<'RC' | 'BN'>('RC');
  
  // RC Verification states
  const [rcVerificationStatus, setRcVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [rcVerificationError, setRcVerificationError] = useState('');
  
  // BVN / NIN verification states
  const [bvnStatus, setBvnStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [bvnError, setBvnError] = useState('');
  const [ninStatus, setNinStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
  const [ninError, setNinError] = useState('');
  
  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    rcNumber: "",
    businessName: "",
    firstName: "",
    lastName: "",
    bvn: "",
    nin: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Check /me for existing verified NIN/BVN on mount
  useEffect(() => {
    let mounted = true;
    const checkVerified = async () => {
      try {
        const response = await fetch('/api/proxy/user/api/v1/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!response.ok) return;
        
        const result = await response.json();
        const data = (result as any)?.data;
        if (!mounted || !data?.verification || !Array.isArray(data.verification)) return;
        
        // Check if NIN/BVN already verified
        const ninRecord = data.verification.find((v: any) => v.type === 'NIN' && v.status === 'C');
        const bvnRecord = data.verification.find((v: any) => v.type === 'BVN' && v.status === 'C');
        
        // Auto-populate verified NIN
        if (ninRecord && mounted) {
          setFormData(prev => ({ ...prev, nin: ninRecord.value }));
          setNinStatus('success');
        }
        
        // Auto-populate verified BVN
        if (bvnRecord && mounted) {
          setFormData(prev => ({ ...prev, bvn: bvnRecord.value }));
          setBvnStatus('success');
        }
        
        // Auto-populate dateOfBirth and gender from user object
        if ((ninRecord || bvnRecord) && data.user && mounted) {
          if (data.user.dateOfBirth) {
            const [year, month, day] = data.user.dateOfBirth.split('-');
            setFormData(prev => ({ ...prev, dateOfBirth: `${year}-${month}-${day}` }));
          }
          if (data.user.firstName && !formData.firstName) {
            setFormData(prev => ({ ...prev, firstName: data.user.firstName }));
          }
          if (data.user.lastName && !formData.lastName) {
            setFormData(prev => ({ ...prev, lastName: data.user.lastName }));
          }
        }
      } catch (err) {
        // ignore - user will manually verify
      }
    };
    checkVerified();
    return () => { mounted = false; };
  }, []);

  // Verify RC Number with backend
  const verifyRCNumber = async (rcNumber: string, type: 'RC' | 'BN') => {
    if (rcNumber.length < 6) {
      setRcVerificationStatus('idle');
      setFormData((prev) => ({ ...prev, businessName: '' }));
      return;
    }

    setRcVerificationStatus('verifying');
    setRcVerificationError('');

    try {
      // Send with prefix (RC or BN)
      const idNumber = `${type}${rcNumber}`;
      
      const response = await fetch('/api/proxy/user/verification/verify/reg-no', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idNumber: idNumber,
        }),
      });

      const result = await response.json();

      // Debug logging
      console.log('RC Verification Response:', {
        status: response.status,
        ok: response.ok,
        result: result
      });

      if (response.ok && result.status === 'VERIFIED') {
        setRcVerificationStatus('success');
        // Set actual business name from API
        setFormData((prev) => ({ 
          ...prev, 
          businessName: result.businessName || '' 
        }));
      } else {
        setRcVerificationStatus('error');
        setRcVerificationError(result.message || 'Invalid RC/BN Number');
        setFormData((prev) => ({ ...prev, businessName: '' }));
      }
    } catch (error) {
      console.error('RC verification error:', error);
      setRcVerificationStatus('error');
      setRcVerificationError('Failed to verify RC/BN Number');
      setFormData((prev) => ({ ...prev, businessName: '' }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Verify RC Number when user types
    if (field === "rcNumber") {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (value.length >= 4) {
        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
          verifyRCNumber(value, rcType);
        }, 800); 
      } else {
        setRcVerificationStatus('idle');
        setRcVerificationError('');
        setFormData((prev) => ({ ...prev, businessName: '' }));
      }
    }

    if (field === "email") {
      setEmailError("");
    }

    // If user edits BVN/NIN fields, reset statuses
    if (field === 'bvn') {
      setBvnStatus('idle');
      setBvnError('');
    }
    if (field === 'nin') {
      setNinStatus('idle');
      setNinError('');
    }
  };

  const handleRcTypeChange = (newType: 'RC' | 'BN') => {
    setRcType(newType);
    setShowRcTypeDropdown(false);
    // Re-verify with new type if RC number exists
    if (formData.rcNumber && formData.rcNumber.length >= 6) {
      verifyRCNumber(formData.rcNumber, newType);
    }
  };

  const getStatusIcon = () => {
    if (rcVerificationStatus === 'verifying') {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (rcVerificationStatus === 'success') {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (rcVerificationStatus === 'error') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getBVNIcon = () => {
    if (bvnStatus === 'verifying') return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    if (bvnStatus === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (bvnStatus === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getNINIcon = () => {
    if (ninStatus === 'verifying') return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    if (ninStatus === 'success') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (ninStatus === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
    return null;
  };

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);

    return (
      password.length >= minLength &&
      hasSymbol &&
      (hasUppercase || hasLowercase)
    );
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEmailBlur = async (email: string) => {
    if (email && email.includes("@")) {
      const exists = await checkEmailExists(email);
      if (exists) {
        setEmailError("Email already exists");
      }
    }
  };

  // Verify BVN with backend and populate name/DOB on success
  const verifyBVN = async (bvn: string) => {
    if (bvn.length < 11) {
      setBvnStatus('idle');
      setBvnError('');
      return;
    }

    setBvnStatus('verifying');
    setBvnError('');

    try {
      const response = await fetch('/api/proxy/user/verification/verify/bvn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: bvn }),
      });

      const result = await response.json();

      if (response.ok && (result.status === 'VERIFIED' || result.verified)) {
        setBvnStatus('success');
        // Attempt to extract names and birthdate from response
        const r: any = result;
        const first = r.data?.firstName ?? r.firstName ?? r.first_name ?? '';
        const last = r.data?.lastName ?? r.lastName ?? r.last_name ?? '';
        const dob = r.data?.birthdate ?? r.birthdate ?? r.dateOfBirth ?? r.dob ?? '';
        setFormData((prev) => ({ ...prev, firstName: first || prev.firstName, lastName: last || prev.lastName, dateOfBirth: dob || prev.dateOfBirth }));
      } else {
        setBvnStatus('error');
        setBvnError(result.message || 'BVN verification failed');
      }
    } catch (err) {
      console.error('BVN verification error:', err);
      setBvnStatus('error');
      setBvnError('BVN verification failed');
    }
  };

  // Verify NIN with backend and populate DOB on success
  const verifyNIN = async (nin: string) => {
    if (nin.length < 11) {
      setNinStatus('idle');
      setNinError('');
      return;
    }

    setNinStatus('verifying');
    setNinError('');

    try {
      const response = await fetch('/api/proxy/user/verification/verify/nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: nin }),
      });

      const result = await response.json();

      if (response.ok && (result.status === 'VERIFIED' || result.verified)) {
        setNinStatus('success');
        const r: any = result;
        const dob = r.data?.birthdate ?? r.birthdate ?? r.dateOfBirth ?? r.dob ?? '';
        setFormData((prev) => ({ ...prev, dateOfBirth: dob || prev.dateOfBirth }));
      } else {
        setNinStatus('error');
        setNinError(result.message || 'NIN verification failed');
      }
    } catch (err) {
      console.error('NIN verification error:', err);
      setNinStatus('error');
      setNinError('NIN verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onError("");

    if (!acceptTerms) {
      onError("Please accept the Terms and Privacy Policy");
      setLoading(false);
      return;
    }

    if (rcVerificationStatus !== 'success') {
      onError("Please wait for RC/BN Number verification to complete");
      setLoading(false);
      return;
    }

    // Require first and last name
    if (!formData.firstName || !formData.firstName.trim() || !formData.lastName || !formData.lastName.trim()) {
      onError("Please provide both first name and last name");
      setLoading(false);
      return;
    }

    if (bvnStatus !== 'success') {
      onError('Please verify BVN before continuing');
      setLoading(false);
      return;
    }

    if (ninStatus !== 'success') {
      onError('Please verify NIN before continuing');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      onError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      onError(
        "Password must be at least 8 characters and include a symbol, uppercase/lowercase",
      );
      setLoading(false);
      return;
    }

    if (emailError) {
      onError("Please resolve the email issue before continuing");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        bvn: formData.bvn,
        nin: formData.nin,
        emailAddress: formData.email,
        password: formData.password,
        rcNumber: `${rcType}${formData.rcNumber}`,
      };

      console.log('Corporate Signup Payload:', { ...payload, password: '***' });

      const response = await fetch("/api/auth/omora-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "An error occurred during sign up");
        setLoading(false);
      } else if (result.requiresOtp) {
        setShowOtpModal(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Signup error:", error);
      onError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) {
      onError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    onError("");

    try {
      const response = await fetch("/api/auth/omora-signup-complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: formData.email,
          otp: otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "Invalid verification code");
        setLoading(false);
      } else {
        router.push("/auth/login?message=Account created successfully");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      onError("An error occurred during verification");
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    onError("");

    try {
      const response = await fetch("/api/auth/omora-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth,
          bvn: formData.bvn,
          nin: formData.nin,
          emailAddress: formData.email,
          password: formData.password,
          rcNumber: `${rcType}${formData.rcNumber}`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        onError(result.error || "Failed to resend code");
      } else {
        setOtp("");
      }
    } catch (error) {
      onError("Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  // OTP Modal
  if (showOtpModal) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Enter Verification Code
          </h3>
          <p className="text-xs text-gray-600">
            We sent a 6-digit code to {formData.email}
          </p>
        </div>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-center text-sm tracking-widest"
          placeholder="000000"
          disabled={loading}
        />

        <button
          onClick={handleOtpSubmit}
          disabled={loading || otp.length !== 6}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-teal-600 hover:text-teal-500 font-medium"
            >
              {loading ? "Sending..." : "Resend"}
            </button>
          </p>
          <button
            onClick={() => {
              setShowOtpModal(false);
              setOtp("");
              onError("");
            }}
            className="text-sm text-gray-600 hover:text-gray-900 mt-2"
            disabled={loading}
          >
            ← Back to signup
          </button>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {/* First Name */}
      <div>
        <label
          htmlFor="firstName"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          required
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
          placeholder="Enter your first name"
          value={formData.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Last Name */}
      <div>
        <label
          htmlFor="lastName"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          required
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
          placeholder="Enter your last name"
          value={formData.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          disabled={loading}
        />
      </div>

      {/* RC Number with Dropdown */}
      <div>
        <label
          htmlFor="rcNumber"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          RC Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => setShowRcTypeDropdown(!showRcTypeDropdown)}
            className="absolute left-0 top-0 bottom-0 px-2 flex items-center space-x-1 text-gray-700 border-r border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors z-10 rounded-l-md"
            disabled={loading}
          >
            <FiChevronDown className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium">{rcType} -</span>
          </button>
          
          {/* Input */}
          <input
            id="rcNumber"
            type="text"
            required
            className={`w-full pl-16 pr-10 py-1.5 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs ${
              rcVerificationStatus === 'success' ? 'border-green-500 bg-green-50' :
              rcVerificationStatus === 'error' ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="1173476"
            value={formData.rcNumber}
            onChange={(e) => handleChange("rcNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
            disabled={loading}
          />

          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getStatusIcon()}
          </div>

          {/* Dropdown Menu */}
          {showRcTypeDropdown && (
            <>
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-20">
                <button
                  type="button"
                  onClick={() => handleRcTypeChange('RC')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors rounded-t-md"
                >
                  RC
                </button>
                <button
                  type="button"
                  onClick={() => handleRcTypeChange('BN')}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 transition-colors rounded-b-md"
                >
                  BN
                </button>
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowRcTypeDropdown(false)}
              />
            </>
          )}
        </div>
        {rcVerificationError && (
          <p className="text-xs text-red-500 mt-1">{rcVerificationError}</p>
        )}
      </div>

      {/* Business Name */}
      <div>
        <label
          htmlFor="businessName"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          className={`w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs ${
            rcVerificationStatus === 'success' ? 'bg-green-50' : 'bg-gray-50'
          }`}
          placeholder="Will be auto-populated"
          value={formData.businessName}
          readOnly
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-0.5">
          {rcVerificationStatus === 'verifying' ? 'Verifying RC Number...' : 
           rcVerificationStatus === 'success' ? 'Verified ✓' :
           'Auto-populated based on RC Number'}
        </p>
      </div>

      {/* BVN */}
      <div>
        <label
          htmlFor="bvn"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          BVN (11 digits) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="bvn"
            type="text"
            maxLength={11}
            required
            className={`w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs ${bvnStatus === 'success' ? 'bg-green-50' : ''}`}
            placeholder="00000000000"
            value={formData.bvn}
            onChange={(e) => handleChange('bvn', e.target.value.replace(/\D/g, '').slice(0, 11))}
            onBlur={() => { if (formData.bvn.length === 11) verifyBVN(formData.bvn); }}
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{getBVNIcon()}</div>
        </div>
        {bvnError && <p className="text-xs text-red-500 mt-1">{bvnError}</p>}
      </div>

      {/* NIN */}
      <div>
        <label
          htmlFor="nin"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          NIN (11 digits) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="nin"
            type="text"
            maxLength={11}
            required
            className={`w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs ${ninStatus === 'success' ? 'bg-green-50' : ''}`}
            placeholder="00000000000"
            value={formData.nin}
            onChange={(e) => handleChange('nin', e.target.value.replace(/\D/g, '').slice(0, 11))}
            onBlur={() => { if (formData.nin.length === 11) verifyNIN(formData.nin); }}
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{getNINIcon()}</div>
        </div>
        {ninError && <p className="text-xs text-red-500 mt-1">{ninError}</p>}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={(e) => handleEmailBlur(e.target.value)}
          disabled={loading}
        />
        {emailError && (
          <p className="text-xs text-red-500 mt-0.5">{emailError}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <FiEye className="h-3 w-3 text-gray-400" />
            ) : (
              <FiEyeOff className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          8+ characters, symbol, uppercase/lowercase
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-xs font-medium text-gray-700 mb-1"
        >
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            className="w-full px-2 py-1.5 pr-8 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 text-xs"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-2 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
              <FiEye className="h-3 w-3 text-gray-400" />
            ) : (
              <FiEyeOff className="h-3 w-3 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Terms and Privacy Policy */}
      <div className="flex items-start text-xs">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-3 w-3 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-0.5 mr-2 flex-shrink-0"
          disabled={loading}
        />
        <span className="text-gray-600">
          I accept the{" "}
          <Link href="/terms" className="text-teal-600 hover:text-teal-500">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-teal-600 hover:text-teal-500">
            Privacy Policy
          </Link>
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !acceptTerms || !!emailError || rcVerificationStatus !== 'success' || bvnStatus !== 'success' || ninStatus !== 'success'}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
      >
        {loading ? "Creating account..." : "Get started"}
      </button>
    </form>
  );
}