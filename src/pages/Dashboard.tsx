import { useNavigate } from 'react-router-dom';
import { Bot, Trophy, Target, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 28,
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-10 bg-background/85 backdrop-blur-xl border-b border-border/60"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">AI Tutor</h1>
            <p className="text-xs text-muted-foreground font-medium">Keep learning!</p>
          </div>
          <div className="flex items-center gap-3">
            <OfflineIndicator />
            <XPDisplay xp={progress.xp} streak={progress.streak} size="sm" />
          </div>
        </div>
      </motion.header>

      <motion.main 
        className="px-5 py-7 space-y-7"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Card */}
        <motion.div variants={itemVariants}>
          <Card className="gradient-primary text-primary-foreground overflow-hidden shadow-lg border-0">
            <CardContent className="p-6 relative">
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-1.5">Welcome back! 👋</h2>
                <p className="text-primary-foreground/85 text-sm mb-5 font-medium">
                  You're on a {progress.streak}-day streak. Keep it going!
                </p>
                
                {/* Daily Goal */}
                <div className="bg-primary-foreground/12 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="font-medium">Daily Goal</span>
                    <span className="font-bold">{todayXP}/{dailyXPGoal} XP</span>
                  </div>
                  <div className="h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary-foreground rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${dailyProgress}%` }}
                      transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-primary-foreground/10 rounded-full blur-sm" />
              <div className="absolute right-10 bottom-10 w-20 h-20 bg-primary-foreground/10 rounded-full" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div className="grid grid-cols-3 gap-3" variants={itemVariants}>
          {[
            { icon: Trophy, value: progress.xp, label: "Total XP", color: "text-xp" },
            { icon: Target, value: progress.completedLessons.length, label: "Lessons", color: "text-secondary" },
            { icon: TrendingUp, value: Object.keys(progress.quizScores).length, label: "Quizzes", color: "text-accent" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.08, type: "spring", stiffness: 400, damping: 25 }}
            >
              <Card className="p-4 text-center hover:shadow-md transition-shadow duration-300 border-border/60">
                <stat.icon className={`w-6 h-6 mx-auto mb-2.5 ${stat.color}`} />
                <p className="text-xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Subjects */}
        <motion.section variants={itemVariants}>
          <h2 className="text-lg font-bold mb-4 tracking-tight">Your Subjects</h2>
          <div className="space-y-3.5">
            {userSubjects.length > 0 ? (
              userSubjects.map((subject, index) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 400, damping: 28 }}
                >
                  <SubjectCard
                    subject={subject}
                    progress={getSubjectProgress(subject.id)}
                    onClick={() => navigate(`/subject/${subject.id}`)}
                  />
                </motion.div>
              ))
            ) : (
              <Card className="p-7 text-center border-border/60">
                <p className="text-muted-foreground font-medium">No subjects selected</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Choose Subjects
                </Button>
              </Card>
            )}
          </div>
        </motion.section>

        {/* Continue Learning */}
        {progress.completedLessons.length > 0 && (
          <motion.section variants={itemVariants}>
            <h2 className="text-lg font-bold mb-4 tracking-tight">Continue Learning</h2>
            <Card 
              variant="interactive" 
              className="p-5 border-border/60"
              onClick={() => navigate('/subject/math/unit/math-algebra-1')}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-2xl shadow-sm">
                  📐
                </div>
                <div className="flex-1">
                  <p className="font-bold tracking-tight">Introduction to Algebra</p>
                  <p className="text-sm text-muted-foreground font-medium">Continue where you left off</p>
                </div>
                <Button size="sm" variant="accent" className="shadow-sm">
                  Continue
                </Button>
              </div>
            </Card>
          </motion.section>
        )}
      </motion.main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/60 safe-bottom shadow-lg">
        <div className="flex items-center justify-around py-2.5">
          <Button variant="ghost" className="flex-col h-auto py-2.5 gap-1.5 text-primary font-semibold">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2.5 gap-1.5 font-medium"
            onClick={() => navigate('/leaderboard')}
          >
            <Trophy className="w-6 h-6" />
            <span className="text-xs">Leaderboard</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex-col h-auto py-2.5 gap-1.5"
            onClick={() => navigate('/assistant')}
          >
            <motion.div 
              className="w-14 h-14 -mt-7 gradient-primary rounded-full flex items-center justify-center shadow-lg border-4 border-card"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Bot className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <span className="text-xs font-semibold text-primary">AI Tutor</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2.5 gap-1.5 font-medium">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span className="text-xs">Progress</span>
          </Button>
          <Button variant="ghost" className="flex-col h-auto py-2.5 gap-1.5 font-medium">
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