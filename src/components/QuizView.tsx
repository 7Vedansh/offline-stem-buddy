import { useState } from 'react';
import { Check, X, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Quiz, QuizQuestion } from '@/lib/mockData';

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number, totalQuestions: number) => void;
  onRetry: () => void;
}

export function QuizView({ quiz, onComplete, onRetry }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / quiz.questions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
      onComplete(correctCount + (isCorrect ? 1 : 0), quiz.questions.length);
    }
  };

  if (isComplete) {
    const finalScore = correctCount;
    const percentage = Math.round((finalScore / quiz.questions.length) * 100);
    const isPassing = percentage >= 70;

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <div className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center mb-6',
          isPassing ? 'bg-secondary-light' : 'bg-accent-light'
        )}>
          <Trophy className={cn(
            'w-12 h-12',
            isPassing ? 'text-secondary' : 'text-accent'
          )} />
        </div>

        <h2 className="text-2xl font-bold mb-2">
          {isPassing ? 'Great job!' : 'Keep practicing!'}
        </h2>
        <p className="text-muted-foreground mb-6">
          You got {finalScore} out of {quiz.questions.length} correct
        </p>

        <div className="w-full max-w-xs mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Score</span>
            <span className={cn(
              'font-bold',
              isPassing ? 'text-secondary' : 'text-accent'
            )}>
              {percentage}%
            </span>
          </div>
          <Progress 
            value={percentage} 
            variant={isPassing ? 'success' : 'default'}
            className="h-3"
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onRetry}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="success" onClick={() => onComplete(finalScore, quiz.questions.length)}>
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">
            Question {currentIndex + 1} of {quiz.questions.length}
          </span>
          <span className="font-medium text-secondary">
            {correctCount} correct
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold mb-1">Question {currentIndex + 1}</h3>
        <p className="text-foreground">{currentQuestion.question}</p>
      </Card>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === currentQuestion.correctIndex;
          const showResult = isAnswered;

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isAnswered}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all duration-200',
                'flex items-center gap-3',
                !showResult && !isSelected && 'border-border hover:border-primary hover:bg-primary-light',
                !showResult && isSelected && 'border-primary bg-primary-light',
                showResult && isCorrectOption && 'border-secondary bg-secondary-light',
                showResult && isSelected && !isCorrectOption && 'border-destructive bg-destructive/10'
              )}
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold',
                !showResult && 'bg-muted text-muted-foreground',
                showResult && isCorrectOption && 'bg-secondary text-secondary-foreground',
                showResult && isSelected && !isCorrectOption && 'bg-destructive text-destructive-foreground'
              )}>
                {showResult ? (
                  isCorrectOption ? <Check className="w-4 h-4" /> : 
                  isSelected ? <X className="w-4 h-4" /> :
                  String.fromCharCode(65 + index)
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </div>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <Card className={cn(
          'p-4 mb-6',
          isCorrect ? 'bg-secondary-light border-secondary' : 'bg-accent-light border-accent'
        )}>
          <div className="flex items-start gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              isCorrect ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'
            )}>
              {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
            <div>
              <p className={cn(
                'font-bold',
                isCorrect ? 'text-secondary' : 'text-accent'
              )}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Next Button */}
      {isAnswered && (
        <Button onClick={handleNext} className="w-full" size="lg">
          {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      )}
    </div>
  );
}
