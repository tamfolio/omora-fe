import axios from "axios";

const API_BASE_URL = "/api/proxy/risk-profile/api/v1";

// 👇 UPDATED MAPPING based on your API response
const PROFILE_IDS: Record<string, number> = {
  conservative: 3, // Backend "Low"
  balanced: 5, // Backend "Balanced"
  aggressive: 7, // Backend "High"
};

export interface RiskProfileQuestion {
  id: number;
  body: string;
  answers: {
    id: number;
    body: string;
    riskPoints: number;
  }[];
}

const riskProfileApiService = {
  getRiskProfileQuestions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  calculateRiskPointsAverage: (
    questions: RiskProfileQuestion[],
    selectedAnswerIds: Record<number, number>,
  ): number => {
    let totalPoints = 0;
    let count = 0;

    questions.forEach((question) => {
      const selectedId = selectedAnswerIds[question.id];
      if (selectedId) {
        const answer = question.answers.find((a) => a.id === selectedId);
        if (answer) {
          totalPoints += answer.riskPoints;
          count++;
        }
      }
    });

    return count === 0 ? 0 : totalPoints / count;
  },

  getRiskProfileRecommendation: async (riskPointsAvg: number) => {
    try {
      const payload = { riskPointsAvg: riskPointsAvg };
      const response = await axios.post(
        `${API_BASE_URL}/recommendations`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error getting recommendation:", error);
      throw error;
    }
  },

  // 👇 THE SAVE FUNCTION
  saveRiskProfile: async (profileName: string) => {
    try {
      const normalizeName = profileName.toLowerCase();
      // 1. Get the ID (3, 5, or 7)
      const profileId = PROFILE_IDS[normalizeName];

      if (!profileId) {
        console.warn(
          `Unknown profile name: ${profileName}, defaulting to Balanced (5)`,
        );
      }

      // 2. Send the ID to the backend
      const payload = {
        riskProfile: profileId || 5,
      };

      // Points to your User Service via Proxy
      const response = await axios.post(
        "/api/proxy/user/api/v1/risk-profile",
        payload,
      );
      return response.data;
    } catch (error) {
      console.error("Error saving profile:", error);
      throw error;
    }
  },

  mapProfileToUserFriendly: (
    apiProfile: string,
  ): "conservative" | "balanced" | "aggressive" => {
    const normalize = apiProfile?.toLowerCase() || "";
    if (normalize.includes("conservative") || normalize.includes("low"))
      return "conservative";
    if (normalize.includes("aggressive") || normalize.includes("high"))
      return "aggressive";
    return "balanced";
  },
};

export default riskProfileApiService;
