import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, ArrowRight, Loader2, Sparkles, Crown, Rocket, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import aetherLogo from '@/assets/aether-new-logo.jpeg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    priceId: 'price_1SjCzsH7wcmjTpOiQjG1ToVL',
    description: '1 agent of your choice',
    icon: Zap,
    features: [
      '1 AI agent of your choice',
      'Choose from: Data, Flow, Doc, Sales, HR, Brain or Compliance',
      'Unlimited workflows',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'business',
    name: 'Business',
    price: 249,
    priceId: 'price_1SjCztH7wcmjTpOiFJ2DfMOm',
    description: '3 agents of your choice',
    icon: Rocket,
    features: [
      '3 AI agents of your choice',
      'Choose from: Data, Flow, Doc, Sales, HR, Brain or Compliance',
      'Unlimited workflows',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 399,
    priceId: 'price_1SjCzvH7wcmjTpOi4KL5q7ZH',
    description: '6 agents of your choice',
    icon: Crown,
    features: [
      '6 AI agents of your choice',
      'Choose from: Data, Flow, Doc, Sales, HR, Brain or Compliance',
      'Unlimited workflows',
      'Dedicated support',
      'Custom integrations',
    ],
    popular: false,
  },
];

export default function SelectPlan() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  const confirmLeave = async () => {
    await supabase.auth.signOut();
    setShowLeaveDialog(false);
    navigate('/');
  };

  const handleStartTrial = async (priceId: string, planId: string) => {
    if (!session) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    setLoading(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Payment Error', {
        description: 'Unable to start checkout. Please try again.',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <img src={aetherLogo} alt="Aether" className="h-10 sm:h-14 w-auto" />
            </div>
            
            {/* Exit Button */}
            <button 
              onClick={() => setShowLeaveDialog(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 text-sm"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Are you sure you want to leave?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You can log back in anytime to continue your registration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">
              Stay and choose a plan
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLeave}
              className="w-full sm:w-auto bg-transparent border border-border text-foreground hover:bg-muted"
            >
              Leave anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-8 sm:py-12 relative z-0">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>3-day free trial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              Choose your plan
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the AI agents you need. 3-day free trial, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={plan.id}
                  className={`relative flex flex-col ${
                    plan.popular
                      ? 'border-primary shadow-lg shadow-primary/10 scale-[1.02]'
                      : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center pb-2 px-4 sm:px-6">
                    <div
                      className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                        plan.popular ? 'bg-primary/20' : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          plan.popular ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    
                    <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                    
                    <div className="mt-3">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground">€{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/mois</span>
                    </div>
                    
                    <Badge variant="secondary" className="mt-2 text-xs">
                      After 3-day free trial
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col space-y-4 px-4 sm:px-6 pb-6">
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleStartTrial(plan.priceId, plan.id)}
                      disabled={loading !== null}
                      variant={plan.popular ? 'default' : 'outline'}
                      className="w-full h-10 sm:h-11 text-sm"
                    >
                      {loading === plan.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          Start free trial
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-6 sm:mt-8">
            No charges during the 3-day trial. Secure payment by Stripe. Prices exclude VAT.
          </p>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            <a href="/contact" className="text-primary hover:underline transition-colors">
              Need help? Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
