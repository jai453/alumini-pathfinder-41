import { GraduationCap } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
        <div className="relative bg-gradient-primary p-2 rounded-xl">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      {showText && (
        <span className="font-display font-bold text-xl tracking-tight">
          Alumino
        </span>
      )}
    </div>
  );
}
