import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { Subject } from '@/lib/mockData';

interface SubjectCardProps {
  subject: Subject;
  progress: number;
  onClick: () => void;
}

export function SubjectCard({ subject, progress, onClick }: SubjectCardProps) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    primary: {
      bg: 'bg-primary-light',
      border: 'border-primary/15',
      text: 'text-primary',
      iconBg: 'bg-primary-light shadow-sm',
    },
    secondary: {
      bg: 'bg-secondary-light',
      border: 'border-secondary/15',
      text: 'text-secondary',
      iconBg: 'bg-secondary-light shadow-sm',
    },
    accent: {
      bg: 'bg-accent-light',
      border: 'border-accent/15',
      text: 'text-accent-foreground',
      iconBg: 'bg-accent-light shadow-sm',
    },
    success: {
      bg: 'bg-success/8',
      border: 'border-success/15',
      text: 'text-success',
      iconBg: 'bg-success/10 shadow-sm',
    },
  };

  const colors = colorClasses[subject.color] || colorClasses.primary;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 450, damping: 22 }}
    >
      <Card
        variant="interactive"
        className={cn('overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300')}
        onClick={onClick}
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              'flex items-center justify-center w-14 h-14 rounded-2xl text-3xl shrink-0',
              colors.iconBg
            )}>
              {subject.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg tracking-tight">{subject.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                {subject.description}
              </p>
              
              {/* Progress */}
              <div className="mt-3.5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">
                    {subject.unitsCount} units
                  </span>
                  <span className={cn('font-bold', colors.text)}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2.5" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}