import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, Clock, ArrowRight, Heart, Sparkles, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage for you and your family." },
  { icon: Sparkles, title: "Equity Package", description: "Meaningful equity stake so you share in our success." },
  { icon: Users, title: "Flexible Work", description: "Remote-first culture with optional office spaces in major cities." },
  { icon: Globe, title: "Unlimited PTO", description: "Take the time you need to recharge and do your best work." }
];

const jobs = [
  { 
    title: "Senior Full-Stack Engineer", 
    department: "Engineering", 
    location: "Remote (EU)", 
    type: "Full-time",
    description: "Build the core platform that powers enterprise AI automation."
  },
  { 
    title: "ML Engineer", 
    department: "AI Research", 
    location: "Paris, France", 
    type: "Full-time",
    description: "Develop and optimize our machine learning models for document understanding."
  },
  { 
    title: "Product Manager", 
    department: "Product", 
    location: "Remote (US/EU)", 
    type: "Full-time",
    description: "Drive product strategy and roadmap for our workflow automation suite."
  },
  { 
    title: "Enterprise Account Executive", 
    department: "Sales", 
    location: "New York, USA", 
    type: "Full-time",
    description: "Close strategic deals with Fortune 500 companies."
  },
  { 
    title: "Customer Success Manager", 
    department: "Customer Success", 
    location: "London, UK", 
    type: "Full-time",
    description: "Ensure our enterprise customers achieve their automation goals."
  },
  { 
    title: "UX Designer", 
    department: "Design", 
    location: "Remote (EU)", 
    type: "Full-time",
    description: "Design intuitive interfaces for complex AI-powered workflows."
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AETHER Team
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Help us build the future of enterprise AI. We're looking for passionate people 
              who want to make a real impact.
            </p>
            <Button size="lg" asChild>
              <a href="#openings">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </section>

        {/* Culture */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why AETHER?</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At AETHER, you'll work on challenging problems at the intersection of AI and enterprise software. 
                We're a team of curious, ambitious builders who believe in moving fast without compromising quality.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We value autonomy, transparency, and impact. Everyone has a voice, and the best ideas win – 
                regardless of where they come from. If you're excited about building technology that genuinely 
                changes how businesses operate, you'll fit right in.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Benefits & Perks</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="openings" className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Open Positions</h2>
            <p className="text-muted-foreground text-center mb-12">
              Don't see a perfect fit? Send us your resume at{" "}
              <a href="mailto:careers@aether-ai.com" className="text-primary hover:underline">
                careers@aether-ai.com
              </a>
            </p>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div 
                  key={job.title} 
                  className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-muted-foreground mt-1">{job.description}</p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
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
