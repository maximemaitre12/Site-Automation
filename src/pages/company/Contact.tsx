import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, MapPin, Clock, MessageSquare, Headphones, Building, 
  Send, Phone, Globe, Sparkles, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const offices = [
  { 
    city: "Paris", 
    country: "France", 
    address: "Station F, 5 Parvis Alan Turing", 
    postalCode: "75013 Paris",
    timezone: "CET (UTC+1)",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=200&fit=crop"
  },
  { 
    city: "Shanghai", 
    country: "China", 
    address: "Jing'an District, Nanjing West Road", 
    postalCode: "200041 Shanghai",
    timezone: "CST (UTC+8)",
    image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=400&h=200&fit=crop"
  }
];

const contactOptions = [
  { 
    icon: MessageSquare, 
    title: "Sales Inquiries", 
    email: "sales@aether-ai.com", 
    description: "Talk to our team about enterprise solutions and pricing.",
    response: "Response within 24h"
  },
  { 
    icon: Headphones, 
    title: "Customer Support", 
    email: "support@aether-ai.com", 
    description: "Get help with your existing AETHER account.",
    response: "Response within 4h"
  },
  { 
    icon: Building, 
    title: "Partnerships", 
    email: "partnerships@aether-ai.com", 
    description: "Explore integration and collaboration opportunities.",
    response: "Response within 48h"
  }
];

const faqs = [
  {
    question: "How quickly can I get started?",
    answer: "Most customers are up and running within a week. Our team handles onboarding and initial setup."
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required."
  },
  {
    question: "What integrations do you support?",
    answer: "We integrate with 100+ enterprise tools including Salesforce, HubSpot, Slack, Microsoft 365, and more."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We're SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest and in transit."
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Message sent! ✨",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({ name: "", email: "", company: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">We'd Love to Hear From You</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you have a question about features, pricing, or anything else, 
              our team is ready to answer all your questions.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option) => (
                <div key={option.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                  <a 
                    href={`mailto:${option.email}`} 
                    className="text-primary hover:underline text-sm font-medium flex items-center gap-2"
                  >
                    {option.email}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">{option.response}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form + Offices */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="order-2 lg:order-1">
                <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
                <p className="text-muted-foreground mb-6">Fill out the form and we'll be in touch as soon as possible.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                      <Input 
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company"
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                      <Input 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                    <Textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your needs..."
                      rows={5}
                      required
                      className="bg-background"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto shadow-lg shadow-primary/20" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>

              {/* Offices */}
              <div className="order-1 lg:order-2">
                <h2 className="text-2xl font-bold text-foreground mb-2">Our Offices</h2>
                <p className="text-muted-foreground mb-6">Visit us or drop by for a coffee.</p>
                
                <div className="space-y-6">
                  {offices.map((office) => (
                    <div key={office.city} className="rounded-xl overflow-hidden border border-border bg-card">
                      <div className="aspect-[2/1] relative">
                        <img 
                          src={office.image} 
                          alt={office.city}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <h3 className="font-bold text-white text-lg">
                            {office.city}, {office.country}
                          </h3>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                          <div>
                            <p>{office.address}</p>
                            <p>{office.postalCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0 text-primary" />
                          <span>{office.timezone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Global Support
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our team is distributed across Europe and Asia, providing support in multiple timezones.
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Support available now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-6 rounded-xl border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}