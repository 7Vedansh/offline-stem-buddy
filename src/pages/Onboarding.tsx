import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Globe, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { languages, subjects } from '@/lib/mockData';
import { saveUserProgress, completeOnboarding } from '@/lib/storage';

type Step = 'welcome' | 'language' | 'subjects';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleSubjectToggle = (id: string) => {
    setSelectedSubjects(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    saveUserProgress({
      currentLanguage: selectedLanguage,
      selectedSubjects,
    });
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {['welcome', 'language', 'subjects'].map((s, i) => (
          <div
            key={s}
            className={cn(
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              s === step ? 'w-8 bg-primary' : 
              ['welcome', 'language', 'subjects'].indexOf(step) > i 
                ? 'bg-secondary' 
                : 'bg-muted'
            )}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col px-6 pb-8">
        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-8 animate-float">
              <Sparkles className="w-16 h-16 text-primary-foreground" />
            </div>
            
            <h1 className="text-3xl font-black mb-4">
              Welcome to <span className="text-gradient-primary">AI Tutor</span>
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-sm">
              Your personal offline learning companion for STEM education
            </p>

            <div className="space-y-4 w-full max-w-sm mb-8">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Works Offline</h3>
                  <p className="text-sm text-muted-foreground">Learn anywhere, anytime</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold">AI-Powered</h3>
                  <p className="text-sm text-muted-foreground">Get help when you're stuck</p>
                </div>
              </div>
            </div>

            <Button size="xl" className="w-full max-w-sm" onClick={() => setStep('language')}>
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Language Step */}
        {step === 'language' && (
          <div className="flex-1 flex flex-col animate-slide-in-bottom">
            <h2 className="text-2xl font-black text-center mb-2">Choose Your Language</h2>
            <p className="text-muted-foreground text-center mb-8">
              Select your preferred learning language
            </p>

            <div className="grid grid-cols-2 gap-3 mb-auto">
              {languages.map((lang) => (
                <Card
                  key={lang.code}
                  variant="interactive"
                  className={cn(
                    'p-4',
                    selectedLanguage === lang.code && 'ring-2 ring-primary border-primary'
                  )}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{lang.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lang.nativeName}
                      </p>
                    </div>
                    {selectedLanguage === lang.code && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              size="lg" 
              className="w-full mt-6" 
              onClick={() => setStep('subjects')}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* Subjects Step */}
        {step === 'subjects' && (
          <div className="flex-1 flex flex-col animate-slide-in-bottom">
            <h2 className="text-2xl font-black text-center mb-2">What do you want to learn?</h2>
            <p className="text-muted-foreground text-center mb-8">
              Select one or more subjects
            </p>

            <div className="space-y-3 mb-auto">
              {subjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id);
                return (
                  <Card
                    key={subject.id}
                    variant="interactive"
                    className={cn(
                      'p-4',
                      isSelected && 'ring-2 ring-primary border-primary'
                    )}
                    onClick={() => handleSubjectToggle(subject.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-2xl shrink-0">
                        {subject.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold">{subject.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {subject.description}
                        </p>
                      </div>
                      <div className={cn(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                        isSelected 
                          ? 'bg-primary border-primary' 
                          : 'border-muted-foreground'
                      )}>
                        {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button 
              size="lg" 
              className="w-full mt-6" 
              onClick={handleComplete}
              disabled={selectedSubjects.length === 0}
            >
              Start Learning
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
