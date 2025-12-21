import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Loader2, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getAIResponse, speakText, stopSpeaking, startListening } from '@/lib/mockAI';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isLocal?: boolean;
}

interface VoiceAssistantProps {
  context?: string;
  onClose?: () => void;
}

export function VoiceAssistant({ context }: VoiceAssistantProps) {
  const { isOnline } = useOnlineStatus();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI tutor. Ask me anything about your lessons, and I'll help you understand better! 📚",
      isLocal: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stopListeningRef = useRef<(() => void) | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(
        context ? `Context: ${context}\n\nQuestion: ${userMessage.content}` : userMessage.content
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        isLocal: response.isLocal,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again!",
        isLocal: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListeningRef.current?.();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    stopListeningRef.current = startListening(
      (text) => {
        setInput(text);
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(text);
      // Estimate speech duration
      setTimeout(() => setIsSpeaking(false), text.length * 60);
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold">AI Tutor</h3>
            <p className="text-xs text-muted-foreground">
              {isOnline ? '☁️ Cloud AI active' : '📱 Local AI (offline)'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              message.role === 'user' && 'flex-row-reverse'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              message.role === 'assistant' ? 'bg-primary-light' : 'bg-secondary-light'
            )}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-secondary" />
              )}
            </div>
            <div className={cn(
              'flex-1 max-w-[80%]',
              message.role === 'user' && 'flex flex-col items-end'
            )}>
              <div className={cn(
                'rounded-2xl px-4 py-3',
                message.role === 'assistant' 
                  ? 'bg-muted rounded-tl-sm' 
                  : 'bg-primary text-primary-foreground rounded-tr-sm'
              )}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-1">
                  {message.isLocal && (
                    <span className="text-xs text-muted-foreground">📱 Local</span>
                  )}
                  <button
                    onClick={() => handleSpeak(message.content)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={handleVoiceInput}
            className="shrink-0"
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or speak your question..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-center text-accent mt-2 animate-pulse">
            🎤 Listening... Speak now!
          </p>
        )}
      </div>
    </Card>
  );
}
