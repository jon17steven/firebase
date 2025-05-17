'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingSpinner({ size = 48, fullScreen = false, className }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
        <Loader2 className={cn("animate-spin text-primary", className)} size={size} />
      </div>
    );
  }
  return <Loader2 className={cn("animate-spin text-primary", className)} size={size} />;
}
