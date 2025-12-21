import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Crown, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { XPDisplay } from '@/components/XPDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser?: boolean;
}

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Priya S.', xp: 2450, avatar: '👩‍🎓' },
  { rank: 2, name: 'Rahul K.', xp: 2280, avatar: '👨‍💻' },
  { rank: 3, name: 'Ananya M.', xp: 2150, avatar: '👩‍🔬' },
  { rank: 4, name: 'Vikram P.', xp: 1980, avatar: '🧑‍🎓' },
  { rank: 5, name: 'You', xp: 0, avatar: '🎯', isCurrentUser: true },
  { rank: 6, name: 'Deepa R.', xp: 1750, avatar: '👩‍💼' },
  { rank: 7, name: 'Arjun S.', xp: 1680, avatar: '👨‍🔬' },
  { rank: 8, name: 'Kavitha N.', xp: 1520, avatar: '👩‍🏫' },
  { rank: 9, name: 'Suresh M.', xp: 1450, avatar: '🧑‍💼' },
  { rank: 10, name: 'Lakshmi G.', xp: 1380, avatar: '👩‍⚕️' },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { progress } = useUserProgress();
  const { isOnline } = useOnlineStatus();

  // Update mock data with user's actual XP
  const leaderboard = mockLeaderboard.map(entry => {
    if (entry.isCurrentUser) {
      return { ...entry, xp: progress.xp };
    }
    return entry;
  }).sort((a, b) => b.xp - a.xp).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  const currentUserRank = leaderboard.find(e => e.isCurrentUser)?.rank || 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return null;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300';
      case 2: return 'bg-gradient-to-r from-gray-100 to-slate-100 border-gray-300';
      case 3: return 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">Leaderboard</h1>
          <OfflineIndicator />
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Sync Status */}
        {!isOnline && (
          <Card className="p-4 bg-accent-light border-accent">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-sm">Offline Mode</p>
                <p className="text-xs text-muted-foreground">
                  Leaderboard will sync when you're back online
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Your Rank Card */}
        <Card className="p-5 bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-3xl">
              🎯
            </div>
            <div className="flex-1">
              <p className="text-primary-foreground/70 text-sm">Your Rank</p>
              <p className="text-3xl font-black">#{currentUserRank}</p>
            </div>
            <div className="text-right">
              <p className="text-primary-foreground/70 text-sm">Total XP</p>
              <p className="text-2xl font-bold">{progress.xp.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Weekly Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-xp" />
              Weekly Top 10
            </h2>
            {isOnline && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Wifi className="w-3 h-3" />
                Live
              </span>
            )}
          </div>

          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry) => (
              <Card
                key={entry.rank}
                className={cn(
                  'p-4 transition-all',
                  entry.isCurrentUser && 'ring-2 ring-primary',
                  getRankStyle(entry.rank)
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
                    {entry.avatar}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-bold truncate',
                      entry.isCurrentUser && 'text-primary'
                    )}>
                      {entry.name}
                      {entry.isCurrentUser && ' (You)'}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right">
                    <p className="font-bold text-xp">{entry.xp.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Motivational Message */}
        <Card className="p-5 text-center bg-secondary-light border-secondary">
          <p className="text-lg font-bold text-secondary mb-1">Keep Learning! 📚</p>
          <p className="text-sm text-muted-foreground">
            Complete more lessons to climb the leaderboard
          </p>
        </Card>
      </main>
    </div>
  );
}
