'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function TokenSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.accessToken) {
      console.log('Token available in session (not persisted).');
    } else {
      console.log('No session token available.');
    }
  }, [session, status]);

  return null;
}

export default TokenSync;