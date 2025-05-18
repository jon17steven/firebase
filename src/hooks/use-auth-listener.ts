
'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase'; // Actual Firebase auth instance
import type { User as FirebaseUserType } from 'firebase/auth'; // Actual Firebase User type
import type { User } from '@/types';
import { ADMIN_EMAIL } from '@/lib/constants';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUserType | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: firebaseUser.email === ADMIN_EMAIL,
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return { user, loading };
}
