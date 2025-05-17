'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-listener'; // Will create this hook
import LoadingSpinner from '@/components/loading-spinner';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Check for admin role, simplified for now
        if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
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
