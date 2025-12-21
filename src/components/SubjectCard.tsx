import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Subject } from '@/lib/mockData';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  onClick: () => void;
}

export function SubjectCard({ subject, progress, onClick }: SubjectCardProps) {
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    primary: {
      bg: 'bg-primary-light',
      border: 'border-primary/20',
      text: 'text-primary',
    },
    secondary: {
      bg: 'bg-secondary-light',
      border: 'border-secondary/20',
      text: 'text-secondary',
    },
    accent: {
      bg: 'bg-accent-light',
      border: 'border-accent/20',
      text: 'text-accent',
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/20',
      text: 'text-success',
    },
  };

  const colors = colorClasses[subject.color] || colorClasses.primary;

  return (
    <Card
      variant="interactive"
      className={cn('overflow-hidden', colors.border)}
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={cn(
            'flex items-center justify-center w-14 h-14 rounded-2xl text-3xl shrink-0',
            colors.bg
          )}>
            {subject.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg">{subject.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {subject.description}
            </p>
            
            {/* Progress */}
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  {subject.unitsCount} units
                </span>
                <span className={cn('font-medium', colors.text)}>
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
