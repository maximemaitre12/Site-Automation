import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArrowRight, CheckCircle2, Calendar, Users, Zap } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  "Démonstration personnalisée selon vos cas d'usage",
  "Estimation du ROI pour votre organisation",
  "Échange avec un expert AETHER",
  "Plan d'implémentation sur mesure",
];

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Demande envoyée !", {
      description: "Nous vous contacterons dans les 24h.",
    });
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left column - Info */}
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Réponse sous 24h</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Demandez votre <span className="text-gradient">démo personnalisée</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Découvrez comment AETHER peut transformer vos opérations. 
                Un expert vous présentera les fonctionnalités adaptées à vos besoins.
              </p>
              
              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-card/50 border border-border/50">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-gradient">150+</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Entreprises accompagnées</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-bold text-gradient">48h</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Déploiement moyen</p>
                </div>
              </div>
            </div>
            
            {/* Right column - Form */}
            <div className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Remplissez le formulaire
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input id="firstName" placeholder="Jean" required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input id="lastName" placeholder="Dupont" required className="bg-background/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input id="email" type="email" placeholder="jean.dupont@entreprise.com" required className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise *</Label>
                  <Input id="company" placeholder="Nom de votre entreprise" required className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Fonction</Label>
                  <Input id="role" placeholder="Directeur des opérations" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Taille de l'entreprise</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employés</SelectItem>
                      <SelectItem value="11-50">11-50 employés</SelectItem>
                      <SelectItem value="51-200">51-200 employés</SelectItem>
                      <SelectItem value="201-500">201-500 employés</SelectItem>
                      <SelectItem value="500+">500+ employés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Comment pouvons-nous vous aider ?</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez vos besoins en automatisation..."
                    rows={4}
                    className="bg-background/50 resize-none"
                  />
                </div>
                
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Demander ma démo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  En soumettant ce formulaire, vous acceptez notre politique de confidentialité. 
                  Nous ne partagerons jamais vos données.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <LandingFooter />
    </div>
  );
}
