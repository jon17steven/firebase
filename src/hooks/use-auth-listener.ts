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
    // This is a mock implementation detail for the placeholder auth
    const handleMockSignOut = () => {
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('mockAuthSignOut', handleMockSignOut);

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

    // Simulate initial auth state for development without full Firebase setup
    // Remove this block when using real Firebase
    if (process.env.NODE_ENV === 'development' && !user && loading) {
      const mockUser = null; // Set to a mock user object to test authenticated state
      // const mockUser = { uid: 'test-uid', email: 'test@example.com', displayName: 'Test User', isAdmin: false };
      // const mockAdminUser = { uid: 'admin-uid', email: ADMIN_EMAIL, displayName: 'Admin User', isAdmin: true };
      // setUser(mockUser); // Or mockAdminUser
      // setLoading(false);
    }


    return () => {
      unsubscribe();
      window.removeEventListener('mockAuthSignOut', handleMockSignOut);
    };
  }, []);

  return { user, loading };
}
