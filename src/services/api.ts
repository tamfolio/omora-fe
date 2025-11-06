const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.omora.africa';
const API_KEY = '6434754426732';

interface SignUpData {
  firstName: string;
  lastName: string;
  middleName?: string;
  emailAddress: string;
  password: string;
  rcNumber?: string; // For corporate accounts
}

interface SignUpCompleteData {
  emailAddress: string;
  otp: string;
}

interface SignInData {
  identifier: string; // email or username
  password: string;
}

interface SignInCompleteData {
  identifier: string;
  otp: string;
}

interface CreatePinData {
  pin: string;
}

class OmoraAPI {
  private token: string | null = null;

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    };

    // Merge any additional headers from options
    if (options.headers) {
      const optionHeaders = options.headers as Record<string, string>;
      Object.assign(headers, optionHeaders);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth Methods
  async signUp(userData: SignUpData) {
    return this.request('/user/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signUpComplete(data: SignUpCompleteData) {
    return this.request('/user/api/v1/sign-up/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signIn(credentials: SignInData) {
    return this.request('/user/api/v1/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signInComplete(data: SignInCompleteData) {
    const response = await this.request('/user/api/v1/sign-in/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Store token if returned
    if (response.token) {
      this.token = response.token;
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
      }
    }

    return response;
  }

  async createPin(pinData: CreatePinData) {
    return this.request('/user/api/v1/pin/create', {
      method: 'POST',
      body: JSON.stringify(pinData),
    });
  }

  async getMe() {
    return this.request('/user/api/v1/me', {
      method: 'GET',
    });
  }

  // Helper methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken() {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }
}

export default new OmoraAPI();