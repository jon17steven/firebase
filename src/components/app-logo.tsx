import { CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function AppLogo({ className, iconOnly = false }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <CheckSquare className="h-6 w-6" />
      {!iconOnly && <span className="text-xl font-semibold text-foreground">Trackit</span>}
    </div>
  );
}
