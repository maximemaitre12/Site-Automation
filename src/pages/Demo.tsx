import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Link } from "react-router-dom";

const benefits = [
  "Personalized demo based on your use cases",
  "ROI estimation for your organization",
  "Discussion with an AETHER expert",
  "Custom implementation plan",
];

const demoRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().max(1000).optional(),
});

export default function Demo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    size: "",
    message: "",
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const messageWithContext = [
        formData.message,
        formData.role ? `Role: ${formData.role}` : null,
        formData.size ? `Company size: ${formData.size}` : null,
      ].filter(Boolean).join("\n");
      
      const validated = demoRequestSchema.parse({
        name: fullName,
        email: formData.email,
        company: formData.company || undefined,
        message: messageWithContext || undefined,
      });
      
      const { error } = await supabase
        .from("demo_requests")
        .insert({
          name: validated.name,
          email: validated.email,
          company: validated.company,
          message: validated.message,
          status: "new",
        });
      
      if (error) throw error;
      
      toast.success("Request sent!", {
        description: "We'll contact you within 24 hours.",
      });
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        role: "",
        size: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Please check your input", {
          description: error.errors[0]?.message,
        });
      } else {
        toast.error("Something went wrong", {
          description: "Please try again later.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left column - Info */}
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center gap-3 mb-6">
                <Link 
                  to="/" 
                  className="w-10 h-10 rounded-full bg-secondary/80 border border-border/50 flex items-center justify-center hover:bg-secondary hover:border-primary/30 hover:scale-105 transition-all duration-300 group"
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Response within 24h</span>
                </div>
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
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      className="bg-background/50"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      className="bg-background/50"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Professional email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@company.com" 
                    required 
                    className="bg-background/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input 
                    id="company" 
                    placeholder="Your company name" 
                    required 
                    className="bg-background/50"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    placeholder="Director of Operations" 
                    className="bg-background/50"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Company size</Label>
                  <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
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
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
      </div>
    </div>
  );
}
