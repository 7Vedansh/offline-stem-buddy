import { Check, Lock, Play, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/lib/mockData';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export function LessonCard({ lesson, isCompleted, isLocked, isCurrent, onClick }: LessonCardProps) {
  return (
    <Card
      variant={isLocked ? 'default' : 'interactive'}
      className={cn(
        'relative overflow-hidden',
        isLocked && 'opacity-60',
        isCompleted && 'border-secondary',
        isCurrent && 'ring-2 ring-primary ring-offset-2 pulse-ring'
      )}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Status Icon */}
        <div className={cn(
          'flex items-center justify-center w-12 h-12 rounded-xl shrink-0',
          isCompleted ? 'bg-secondary text-secondary-foreground' :
          isLocked ? 'bg-muted text-muted-foreground' :
          isCurrent ? 'bg-primary text-primary-foreground' :
          'bg-primary-light text-primary'
        )}>
          {isCompleted ? (
            <Check className="w-6 h-6" />
          ) : isLocked ? (
            <Lock className="w-5 h-5" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-bold truncate',
            isLocked && 'text-muted-foreground'
          )}>
            {lesson.title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {lesson.description}
          </p>
          
          {/* Meta info */}
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {lesson.duration}
            </span>
            <span className="flex items-center gap-1 text-xs text-xp">
              <Zap className="w-3 h-3" />
              +{lesson.xpReward} XP
            </span>
          </div>
        </div>

        {/* Arrow indicator */}
        {!isLocked && !isCompleted && (
          <div className="text-muted-foreground">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Progress line for current */}
      {isCurrent && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
      )}
    </Card>
  );
}
