import { Zap, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface XPDisplayProps {
  xp: number;
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function XPDisplay({ xp, streak, size = 'md', showLabels = false }: XPDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm gap-2.5',
    md: 'text-base gap-3.5',
    lg: 'text-lg gap-4',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const badgeSizes = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5',
  };

  return (
    <div className={cn('flex items-center', sizeClasses[size])}>
      {/* XP Badge */}
      <motion.div 
        className={cn(
          "flex items-center gap-1.5 bg-xp/12 rounded-full shadow-xs",
          badgeSizes[size]
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Zap className={cn(iconSizes[size], 'text-xp fill-xp drop-shadow-sm')} />
        <span className="font-bold text-xp">{xp.toLocaleString()}</span>
        {showLabels && <span className="text-xp/75 text-sm font-medium">XP</span>}
      </motion.div>

      {/* Streak Badge */}
      <motion.div 
        className={cn(
          "flex items-center gap-1.5 rounded-full shadow-xs",
          badgeSizes[size],
          streak > 0 ? "bg-streak/12" : "bg-muted"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Flame className={cn(
          iconSizes[size],
          streak > 0 ? 'text-streak fill-streak fire-pulse drop-shadow-sm' : 'text-muted-foreground'
        )} />
        <span className={cn(
          'font-bold',
          streak > 0 ? 'text-streak' : 'text-muted-foreground'
        )}>
          {streak}
        </span>
        {showLabels && (
          <span className={cn(
            'text-sm font-medium',
            streak > 0 ? 'text-streak/75' : 'text-muted-foreground'
          )}>
            day{streak !== 1 ? 's' : ''}
          </span>
        )}
      </motion.div>
    </div>
  );
}

interface XPGainProps {
  amount: number;
  onComplete?: () => void;
}

export function XPGainAnimation({ amount, onComplete }: XPGainProps) {
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        className="flex items-center gap-2.5 gradient-warm text-white px-8 py-4 rounded-3xl shadow-xl"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Zap className="w-9 h-9 fill-current drop-shadow-sm" />
        <span className="text-2xl font-extrabold tracking-tight">+{amount} XP</span>
      </motion.div>
    </motion.div>
  );
}