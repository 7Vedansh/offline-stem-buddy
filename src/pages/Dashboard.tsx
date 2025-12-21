import { useNavigate } from 'react-router-dom';
import { Bot, Trophy, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { XPDisplay } from '@/components/XPDisplay';
import { SubjectCard } from '@/components/SubjectCard';
import { useUserProgress } from '@/hooks/useUserProgress';
import { subjects } from '@/lib/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  // Filter subjects based on user selection
  const userSubjects = subjects.filter(s => 
    progress.selectedSubjects.includes(s.id)
  );

  // Calculate subject progress (mock calculation)
  const getSubjectProgress = (subjectId: string) => {
    const completedForSubject = progress.completedLessons.filter(
      l => l.startsWith(subjectId.slice(0, 4))
    ).length;
    return Math.min((completedForSubject / 15) * 100, 100);
  };

  // Daily goal progress
  const dailyXPGoal = 50;
  const todayXP = 35; // Mock value
  const dailyProgress = Math.min((todayXP / dailyXPGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-xl font-black">AI Tutor</h1>
            <p className="text-xs text-muted-foreground">Keep learning!</p>
          </div>
          <div className="flex items-center gap-3">
            <OfflineIndicator />
            <XPDisplay xp={progress.xp} streak={progress.streak} size="sm" />
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground overflow-hidden">
          <CardContent className="p-5 relative">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-1">Welcome back! 👋</h2>
              <p className="text-primary-foreground/80 text-sm mb-4">
                You're on a {progress.streak}-day streak. Keep it going!
              </p>
              
              {/* Daily Goal */}
              <div className="bg-primary-foreground/10 rounded-xl p-3">
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Goal</span>
                  <span className="font-bold">{todayXP}/{dailyXPGoal} XP</span>
                </div>
                <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-foreground rounded-full transition-all duration-500"
                    style={{ width: `${dailyProgress}%` }}
                  />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary-foreground/10 rounded-full" />
            <div className="absolute right-8 bottom-8 w-16 h-16 bg-primary-foreground/10 rounded-full" />
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-xp" />
            <p className="text-xl font-bold">{progress.xp}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-secondary" />
            <p className="text-xl font-bold">{progress.completedLessons.length}</p>
            <p className="text-xs text-muted-foreground">Lessons</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-xl font-bold">{Object.keys(progress.quizScores).length}</p>
            <p className="text-xs text-muted-foreground">Quizzes</p>
          </Card>
        </div>

        {/* Subjects */}
        <section>
          <h2 className="text-lg font-bold mb-4">Your Subjects</h2>
          <div className="space-y-3">
            {userSubjects.length > 0 ? (
              userSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  progress={getSubjectProgress(subject.id)}
                  onClick={() => navigate(`/subject/${subject.id}`)}
                />
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No subjects selected</p>
                <Button 
                  variant="outline" 
                  className="mt-3"
                  onClick={() => navigate('/')}
                >
                  Choose Subjects
                </Button>
              </Card>
            )}
          </div>
        </section>

        {/* Continue Learning */}
        {progress.completedLessons.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">Continue Learning</h2>
            <Card 
              variant="interactive" 
              className="p-4"
              onClick={() => navigate('/subject/math/unit/math-algebra-1')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-2xl">
                  📐
                </div>
                <div className="flex-1">
                  <p className="font-bold">Introduction to Algebra</p>
                  <p className="text-sm text-muted-foreground">Continue where you left off</p>
                </div>
                <Button size="sm" variant="accent">
                  Continue
                </Button>
              </div>
            </Card>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom">
        <div className="flex items-center justify-around py-2">
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 gap-1"
            onClick={() => navigate('/leaderboard')}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Leaderboard</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2 gap-1 text-primary"
            onClick={() => navigate('/assistant')}
          >
            <div className="w-12 h-12 -mt-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xs">AI Tutor</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs">Progress</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2 gap-1">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
