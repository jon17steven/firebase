'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-listener';
import LoadingSpinner from '@/components/loading-spinner';
import { ADMIN_EMAIL } from '@/lib/constants'; // Import ADMIN_EMAIL

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check for admin role
        if (user.email === ADMIN_EMAIL) { // Use imported ADMIN_EMAIL
           router.replace('/admin/dashboard');
        } else {
           router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return <LoadingSpinner fullScreen />;
}
