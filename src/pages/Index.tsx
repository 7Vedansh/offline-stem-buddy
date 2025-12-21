import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isOnboardingComplete } from '@/lib/storage';
import Onboarding from './Onboarding';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    if (isOnboardingComplete()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Show onboarding for new users
  return <Onboarding />;
};

export default Index;
