// KYC API Service Module
import { apiFetch } from './apiService';

export interface ApiResponse<T = any> {
  status?: 'success' | 'failed' | 'fail' | 'error' | string;
  statusCode?: string;
  message?: string;
  data?: T;
  reference?: string;
  url?: string;
  verificationUrl?: string;
}

export interface LivenessCheckInitiateRequest {
  dob: string;
  gender: 'MALE' | 'FEMALE';
  idNumber: string;  
  employmentStatus?: string;
  pep?: string;
}

export interface LivenessCheckInitiateResponse {
  data: {
    reference: string;
  };
  status: string;
  statusCode: string;
  message?: string;
}

// NEW: Verification Response Types
export interface VerificationResponse {
  status: 'VERIFIED' | 'FAILED';
  message: string | null;
  gender?: string;
  birthdate?: string;
}

export interface VerifyIdRequest {
  idNumber: string;
}

// NEW: User Data Types
export interface UserData {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    mobileNumber: string;
    gender: string | null;
    sex: string | null;
    address: string;
    username: string;
    middleName: string | null;
    state: string;
    dateOfBirth: string;
    city: string;
    country: string | null;
    role: string;
    onboardingState: any;
  };
  business?: {
    businessId: number;
    businessName: string | null;
    registrationNumber: string | null;
    taxNumber: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    status: string | null;
    statusId: number;
  };
  verification: Array<{
    id: number;
    type: string;
    value: string;
    status: string;
    remarks: string;
    verificationReference: string;
    expiryDate: string | null;
  }>;
  onboardingState: {
    progress: number;
    nextStep: string;
    currentStep: string;
    currentStepStatus: string;
  };
}

export type PersonalInformationData = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: 'MALE' | 'FEMALE' | string;
  bvn?: string;
  nin?: string;
  [key: string]: any;
};

export type PersonalContactInformationData = {
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  [key: string]: any;
};

export type BusinessInformationData = {
  businessName?: string;
  rcNumber?: string;
  businessType?: string;
  businessAddress?: string;
  taxIdentificationNumber?: string;
  [key: string]: any;
};

export type DirectorInformationData = {
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  email?: string;
  [key: string]: any;
};

export interface AcceptTermsData {
  accepted: boolean;
}

// NEW: Get User Data
export const getUserKycStatus = async (): Promise<ApiResponse<UserData>> => {
  return await apiFetch('/user/api/v1/me', { method: 'GET' }); 
};


// NEW: Verify NIN
export const verifyNIN = async (idNumber: string): Promise<VerificationResponse> => {
  return await apiFetch('/user/verification/verify/nin', {
    method: 'POST',
    body: JSON.stringify({ idNumber }),
  }); 
};
// NEW: Verify BVN
export const verifyBVN = async (idNumber: string): Promise<VerificationResponse> => {
  return await apiFetch('/user/verification/verify/bvn', {
    method: 'POST',
    body: JSON.stringify({ idNumber }),
  });
};

export const submitPersonalInformation = async (
  data: PersonalInformationData
): Promise<ApiResponse> => {
  return await apiFetch('/user/api/v1/onboarding/personal/information', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
};

export const submitPersonalContactInformation = async (
  data: PersonalContactInformationData
): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/personal/contact/information', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
};

export const initiateLivenessCheck = async (
  data: LivenessCheckInitiateRequest
): Promise<LivenessCheckInitiateResponse> => {
  return await apiFetch('/user/verification/initiate/liveness', {
    method: 'POST',
    body: JSON.stringify(data),
  }); // Removed .json()
};

export const submitBusinessInformation = async (
  data: BusinessInformationData
): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/business/information', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
};

export const submitDirectorInformation = async (
  data: DirectorInformationData
): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/contact/information', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
};

export interface CompanyRegistrationData {
  CertOfIncorporation?: File;
  StatusExtract?: File;
  AuthorizationLetter?: File;
  DirectorsIdentification?: File[];
  ProofOfAddress?: File[];
}

// Make multipart request for file uploads
const makeMultipartRequest = async (
  endpoint: string,
  formData: FormData
): Promise<ApiResponse> => {
 return await apiFetch(endpoint, {
    method: 'POST',
    body: formData,
    headers: {}, // Let browser set Content-Type with boundary for multipart
  });
  
};

// Submit Company Registration Documents (5 FIELDS ONLY)
export const submitCompanyRegistration = async (
  data: CompanyRegistrationData
): Promise<ApiResponse> => {
  const formData = new FormData();

  if (data.CertOfIncorporation) {
    formData.append('CertOfIncorporation', data.CertOfIncorporation);
  }

  if (data.StatusExtract) {
    formData.append('StatusExtract', data.StatusExtract);
  }

  if (data.AuthorizationLetter) {
    formData.append('AuthorizationLetter', data.AuthorizationLetter);
  }

  if (data.DirectorsIdentification && data.DirectorsIdentification.length > 0) {
    data.DirectorsIdentification.forEach(file => {
      formData.append('DirectorsIdentification', file);
    });
  }

  if (data.ProofOfAddress && data.ProofOfAddress.length > 0) {
    data.ProofOfAddress.forEach(file => {
      formData.append('ProofOfAddress', file);
    });
  }

  return makeMultipartRequest('/user/api/v1/onboarding/business/registration/add-or-update', formData);
};

export const acceptTerms = async (
  data: AcceptTermsData
): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/accept/terms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
};

export const getOnboardingPercentage = async (): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/percentage', {
    method: 'GET',
  });
  
};

export const viewBusinessRegistration = async (): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/business/registration/view', {
    method: 'GET',
  });
  
};

export const viewBusinessInformation = async (): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/business/information/view', {
    method: 'GET',
  });
  
};

export const viewPersonalInformation = async (): Promise<ApiResponse> => {
 return await apiFetch('/user/api/v1/onboarding/personal/information/view', {
    method: 'GET',
  });
  
};

export const verificationPing = async (): Promise<ApiResponse> => {
 return await apiFetch('/user/verification/ping', {
    method: 'GET',
  });
  
};

export const formatDateForAPI = (date: Date | string): string => {
  if (typeof date === 'string') return date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const validateBVN = (bvn: string): boolean => /^\d{11}$/.test(bvn);
export const validateNIN = (nin: string): boolean => /^\d{11}$/.test(nin);

// NEW: Check if both NIN and BVN are verified
export const checkVerificationStatus = (verifications: Array<{type: string; status: string}>): {
  ninVerified: boolean;
  bvnVerified: boolean;
  bothVerified: boolean;
} => {
  const ninVerified = verifications.some(v => v.type === 'NIN' && v.status === 'C');
  const bvnVerified = verifications.some(v => v.type === 'BVN' && v.status === 'C');
  
  return {
    ninVerified,
    bvnVerified,
    bothVerified: ninVerified && bvnVerified
  };
};

export class KYCAPIError extends Error {
  statusCode?: string;
  constructor(message: string, statusCode?: string) {
    super(message);
    this.name = 'KYCAPIError';
    this.statusCode = statusCode;
  }
}

export const handleAPIError = (error: any): string => {
  if (error instanceof KYCAPIError) return error.message;
  return error.message || 'An unexpected error occurred. Please try again.';
};

const kycApiService = {
  getUserKycStatus,
  verifyNIN,
  verifyBVN,
  submitPersonalInformation,
  submitPersonalContactInformation,
  initiateLivenessCheck,
  submitBusinessInformation,
  submitDirectorInformation,
  submitCompanyRegistration,
  acceptTerms,
  getOnboardingPercentage,
  viewBusinessRegistration,
  viewBusinessInformation,
  viewPersonalInformation,
  verificationPing,
  formatDateForAPI,
  validateBVN,
  validateNIN,
  checkVerificationStatus,
  handleAPIError,
};

export default kycApiService;