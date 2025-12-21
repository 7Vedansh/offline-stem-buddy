import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { XPDisplay } from '@/components/XPDisplay';
import { UnitCard } from '@/components/UnitCard';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getSubjectById, getUnitsBySubject } from '@/lib/mockData';

export default function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { progress, isLessonCompleted } = useUserProgress();

  const subject = getSubjectById(subjectId || '');
  const units = getUnitsBySubject(subjectId || '');

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Subject not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go back</Button>
        </div>
      </div>
    );
  }

  // Calculate unit progress
  const getUnitProgress = (unitId: string) => {
    const unitLessons = progress.completedLessons.filter(l => l.startsWith(unitId.split('-')[1]));
    const totalLessons = units.find(u => u.id === unitId)?.lessonsCount || 5;
    return Math.min((unitLessons.length / totalLessons) * 100, 100);
  };

  const getCompletedLessonsCount = (unitId: string) => {
    return progress.completedLessons.filter(l => l.includes(unitId.split('-')[1])).length;
  };

  // Overall subject progress
  const totalLessons = units.reduce((acc, u) => acc + u.lessonsCount, 0);
  const completedLessons = progress.completedLessons.filter(
    l => l.includes(subjectId?.slice(0, 4) || '')
  ).length;
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <OfflineIndicator />
          <XPDisplay xp={progress.xp} streak={progress.streak} size="sm" />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Subject Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary-light flex items-center justify-center text-4xl mb-4">
            {subject.icon}
          </div>
          <h1 className="text-2xl font-black mb-1">{subject.name}</h1>
          <p className="text-muted-foreground">{subject.description}</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="font-medium">Overall Progress</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        {/* Units List */}
        <section>
          <h2 className="text-lg font-bold mb-4">Units</h2>
          <div className="space-y-4">
            {units.map((unit, index) => {
              // First unit is always unlocked, others require previous unit completion
              const previousUnit = units[index - 1];
              const isLocked = index > 0 && getUnitProgress(previousUnit?.id || '') < 100;
              
              return (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  progress={getUnitProgress(unit.id)}
                  isLocked={isLocked}
                  completedLessons={getCompletedLessonsCount(unit.id)}
                  onClick={() => navigate(`/subject/${subjectId}/unit/${unit.id}`)}
                />
              );
            })}
          </div>
        </section>

        {/* Empty state for subjects without units */}
        {units.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold mb-2">Coming Soon!</h3>
            <p className="text-muted-foreground">
              Units for this subject are being prepared.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
