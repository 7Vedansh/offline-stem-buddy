// Offline-first storage utilities using localStorage
// In production, this would use IndexedDB for larger datasets

export interface UserProgress {
  currentLanguage: string;
  selectedSubjects: string[];
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  unitsProgress: Record<string, number>;
}

export interface SyncStatus {
  lastSynced: string | null;
  pendingChanges: boolean;
  isOnline: boolean;
}

const STORAGE_KEYS = {
  USER_PROGRESS: 'ai_tutor_progress',
  SYNC_STATUS: 'ai_tutor_sync',
  ONBOARDING_COMPLETE: 'ai_tutor_onboarded',
  LESSONS_CACHE: 'ai_tutor_lessons',
} as const;

// Default user progress
const defaultProgress: UserProgress = {
  currentLanguage: 'en',
  selectedSubjects: [],
  xp: 0,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  quizScores: {},
  unitsProgress: {},
};

// Get user progress from localStorage
export function getUserProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading user progress:', error);
  }
  return defaultProgress;
}

// Save user progress to localStorage
export function saveUserProgress(progress: Partial<UserProgress>): void {
  try {
    const current = getUserProgress();
    const updated = { ...current, ...progress };
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(updated));
    markPendingSync();
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
}

// Update XP with streak logic
export function addXP(amount: number): number {
  const progress = getUserProgress();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let newStreak = progress.streak;
  
  if (progress.lastActiveDate === yesterday) {
    newStreak = progress.streak + 1;
  } else if (progress.lastActiveDate !== today) {
    newStreak = 1;
  }
  
  const newXP = progress.xp + amount;
  
  saveUserProgress({
    xp: newXP,
    streak: newStreak,
    lastActiveDate: today,
  });
  
  return newXP;
}

// Mark lesson as completed
export function completeLesson(lessonId: string, xpEarned: number): void {
  const progress = getUserProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    saveUserProgress({
      completedLessons: [...progress.completedLessons, lessonId],
    });
    addXP(xpEarned);
  }
}

// Save quiz score
export function saveQuizScore(quizId: string, score: number): void {
  const progress = getUserProgress();
  const currentScore = progress.quizScores[quizId] || 0;
  
  // Only update if new score is higher
  if (score > currentScore) {
    saveUserProgress({
      quizScores: { ...progress.quizScores, [quizId]: score },
    });
  }
  
  // Award XP based on score
  const xpEarned = Math.floor(score * 0.5);
  addXP(xpEarned);
}

// Sync status management
export function getSyncStatus(): SyncStatus {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SYNC_STATUS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading sync status:', error);
  }
  return {
    lastSynced: null,
    pendingChanges: false,
    isOnline: navigator.onLine,
  };
}

function markPendingSync(): void {
  const status = getSyncStatus();
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify({
    ...status,
    pendingChanges: true,
  }));
}

export function markSynced(): void {
  localStorage.setItem(STORAGE_KEYS.SYNC_STATUS, JSON.stringify({
    lastSynced: new Date().toISOString(),
    pendingChanges: false,
    isOnline: navigator.onLine,
  }));
}

// Onboarding status
export function isOnboardingComplete(): boolean {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
}

export function completeOnboarding(): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

// Reset all data (for testing)
export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
