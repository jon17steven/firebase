'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/components/providers/auth-provider';
import LoadingSpinner from '@/components/loading-spinner';
import AppLayout from '@/app/(app)/layout'; // Reuse the AppLayout structure

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!user.isAdmin) {
        // User is logged in but not an admin
        router.replace('/dashboard'); // Or an unauthorized page
      }
      // If user is admin, they can proceed.
      // If they are admin and on /admin/* routes, AppLayout will show admin sidebar items.
    }
  }, [user, loading, router, pathname]);

  if (loading || (!loading && !user?.isAdmin && pathname.startsWith('/admin'))) {
     // Show loading or if redirecting, this prevents flicker of admin content
    return <LoadingSpinner fullScreen />;
  }
  
  if (!user) { 
    // Should be caught by useEffect, but as a fallback
    return <LoadingSpinner fullScreen />;
  }

  // User is admin, render the standard app layout which will adapt
  return <AppLayout>{children}</AppLayout>;
}
