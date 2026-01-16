// TokenSync.tsx
// Place this component at the root of your app or in the KYC layout

'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function TokenSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    // Secure approach: do NOT persist tokens in localStorage.
    // Proxy reads the token server-side from next-auth cookie.
    if (session?.accessToken) {
      console.log('Token available in session (not persisted).');
    } else {
      console.log('No session token available.');
    }
  }, [session, status]);

  return null;
}

export default TokenSync;