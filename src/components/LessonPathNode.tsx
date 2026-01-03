import { Check, Lock, Play, Star, FastForward } from 'lucide-react';
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
    <div className={cn(
      'flex flex-col items-center relative',
      position === 'left' && 'mr-auto ml-12',
      position === 'right' && 'ml-auto mr-12',
      position === 'center' && 'mx-auto'
    )}>
      {/* Jump here tooltip for current lesson */}
      {isCurrent && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border-2 border-primary rounded-xl px-3 py-1.5 shadow-md whitespace-nowrap z-10">
          <span className="text-primary font-bold text-sm">START</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-primary rotate-45" />
        </div>
      )}
      
      {/* Main circular button */}
      <button
        onClick={isLocked ? undefined : onClick}
        disabled={isLocked}
        className={cn(
          'relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg',
          // Completed state
          isCompleted && 'bg-secondary hover:scale-105',
          // Locked state
          isLocked && 'bg-muted/80 cursor-not-allowed',
          // Current state - primary color with glow
          isCurrent && 'bg-primary hover:scale-105 shadow-primary/40 shadow-xl animate-pulse',
          // Available but not current
          !isCompleted && !isLocked && !isCurrent && 'bg-muted hover:bg-muted/80 hover:scale-105',
          // Bottom shadow effect for 3D look
          'before:absolute before:inset-0 before:rounded-full before:shadow-[inset_0_-4px_0_rgba(0,0,0,0.15)]'
        )}
      >
        {/* Icon */}
        {isCompleted ? (
          <Check className="w-8 h-8 text-white" strokeWidth={3} />
        ) : isLocked ? (
          <Lock className="w-7 h-7 text-muted-foreground" />
        ) : isCurrent ? (
          <FastForward className="w-8 h-8 text-white" />
        ) : (
          <Star className="w-7 h-7 text-muted-foreground" />
        )}
      </button>
      
      {/* Lesson title (show for current or completed) */}
      {(isCurrent || isCompleted) && (
        <p className={cn(
          'mt-2 text-xs font-semibold text-center max-w-20 truncate',
          isCompleted ? 'text-secondary' : 'text-primary'
        )}>
          {lesson.title}
        </p>
      )}
    </div>
  );
}
