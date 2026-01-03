import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { XPDisplay } from '@/components/XPDisplay';
import { LessonPathNode } from '@/components/LessonPathNode';
import { UnitHeader } from '@/components/UnitHeader';
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

  // Find current lesson (first incomplete)
  const currentLesson = lessons.find(l => !isLessonCompleted(l.id));

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

      <main className="px-4 py-6 space-y-8">
        {/* Unit Header Card */}
        <UnitHeader 
          unit={unit} 
          unitNumber={unit.order}
          onGuidebook={() => {}}
        />

        {/* Lesson Path */}
        <div className="relative py-8">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-muted -translate-x-1/2 z-0" />
          
          {/* Lesson nodes */}
          <div className="relative z-10 space-y-8">
            {lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id);
              const isCurrent = lesson.id === currentLesson?.id;
              // Unlock if previous is completed or it's the first lesson
              const isLocked = index > 0 && !isLessonCompleted(lessons[index - 1].id);

              return (
                <LessonPathNode
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  isCurrent={isCurrent}
                  index={index}
                  onClick={() => navigate(`/lesson/${lesson.id}`)}
                />
              );
            })}
          </div>
        </div>

        {/* Unit Review Button (appears when all lessons completed) */}
        {lessons.every(l => isLessonCompleted(l.id)) && (
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
