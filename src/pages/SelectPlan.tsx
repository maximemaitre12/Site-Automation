import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { LandingHeader } from '@/components/landing/LandingHeader';

export default function SelectPlan() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    if (!session) {
      toast.error('Please sign in first');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
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
      setLoading(false);
    }
  };

  const features = [
    'All 9 AI-powered agents',
    'Unlimited workflows',
    'Document processing',
    'Sales intelligence',
    'HR automation',
    'Customer support AI',
    'Compliance tools',
    'Priority support',
    'API access',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader />

      {/* Content - with padding for fixed header */}
      <div className="flex-1 container mx-auto px-4 pt-20 pb-12 flex items-center justify-center">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>3 days free trial</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              Start Your Free Trial
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Try AETHER Pro free for 3 days. Cancel anytime.
            </p>
          </div>

          <Card className="border-primary/30 shadow-lg shadow-primary/5">
            <CardHeader className="text-center pb-2 sm:pb-4 px-4 sm:px-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              
              <CardTitle className="text-xl sm:text-2xl">AETHER Pro</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Full access to all features</CardDescription>
              
              <div className="mt-3 sm:mt-4">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">€99</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              
              <Badge variant="secondary" className="mt-2 text-xs">
                After 3-day free trial
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <ul className="space-y-2 sm:space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                onClick={handleStartTrial}
                disabled={loading}
                className="w-full h-10 sm:h-12 text-sm sm:text-base"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-center text-[10px] sm:text-xs text-muted-foreground">
                You won't be charged during your 3-day trial.<br />
                Cancel anytime before the trial ends.
              </p>
            </CardContent>
          </Card>

          <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-4 sm:mt-6">
            Secure payment powered by Stripe. All prices exclude VAT.
          </p>
        </div>
      </div>
    </div>
  );
}
