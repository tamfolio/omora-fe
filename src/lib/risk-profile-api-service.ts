// Risk Profile API Service for Omora - ACTUAL STRUCTURE

export interface RiskProfileAnswer {
  id: number;
  body: string;
  riskPoints: number; // 3-7 scale
}

export interface RiskProfileQuestion {
  id: number;
  body: string; // The question text
  answers: RiskProfileAnswer[]; // Array of possible answers
}

export interface RiskProfileType {
  name: 'Low' | 'Balanced' | 'High';
  value: number; // 3, 5, or 7
}

export interface RiskProfileRecommendation {
  profile: 'Low' | 'Balanced' | 'High';
  description?: string;
  riskPointsAvg?: number;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'failed' | 'error';
  statusCode: string;
  message: string;
  data: T;
}

const API_BASE_URL = '/api/proxy';

const makeAuthenticatedRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
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

    if (!response.ok || data.status === 'failed') {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data as T;
  } catch (error) {
    throw error;
  }
};

/**
 * GET /risk-profile/api/v1/profiles
 * Get risk profile types (Low, Balanced, High)
 */
export const getRiskProfileTypes = async (): Promise<ApiResponse<RiskProfileType[]>> => {
  return makeAuthenticatedRequest<ApiResponse<RiskProfileType[]>>(
    '/risk-profile/api/v1/profiles',
    'GET'
  );
};

/**
 * GET /risk-profile/api/v1/questions
 * Get all questions with their answers and risk points
 */
export const getRiskProfileQuestions = async (): Promise<ApiResponse<RiskProfileQuestion[]>> => {
  return makeAuthenticatedRequest<ApiResponse<RiskProfileQuestion[]>>(
    '/risk-profile/api/v1/questions',
    'GET'
  );
};

/**
 * POST /risk-profile/api/v1/recommendations
 * Submit average risk points (3-7) to get recommended profile
 */
export const getRiskProfileRecommendation = async (
  riskPointsAvg: number
): Promise<ApiResponse<RiskProfileRecommendation>> => {
  if (riskPointsAvg < 3 || riskPointsAvg > 7) {
    throw new Error('RiskPointsAvg must be between 3 - 7');
  }

  return makeAuthenticatedRequest<ApiResponse<RiskProfileRecommendation>>(
    '/risk-profile/api/v1/recommendations',
    'POST',
    { RiskPointsAvg: riskPointsAvg }
  );
};

/**
 * POST /risk-profile/api/v1/ping
 * Health check endpoint
 */
export const pingRiskProfile = async (): Promise<ApiResponse<null>> => {
  return makeAuthenticatedRequest<ApiResponse<null>>(
    '/risk-profile/api/v1/ping',
    'POST'
  );
};

/**
 * Helper: Calculate average risk points from selected answer IDs
 */
export const calculateRiskPointsAverage = (
  questions: RiskProfileQuestion[],
  selectedAnswerIds: Record<number, number> // questionId -> answerId
): number => {
  let totalPoints = 0;
  let count = 0;

  questions.forEach((question) => {
    const selectedAnswerId = selectedAnswerIds[question.id];
    if (selectedAnswerId) {
      const answer = question.answers.find((a) => a.id === selectedAnswerId);
      if (answer) {
        totalPoints += answer.riskPoints;
        count++;
      }
    }
  });

  return count > 0 ? totalPoints / count : 0;
};

/**
 * Helper: Map recommendation to user-friendly profile
 */
export const mapProfileToUserFriendly = (
  profile: 'Low' | 'Balanced' | 'High'
): 'conservative' | 'balanced' | 'aggressive' => {
  switch (profile) {
    case 'Low':
      return 'conservative';
    case 'Balanced':
      return 'balanced';
    case 'High':
      return 'aggressive';
    default:
      return 'balanced';
  }
};

const riskProfileApiService = {
  getRiskProfileTypes,
  getRiskProfileQuestions,
  getRiskProfileRecommendation,
  pingRiskProfile,
  calculateRiskPointsAverage,
  mapProfileToUserFriendly,
};

export default riskProfileApiService;