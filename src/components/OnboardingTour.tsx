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
          <p className="mb-2">Your gateway to smart investing in the Nairobi Securities Exchange.</p>
          <p className="text-sm text-muted-foreground">Let's walk through your first trade - it only takes a minute!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: 'This is your Dashboard - track your portfolio value, market performance, and account summary at a glance.',
      placement: 'bottom',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="trading"]',
      content: 'Click here to access the Trading interface where you can buy and sell stocks. Let\'s start your first trade!',
      placement: 'top',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="stock-selector"]',
      content: 'Select any stock from this dropdown to view its live price, charts, and place orders.',
      placement: 'bottom',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="stock-chart"]',
      content: 'View real-time price movements and technical indicators on this interactive chart.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="ai-assistant"]',
      content: 'Meet Invisa AI - your personal trading assistant! Ask for stock analysis, market insights, or portfolio recommendations.',
      placement: 'left',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="watchlist"]',
      content: 'Add stocks to your watchlist to monitor their performance without buying. Track your favorites here.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="research"]',
      content: 'Access detailed research, company fundamentals, financial statements, and analyst ratings.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="order-panel"]',
      content: 'This is where the magic happens! Place buy or sell orders with market, limit, or stop order types.',
      placement: 'left',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="buy-tab"]',
      content: 'Click the Buy tab to purchase shares. You can also switch to Sell when you want to exit a position.',
      placement: 'bottom',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="order-quantity"]',
      content: 'Enter the number of shares you want to buy. Start small if you\'re learning!',
      placement: 'bottom',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="place-order"]',
      content: 'Review your order details and click this button to place your trade. You\'ll get a confirmation before it\'s final.',
      placement: 'top',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="portfolio"]',
      content: 'After placing an order, check your Portfolio to see your holdings, performance, and profit/loss.',
      placement: 'top',
      spotlightClicks: true,
    },
    {
      target: '[data-tour="positions"]',
      content: 'View all your open positions here - see quantity, current value, and unrealized gains or losses.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="community"]',
      content: 'Join the HisaHub community! Share trading ideas, learn from others, and follow top investors.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: '[data-tour="settings"]',
      content: 'Manage your profile, connect brokers, set up notifications, and customize your experience.',
      placement: 'top',
      spotlightClicks: false,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">You're ready to trade! 🚀</h2>
          <p className="mb-2">You now know how to research stocks, place trades, and track your portfolio.</p>
          <p className="text-sm text-muted-foreground">Start with small amounts, use Invisa AI for guidance, and happy investing!</p>
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
          primaryColor: '#3B82F6',
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
          backgroundColor: '#3B82F6',
          borderRadius: 8,
          padding: '10px 20px',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: '600',
        },
        buttonBack: {
          borderRadius: 8,
          padding: '10px 20px',
          marginRight: 10,
          color: '#6B7280',
          fontSize: '14px',
        },
        buttonSkip: {
          color: '#9CA3AF',
          fontSize: '14px',
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
