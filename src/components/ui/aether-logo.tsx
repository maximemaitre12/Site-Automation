import { cn } from "@/lib/utils";
import aetherLogo from "@/assets/aether-logo-final.png";

interface AetherLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  xs: 'h-6 w-auto',
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-14 w-auto',
  xl: 'h-16 w-auto',
};

export function AetherLogo({ size = 'md', className }: AetherLogoProps) {
  return (
    <img 
      src={aetherLogo} 
      alt="AETHER" 
      className={cn(sizeClasses[size], 'object-contain', className)} 
    />
  );
}
