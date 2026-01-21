// KYC API Service Module

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

const API_BASE_URL = '/api/proxy';

const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: any
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data as T;
  } catch (error) {
    throw error;
  }
};

// NEW: Get User Data
export const getUserKycStatus = async (): Promise<ApiResponse<UserData>> => {
  return makeAuthenticatedRequest<ApiResponse<UserData>>('/user/api/v1/me', 'GET');
};

// NEW: Verify NIN
export const verifyNIN = async (idNumber: string): Promise<VerificationResponse> => {
  return makeAuthenticatedRequest<VerificationResponse>(
    '/user/verification/verify/nin',
    'POST',
    { idNumber }
  );
};

// NEW: Verify BVN
export const verifyBVN = async (idNumber: string): Promise<VerificationResponse> => {
  return makeAuthenticatedRequest<VerificationResponse>(
    '/user/verification/verify/bvn',
    'POST',
    { idNumber }
  );
};

export const submitPersonalInformation = async (
  data: PersonalInformationData
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/personal/information', 'POST', data);
};

export const submitPersonalContactInformation = async (
  data: PersonalContactInformationData
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/personal/contact/information', 'POST', data);
};

export const uploadDocument = async (
  file: File,
  documentType: string
): Promise<ApiResponse> => {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    status: 'success',
    statusCode: '200',
    message: 'Document uploaded successfully',
    data: { reference: `DOC-${Date.now()}` }
  };
};

export const initiateLivenessCheck = async (
  data: LivenessCheckInitiateRequest
): Promise<LivenessCheckInitiateResponse> => {
  return makeAuthenticatedRequest<LivenessCheckInitiateResponse>('/user/verification/initiate/liveness', 'POST', data);
};

export const submitBusinessInformation = async (
  data: BusinessInformationData
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/business/information', 'POST', data);
};

export const submitDirectorInformation = async (
  data: DirectorInformationData
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/contact/information', 'POST', data);
};

export const uploadCompanyDocument = async (
  file: File,
  documentType: string
): Promise<ApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    status: 'success',
    statusCode: '200',
    message: 'Company document uploaded successfully',
    data: { reference: `CORP-DOC-${Date.now()}` }
  };
};

export const acceptTerms = async (
  data: AcceptTermsData
): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/accept/terms', 'POST', data);
};

export const getOnboardingPercentage = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/percentage', 'GET');
};

export const viewBusinessRegistration = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/business/registration/view', 'GET');
};

export const viewBusinessInformation = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/business/information/view', 'GET');
};

export const viewPersonalInformation = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/api/v1/onboarding/personal/information/view', 'GET');
};

export const verificationPing = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest<ApiResponse>('/user/verification/ping', 'GET');
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
  uploadDocument,
  initiateLivenessCheck,
  submitBusinessInformation,
  submitDirectorInformation,
  uploadCompanyDocument,
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