"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  user: any;
  business: any;
  wallets: any[];
  verification: any[];
  onboardingState: any;
}

interface UserContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  userData: null,
  loading: true,
  refreshUserData: async () => {},
});

export const useUserData = () => useContext(UserContext);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/api/v1/me');
      const result = await response.json();

      if (result.status === 'success' && result.data) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  return (
    <UserContext.Provider value={{ 
      userData, 
      loading, 
      refreshUserData: fetchUserData 
    }}>
      {children}
    </UserContext.Provider>
  );
}