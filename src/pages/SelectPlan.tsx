import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
    price: '250€',
    priceValue: 250,
    description: 'Idéal pour les petites équipes qui débutent',
    features: [
      '5 utilisateurs inclus',
      '3 outils IA',
      '1 000 requêtes IA/mois',
      'Support email',
      'Stockage 10 Go',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '750€',
    priceValue: 750,
    description: 'Pour les entreprises en croissance',
    features: [
      '25 utilisateurs inclus',
      '9 outils IA complets',
      '10 000 requêtes IA/mois',
      'Support prioritaire 24/7',
      'Stockage 100 Go',
      'API Access',
      'SSO & SAML',
    ],
    popular: true,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    price: 'Sur mesure',
    priceValue: null,
    description: 'Fonctionnalités illimitées pour les grandes organisations',
    features: [
      'Utilisateurs illimités',
      'Tous les outils IA',
      'Requêtes IA illimitées',
      'Account Manager dédié',
      'Stockage illimité',
      'API illimitée',
      'SSO, SAML, SCIM',
      'SLA personnalisé',
      'Formation sur site',
    ],
    contactUs: true,
  },
];

export default function SelectPlan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.contactUs) {
      toast.info('Notre équipe commerciale vous contactera sous 24h.', {
        description: 'Merci de votre intérêt pour le forfait Unlimited.',
      });
      return;
    }

    setLoading(plan.id);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Show error as requested
    toast.error('Erreur de paiement', {
      description: 'Le service de paiement est temporairement indisponible. Veuillez réessayer plus tard ou contacter le support.',
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
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">AETHER</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Accueil
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Choisissez votre forfait
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez le plan qui correspond le mieux à vos besoins. 
            Vous pouvez changer de forfait à tout moment.
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
                  Le plus populaire
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
                    <span className="text-muted-foreground">/mois</span>
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
                      Traitement en cours...
                    </>
                  ) : plan.contactUs ? (
                    'Nous contacter'
                  ) : (
                    <>
                      Choisir ce forfait
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Tous les prix sont HT. Facturation mensuelle. Annulez à tout moment.
        </p>
      </div>
    </div>
  );
}
