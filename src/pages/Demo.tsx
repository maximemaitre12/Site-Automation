import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  "Personalized demo based on your use cases",
  "ROI estimation for your organization",
  "Discussion with an AETHER expert",
  "Custom implementation plan",
];

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Request sent!", {
      description: "We'll contact you within 24 hours.",
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
                <span className="text-sm font-medium text-primary">Response within 24h</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Request your <span className="text-gradient">personalized demo</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Discover how AETHER can transform your operations. 
                An expert will present features tailored to your needs.
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
            </div>
            
            {/* Right column - Form */}
            <div className="p-8 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Fill out the form
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name *</Label>
                    <Input id="firstName" placeholder="John" required className="bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input id="lastName" placeholder="Doe" required className="bg-background/50" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Professional email *</Label>
                  <Input id="email" type="email" placeholder="john.doe@company.com" required className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" placeholder="Your company name" required className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Director of Operations" className="bg-background/50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Company size</Label>
                  <Select>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">How can we help you?</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your automation needs..."
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
                    "Sending..."
                  ) : (
                    <>
                      Request my demo
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our privacy policy. 
                  We will never share your data.
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