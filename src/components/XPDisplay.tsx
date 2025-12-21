import { Zap, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPDisplayProps {
  xp: number;
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function XPDisplay({ xp, streak, size = 'md', showLabels = false }: XPDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm gap-3',
    md: 'text-base gap-4',
    lg: 'text-lg gap-5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn('flex items-center', sizeClasses[size])}>
      {/* XP Badge */}
      <div className="flex items-center gap-1.5 bg-xp/10 px-3 py-1.5 rounded-full">
        <Zap className={cn(iconSizes[size], 'text-xp fill-xp')} />
        <span className="font-bold text-xp">{xp.toLocaleString()}</span>
        {showLabels && <span className="text-xp/70 text-sm">XP</span>}
      </div>

      {/* Streak Badge */}
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        streak > 0 ? "bg-streak/10" : "bg-muted"
      )}>
        <Flame className={cn(
          iconSizes[size],
          streak > 0 ? 'text-streak fill-streak fire-pulse' : 'text-muted-foreground'
        )} />
        <span className={cn(
          'font-bold',
          streak > 0 ? 'text-streak' : 'text-muted-foreground'
        )}>
          {streak}
        </span>
        {showLabels && (
          <span className={cn(
            'text-sm',
            streak > 0 ? 'text-streak/70' : 'text-muted-foreground'
          )}>
            day{streak !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

interface XPGainProps {
  amount: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, onComplete }: XPGainProps) {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      onAnimationEnd={onComplete}
    >
      <div className="flex items-center gap-2 bg-xp text-xp-foreground px-6 py-3 rounded-2xl shadow-xl animate-bounce-in">
        <Zap className="w-8 h-8 fill-current" />
        <span className="text-2xl font-black">+{amount} XP</span>
      </div>
    </div>
  );
}
