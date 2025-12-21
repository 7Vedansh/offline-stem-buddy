import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, Check, Lightbulb, BookOpen, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { QuizView } from '@/components/QuizView';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { XPGainAnimation } from '@/components/XPDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';
import { getLessonById, getQuizByLesson, getUnitById } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ViewMode = 'lesson' | 'quiz' | 'complete';

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { progress, completeLesson, saveQuiz, isLessonCompleted } = useUserProgress();

  const [viewMode, setViewMode] = useState<ViewMode>('lesson');
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [showXPGain, setShowXPGain] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const lesson = getLessonById(lessonId || '');
  const quiz = getQuizByLesson(lessonId || '');
  const unit = lesson ? getUnitById(lesson.unitId) : undefined;

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Lesson not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go back</Button>
        </div>
      </div>
    );
  }

  const currentContent = lesson.content[currentContentIndex];
  const contentProgress = ((currentContentIndex + 1) / lesson.content.length) * 100;
  const isLastContent = currentContentIndex === lesson.content.length - 1;

  const handleNext = () => {
    if (isLastContent) {
      if (quiz) {
        setViewMode('quiz');
      } else {
        handleLessonComplete();
      }
    } else {
      setCurrentContentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    }
  };

  const handleLessonComplete = () => {
    if (!isLessonCompleted(lesson.id)) {
      completeLesson(lesson.id, lesson.xpReward);
      setEarnedXP(lesson.xpReward);
      setShowXPGain(true);
    }
    setViewMode('complete');
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (quiz) {
      saveQuiz(quiz.id, Math.round((score / total) * 100));
    }
    handleLessonComplete();
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'tip': return <Lightbulb className="w-5 h-5" />;
      case 'formula': return <Calculator className="w-5 h-5" />;
      case 'example': return <BookOpen className="w-5 h-5" />;
      default: return null;
    }
  };

  const getContentStyle = (type: string) => {
    switch (type) {
      case 'tip': return 'bg-accent-light border-accent';
      case 'formula': return 'bg-primary-light border-primary';
      case 'example': return 'bg-secondary-light border-secondary';
      default: return 'bg-card';
    }
  };

  // Completion View
  if (viewMode === 'complete') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        {showXPGain && (
          <XPGainAnimation amount={earnedXP} onComplete={() => setShowXPGain(false)} />
        )}
        
        <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6 animate-bounce-in">
          <Check className="w-12 h-12 text-secondary-foreground" />
        </div>

        <h1 className="text-2xl font-black mb-2">Lesson Complete!</h1>
        <p className="text-muted-foreground mb-8">
          Great job finishing "{lesson.title}"
        </p>

        <div className="w-full max-w-sm space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => navigate(`/subject/math/unit/${lesson.unitId}`)}
          >
            Continue to Next Lesson
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Quiz View
  if (viewMode === 'quiz' && quiz) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => setViewMode('lesson')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-bold">Quiz Time!</h1>
            <OfflineIndicator />
          </div>
        </header>
        <QuizView 
          quiz={quiz} 
          onComplete={handleQuizComplete}
          onRetry={() => setViewMode('quiz')}
        />
      </div>
    );
  }

  // Lesson View
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/subject/math/unit/${lesson.unitId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 mx-4">
            <Progress value={contentProgress} className="h-2" />
          </div>
          <OfflineIndicator />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        {/* Lesson Title */}
        <div className="mb-6">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            {unit?.name}
          </p>
          <h1 className="text-xl font-black">{lesson.title}</h1>
        </div>

        {/* Content Card */}
        <Card className={cn(
          'p-6 mb-6 border-2 animate-fade-in',
          getContentStyle(currentContent.type)
        )}>
          {getContentIcon(currentContent.type) && (
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center mb-4',
              currentContent.type === 'tip' && 'bg-accent text-accent-foreground',
              currentContent.type === 'formula' && 'bg-primary text-primary-foreground',
              currentContent.type === 'example' && 'bg-secondary text-secondary-foreground'
            )}>
              {getContentIcon(currentContent.type)}
            </div>
          )}
          
          <p className={cn(
            'text-lg leading-relaxed',
            currentContent.type === 'formula' && 'font-mono text-center text-xl'
          )}>
            {currentContent.content}
          </p>
        </Card>

        {/* Content Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {lesson.content.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentContentIndex(index)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all',
                index === currentContentIndex ? 'w-8 bg-primary' :
                index < currentContentIndex ? 'bg-secondary' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </main>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border bg-card safe-bottom">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentContentIndex === 0}
            className="flex-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          {/* AI Assistant */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon-lg">
                <Bot className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>AI Tutor</SheetTitle>
              </SheetHeader>
              <VoiceAssistant context={`Current lesson: ${lesson.title}. Content: ${currentContent.content}`} />
            </SheetContent>
          </Sheet>

          <Button
            size="lg"
            onClick={handleNext}
            className="flex-1"
          >
            {isLastContent ? (quiz ? 'Take Quiz' : 'Complete') : 'Next'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
