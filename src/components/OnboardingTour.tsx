import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OnboardingTour: React.FC = () => {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    checkAndStartTour();
  }, []);

  const checkAndStartTour = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('has_completed_tour')
        .eq('id', user.id)
        .single();

      // Start tour if user hasn't completed it
      if (profile && !profile.has_completed_tour) {
        // Small delay to let the page load
        setTimeout(() => setRun(true), 1000);
      }
    } catch (error) {
      console.error('Error checking tour status:', error);
    }
  };

  const markTourComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ has_completed_tour: true })
        .eq('id', user.id);

      toast({
        title: "Welcome aboard!",
        description: "You're all set. Explore and start investing smartly.",
      });
    } catch (error) {
      console.error('Error marking tour complete:', error);
    }
  };

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to HisaHub 🎉</h2>
          <p>Your gateway to smart investing. Let's take a quick tour!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: 'Track your investments and view live market performance here.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="trading"]',
      content: 'Execute trades directly with real-time NSE data.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="ai-assistant"]',
      content: 'Ask Invisa AI for insights, price predictions, or portfolio analysis.',
      placement: 'left',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="community"]',
      content: 'Engage with other investors, share insights, and learn.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="portfolio"]',
      content: 'Monitor your holdings, performance, and diversification.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="settings"]',
      content: 'Manage your account, security, and preferences.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">You're all set! 🚀</h2>
          <p>Explore and start investing smartly with HisaHub.</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, action } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      markTourComplete();
    }

    setStepIndex(index);
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: 'hsl(var(--accent))',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonBack: {
          borderRadius: 8,
          padding: '8px 16px',
          marginRight: 8,
        },
        buttonSkip: {
          color: 'hsl(var(--muted-foreground))',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default OnboardingTour;
