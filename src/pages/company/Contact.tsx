import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Send, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const faqs = [
  { q: "How quickly can I get started?", a: "Most customers are up and running within a week. Our team handles onboarding and initial setup." },
  { q: "Do you offer a free trial?", a: "Yes. 14-day free trial with full access to all features. No credit card required." },
  { q: "What integrations do you support?", a: "We integrate with major enterprise tools including Salesforce, HubSpot, Slack, Microsoft 365, and 100+ more." },
  { q: "Is my data secure?", a: "All data is encrypted at rest and in transit. We're GDPR compliant and SOC 2 Type II certified." },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (!formData.email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="pt-16 pb-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">
              Get in Touch
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">
              Contact Us
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Have a question about AETHER? Send us a message and we'll respond within 24 hours.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-8 sm:py-12 px-4 sm:px-6">
          <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <Input
                  id="name" type="text" placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-11 rounded-xl" maxLength={100}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <Input
                  id="email" type="email" placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-11 rounded-xl" maxLength={255}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <Textarea
                  id="message" placeholder="Tell us how we can help..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[130px] resize-none rounded-xl" maxLength={2000}
                />
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-background bg-foreground rounded-full hover:bg-foreground/90 transition-all active:scale-[0.97] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground text-center mb-4">
              Frequently Asked
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight text-center mb-10">
              Common Questions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-6 rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-4">
              Prefer a live conversation?
            </h2>
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-background bg-foreground rounded-full hover:bg-foreground/90 transition-all active:scale-[0.97] group"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
