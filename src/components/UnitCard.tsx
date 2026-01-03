import { Check, ChevronRight, Lock, BookOpen } from 'lucide-react';
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
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      className={cn(
        'w-full text-left rounded-2xl p-4 transition-all duration-200 shadow-md',
        isLocked && 'opacity-60 cursor-not-allowed bg-muted',
        isComplete && 'bg-secondary text-white',
        !isLocked && !isComplete && 'bg-primary text-white hover:scale-[1.02] hover:shadow-lg'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold opacity-80 uppercase tracking-wide">
              Unit {unit.order}
            </span>
            {isComplete && <Check className="w-4 h-4" />}
            {isLocked && <Lock className="w-4 h-4" />}
          </div>
          <h3 className="font-black text-lg">{unit.name}</h3>
          <p className="text-sm opacity-80 line-clamp-1 mt-0.5">{unit.description}</p>
        </div>
        
        {!isLocked && (
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-bold">GUIDEBOOK</span>
            </div>
          </div>
        )}
      </div>

      {/* Progress bar for incomplete units */}
      {!isLocked && !isComplete && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center justify-between text-xs font-medium opacity-80 mb-1.5">
            <span>{completedLessons}/{unit.lessonsCount} lessons</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}
