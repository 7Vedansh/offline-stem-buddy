import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { XPDisplay } from '@/components/XPDisplay';
import { LessonCard } from '@/components/LessonCard';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getUnitById, getLessonsByUnit } from '@/lib/mockData';

export default function UnitPage() {
  const { subjectId, unitId } = useParams<{ subjectId: string; unitId: string }>();
  const navigate = useNavigate();
  const { progress, isLessonCompleted } = useUserProgress();

  const unit = getUnitById(unitId || '');
  const lessons = getLessonsByUnit(unitId || '');

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Unit not found</h2>
          <Button onClick={() => navigate(`/subject/${subjectId}`)}>Go back</Button>
        </div>
      </div>
    );
  }

  // Calculate completed lessons
  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
  const unitProgress = (completedCount / lessons.length) * 100;

  // Find current lesson (first incomplete)
  const currentLessonIndex = lessons.findIndex(l => !isLessonCompleted(l.id));
  const currentLesson = lessons[currentLessonIndex];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/subject/${subjectId}`)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <OfflineIndicator />
          <XPDisplay xp={progress.xp} streak={progress.streak} size="sm" />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Unit Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl">
              {unit.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Unit {unit.order}
              </p>
              <h1 className="text-xl font-black">{unit.name}</h1>
            </div>
          </div>
          <p className="text-muted-foreground">{unit.description}</p>
        </div>

        {/* Progress Card */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-medium">Unit Progress</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {completedCount}/{lessons.length}
            </span>
          </div>
          <Progress value={unitProgress} className="h-3" />
        </div>

        {/* Lessons List */}
        <section>
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lessons
          </h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isCurrent = lesson.id === currentLesson?.id;
              // Unlock if previous is completed or it's the first lesson
              const isLocked = index > 0 && !isLessonCompleted(lessons[index - 1].id);

              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  isCurrent={isCurrent}
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                />
              );
            })}
          </div>
        </section>

        {/* Unit Review Button (appears when all lessons completed) */}
        {unitProgress === 100 && (
          <Button 
            size="lg" 
            variant="success" 
            className="w-full"
            onClick={() => navigate(`/review/${unitId}`)}
          >
            🎉 Take Unit Review
          </Button>
        )}
      </main>
    </div>
  );
}
