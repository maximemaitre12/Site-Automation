import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Clock, MessageSquare, Headphones, Building } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const offices = [
  { city: "Paris", country: "France", address: "42 Avenue des Champs-Élysées, 75008", timezone: "CET (UTC+1)" },
  { city: "New York", country: "USA", address: "350 Fifth Avenue, Suite 7520, NY 10118", timezone: "EST (UTC-5)" },
  { city: "London", country: "UK", address: "1 Canada Square, Canary Wharf, E14 5AB", timezone: "GMT (UTC+0)" }
];

const contactOptions = [
  { icon: MessageSquare, title: "Sales Inquiries", email: "sales@aether-ai.com", description: "Talk to our team about enterprise solutions." },
  { icon: Headphones, title: "Customer Support", email: "support@aether-ai.com", description: "Get help with your existing account." },
  { icon: Building, title: "Partnerships", email: "partnerships@aether-ai.com", description: "Explore collaboration opportunities." }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours."
    });
    setFormData({ name: "", email: "", company: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Get in{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions about AETHER? We'd love to hear from you. 
              Our team is ready to help.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option) => (
                <div key={option.title} className="p-6 rounded-xl border border-border bg-card text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <a href={`mailto:${option.email}`} className="text-primary hover:underline text-sm">
                    {option.email}
                  </a>
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
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                      <Input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@company.com"
                        required
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                      <Input 
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <Textarea 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your needs..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Offices */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Our Offices</h2>
                <div className="space-y-6">
                  {offices.map((office) => (
                    <div key={office.city} className="p-6 rounded-xl border border-border bg-card">
                      <h3 className="font-semibold text-foreground text-lg mb-3">
                        {office.city}, {office.country}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>{office.timezone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-2">Looking for support?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Existing customers can access our help center for faster assistance.
                  </p>
                  <Button variant="outline" size="sm">
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
