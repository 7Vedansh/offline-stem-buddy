import { useState, useEffect, useCallback } from 'react';
import { 
  getUserProgress, 
  saveUserProgress, 
  addXP as addXPToStorage,
  completeLesson as completeLessonInStorage,
  saveQuizScore,
  type UserProgress 
} from '@/lib/storage';

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(getUserProgress);

  // Refresh progress from storage
  const refreshProgress = useCallback(() => {
    setProgress(getUserProgress());
  }, []);

  // Update progress
  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    saveUserProgress(updates);
    refreshProgress();
  }, [refreshProgress]);

  // Add XP
  const addXP = useCallback((amount: number) => {
    const newXP = addXPToStorage(amount);
    refreshProgress();
    return newXP;
  }, [refreshProgress]);

  // Complete a lesson
  const completeLesson = useCallback((lessonId: string, xpEarned: number) => {
    completeLessonInStorage(lessonId, xpEarned);
    refreshProgress();
  }, [refreshProgress]);

  // Save quiz score
  const saveQuiz = useCallback((quizId: string, score: number) => {
    saveQuizScore(quizId, score);
    refreshProgress();
  }, [refreshProgress]);

  // Check if lesson is completed
  const isLessonCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  // Get quiz score
  const getQuizScore = useCallback((quizId: string) => {
    return progress.quizScores[quizId] || 0;
  }, [progress.quizScores]);

  // Listen for storage changes (from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'ai_tutor_progress') {
        refreshProgress();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshProgress]);

  return {
    progress,
    updateProgress,
    addXP,
    completeLesson,
    saveQuiz,
    isLessonCompleted,
    getQuizScore,
    refreshProgress,
  };
}
