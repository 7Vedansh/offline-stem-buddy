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
        position === 'left' && 'mr-auto ml-12',
        position === 'right' && 'ml-auto mr-12',
        position === 'center' && 'mx-auto'
      )}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {/* Jump here tooltip for current lesson */}
      {isCurrent && (
        <motion.div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-primary rounded-xl px-3 py-1.5 shadow-lg whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 300 }}
        >
          <span className="text-primary font-bold text-sm">START</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-primary rotate-45" />
        </motion.div>
      )}
      
      {/* Main circular button */}
      <motion.button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={cn(
          'relative w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200',
          // Completed state
          isCompleted && 'bg-secondary',
          // Locked state
          isLocked && 'bg-muted/80 cursor-not-allowed lock-hover',
          // Current state - primary color with glow
          isCurrent && 'bg-primary glow-pulse',
          // Available but not current
          !isCompleted && !isLocked && !isCurrent && 'bg-muted',
          // Bottom shadow effect for 3D look
          'before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]'
        )}
        whileHover={!isLocked ? { 
          scale: 1.1,
          boxShadow: isCompleted 
            ? '0 0 20px hsl(200 100% 50% / 0.4)' 
            : isCurrent 
              ? '0 0 24px hsl(106 76% 40% / 0.5)' 
              : '0 4px 12px rgba(0,0,0,0.15)'
        } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Icon with animation */}
        <motion.div
          initial={isCompleted ? { scale: 0 } : {}}
          animate={isCompleted ? { scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }}
        >
          {isCompleted ? (
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          ) : isLocked ? (
            <Lock className="w-7 h-7 text-muted-foreground" />
          ) : isCurrent ? (
            <FastForward className="w-8 h-8 text-white" />
          ) : (
            <Star className="w-7 h-7 text-muted-foreground" />
          )}
        </motion.div>
      </motion.button>
      
      {/* Lesson title (show for current or completed) */}
      {(isCurrent || isCompleted) && (
        <motion.p 
          className={cn(
            'mt-2 text-xs font-semibold text-center max-w-20 truncate',
            isCompleted ? 'text-secondary' : 'text-primary'
          )}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {lesson.title}
        </motion.p>
      )}
    </motion.div>
  );
}
