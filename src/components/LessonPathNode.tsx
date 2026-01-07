import { Check, Lock, FastForward, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/mockData';

interface LessonPathNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  index: number;
  onClick: () => void;
}

export function LessonPathNode({ lesson, isCompleted, isLocked, isCurrent, index, onClick }: LessonPathNodeProps) {
  // Create a zigzag pattern for positioning
  const positions = ['center', 'right', 'center', 'left', 'center'];
  const position = positions[index % positions.length];
  
  return (
    <motion.div 
      className={cn(
        'flex flex-col items-center relative',
        position === 'left' && 'mr-auto ml-14',
        position === 'right' && 'ml-auto mr-14',
        position === 'center' && 'mx-auto'
      )}
      initial={{ opacity: 0, scale: 0.5, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 320,
        damping: 22
      }}
    >
      {/* Jump here tooltip for current lesson */}
      {isCurrent && (
        <motion.div 
          className="absolute -top-11 left-1/2 -translate-x-1/2 bg-card border-2 border-primary rounded-2xl px-4 py-2 shadow-lg shadow-primary/10 whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.35, type: "spring", stiffness: 350, damping: 20 }}
        >
          <span className="text-primary font-bold text-sm tracking-wide">START</span>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r-2 border-b-2 border-primary rotate-45" />
        </motion.div>
      )}
      
      {/* Main circular button */}
      <motion.button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={cn(
          'relative w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center transition-colors duration-300',
          // Completed state - vibrant secondary
          isCompleted && 'bg-secondary shadow-md',
          // Locked state
          isLocked && 'bg-muted cursor-not-allowed lock-hover',
          // Current state - primary color with glow
          isCurrent && 'gradient-primary glow-pulse',
          // Available but not current
          !isCompleted && !isLocked && !isCurrent && 'bg-muted shadow-sm',
          // Bottom shadow effect for 3D look
          'before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_-5px_0_rgba(0,0,0,0.12)]'
        )}
        whileHover={!isLocked ? { 
          scale: 1.1,
          boxShadow: isCompleted 
            ? '0 8px 24px hsl(200 90% 52% / 0.35)' 
            : isCurrent 
              ? '0 12px 32px hsl(145 72% 44% / 0.4)' 
              : '0 8px 20px rgba(0,0,0,0.12)'
        } : {}}
        whileTap={!isLocked ? { scale: 0.94 } : {}}
        transition={{ type: "spring", stiffness: 450, damping: 18 }}
      >
        {/* Icon with animation */}
        <motion.div
          initial={isCompleted ? { scale: 0, rotate: -45 } : {}}
          animate={isCompleted ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.15 }}
        >
          {isCompleted ? (
            <Check className="w-9 h-9 text-white drop-shadow-sm" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="w-7 h-7 text-muted-foreground/70" />
          ) : isCurrent ? (
            <FastForward className="w-9 h-9 text-white drop-shadow-sm" />
          ) : (
            <Star className="w-7 h-7 text-muted-foreground/70" />
          )}
        </motion.div>
      </motion.button>
      
      {/* Lesson title (show for current or completed) */}
      {(isCurrent || isCompleted) && (
        <motion.p 
          className={cn(
            'mt-3 text-xs font-bold text-center max-w-24 truncate tracking-wide',
            isCompleted ? 'text-secondary' : 'text-primary'
          )}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.25, ease: "easeOut" }}
        >
          {lesson.title}
        </motion.p>
      )}
    </motion.div>
  );
}