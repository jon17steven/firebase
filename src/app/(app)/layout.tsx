'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Bell } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { UserNav } from '@/components/user-nav';
import { MainNav } from '@/components/main-nav';
import { useAuthContext } from '@/components/providers/auth-provider';
import LoadingSpinner from '@/components/loading-spinner';
import { ADMIN_EMAIL } from '@/lib/constants';


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    // Redirect non-admins trying to access admin paths (precaution, main check in admin layout)
    if (!loading && user && !user.isAdmin && pathname.startsWith('/admin')) {
        router.replace('/dashboard');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    // This should ideally not be reached if useEffect redirect works, but as a fallback.
    return <LoadingSpinner fullScreen />;
  }
  
  // If user is admin and trying to access non-admin app routes, allow.
  // If user is not admin and tries to access admin routes, they should be blocked by (admin)/layout.tsx

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
            <AppLogo />
          </div>
          <div className="flex-1 overflow-auto py-2">
            <MainNav className="px-2 text-sm font-medium lg:px-4" />
          </div>
          {/* Optional: Sidebar footer content */}
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir/cerrar menú de navegación</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-sidebar p-0">
              <div className="flex h-14 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
                 <AppLogo />
              </div>
              <MainNav className="p-4" />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Optional: Breadcrumbs or page title */}
          </div>
          {/* <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Alternar notificaciones</span>
          </Button> */}
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
