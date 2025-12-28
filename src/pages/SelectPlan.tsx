import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Building2, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue: number | null;
  description: string;
  features: string[];
  popular?: boolean;
  contactUs?: boolean;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '€250',
    priceValue: 250,
    description: 'Ideal for small teams getting started',
    features: [
      '5 users included',
      '3 AI tools',
      '1,000 AI requests/month',
      'Email support',
      '10 GB storage',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '€750',
    priceValue: 750,
    description: 'For growing businesses',
    features: [
      '25 users included',
      '9 complete AI tools',
      '10,000 AI requests/month',
      '24/7 priority support',
      '100 GB storage',
      'API Access',
      'SSO & SAML',
    ],
    popular: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 'Custom',
    priceValue: null,
    description: 'Unlimited features for large organizations',
    features: [
      'Unlimited users',
      'All AI tools',
      'Unlimited AI requests',
      'Dedicated Account Manager',
      'Unlimited storage',
      'Unlimited API',
      'SSO, SAML, SCIM',
      'Custom SLA',
      'On-site training',
    ],
    contactUs: true,
  },
];

export default function SelectPlan() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.contactUs) {
      toast.info('Our sales team will contact you within 24 hours.', {
        description: 'Thank you for your interest in the Unlimited plan.',
      });
      return;
    }

    setLoading(plan.id);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show error as requested
    toast.error('Payment Error', {
      description: 'The payment service is temporarily unavailable. Please try again later or contact support.',
    });
    
    setLoading(null);
  };

  const handleSkip = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={aetherLogo} 
              alt="AETHER Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-xl font-bold text-foreground">AETHER</span>
          </div>
          <Button variant="ghost" onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs. 
            You can change your plan at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative border-border bg-card transition-all duration-300 hover:shadow-lg ${
                plan.popular ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  plan.id === 'starter' ? 'bg-blue-500/20' :
                  plan.id === 'enterprise' ? 'bg-primary/20' :
                  'bg-amber-500/20'
                }`}>
                  {plan.id === 'starter' && <Zap className="w-7 h-7 text-blue-500" />}
                  {plan.id === 'enterprise' && <Building2 className="w-7 h-7 text-primary" />}
                  {plan.id === 'unlimited' && <Crown className="w-7 h-7 text-amber-500" />}
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.priceValue && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={loading !== null}
                  className={`w-full ${
                    plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : plan.contactUs ? (
                    'Contact Us'
                  ) : (
                    <>
                      Choose This Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          All prices exclude VAT. Monthly billing. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
