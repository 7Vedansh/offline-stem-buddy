import { Check, ChevronRight, Lock, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Unit } from '@/lib/mockData';

interface UnitCardProps {
  unit: Unit;
  progress: number;
  isLocked: boolean;
  completedLessons: number;
  onClick: () => void;
}

export function UnitCard({ unit, progress, isLocked, completedLessons, onClick }: UnitCardProps) {
  const isComplete = progress === 100;

  return (
    <Card
      variant={isLocked ? 'default' : 'interactive'}
      className={cn(
        'relative overflow-hidden',
        isLocked && 'opacity-60',
        isComplete && 'border-secondary'
      )}
      onClick={isLocked ? undefined : onClick}
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div className={cn(
            'flex items-center justify-center w-14 h-14 rounded-2xl text-2xl shrink-0',
            isComplete ? 'bg-secondary text-secondary-foreground' :
            isLocked ? 'bg-muted' :
            'bg-primary-light'
          )}>
            {isComplete ? (
              <Check className="w-7 h-7" />
            ) : isLocked ? (
              <Lock className="w-6 h-6 text-muted-foreground" />
            ) : (
              unit.icon
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Unit {unit.order}
              </span>
            </div>
            <h3 className={cn(
              'font-bold text-lg mt-0.5',
              isLocked && 'text-muted-foreground'
            )}>
              {unit.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {unit.description}
            </p>
          </div>

          {/* Arrow */}
          {!isLocked && (
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
        </div>

        {/* Progress Section */}
        {!isLocked && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{completedLessons}/{unit.lessonsCount} lessons</span>
              </div>
              <span className={cn(
                'text-sm font-medium',
                isComplete ? 'text-secondary' : 'text-primary'
              )}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              variant={isComplete ? 'success' : 'default'}
              className="h-2"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
