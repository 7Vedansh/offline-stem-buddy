import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { XPDisplay } from '@/components/XPDisplay';
import { useUserProgress } from '@/hooks/useUserProgress';

export default function AssistantPage() {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold">AI Tutor</h1>
          <div className="flex items-center gap-2">
            <OfflineIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="h-full max-h-[calc(100vh-80px)]">
          <VoiceAssistant />
        </div>
      </main>
    </div>
  );
}
