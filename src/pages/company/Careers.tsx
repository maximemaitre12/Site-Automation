import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Briefcase, Clock, ArrowRight, Heart, Sparkles, Users, Globe, 
  Rocket, Coffee, GraduationCap, Plane, Code, Brain, TrendingUp, Headphones
} from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision coverage. Mental health support included." },
  { icon: Sparkles, title: "Equity Package", description: "Meaningful equity stake so you share in our success from day one." },
  { icon: Globe, title: "Remote-First", description: "Work from anywhere. We're a distributed team across Europe and Asia." },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need. We trust you to manage your schedule." },
  { icon: Coffee, title: "Home Office Budget", description: "€2,000 to set up your perfect workspace, plus monthly stipend." },
  { icon: GraduationCap, title: "Learning Budget", description: "€1,500 yearly for courses, conferences, and books." },
  { icon: Users, title: "Team Retreats", description: "Quarterly gatherings in exciting locations. Last one was in Lisbon!" },
  { icon: Rocket, title: "Latest Tech", description: "MacBook Pro, any tools you need. We invest in your productivity." }
];

const jobs = [
  { 
    title: "Senior Full-Stack Engineer", 
    department: "Engineering", 
    location: "Remote (EU)", 
    type: "Full-time",
    description: "Build the core platform that powers enterprise AI automation. You'll work on our workflow engine, integrations, and real-time processing systems.",
    requirements: ["5+ years experience", "TypeScript/React", "Node.js or Python", "Database design"],
    icon: Code
  },
  { 
    title: "ML Engineer", 
    department: "AI Research", 
    location: "Paris or Remote", 
    type: "Full-time",
    description: "Develop and optimize our machine learning models for document understanding, NLP, and predictive analytics.",
    requirements: ["3+ years ML experience", "PyTorch or TensorFlow", "NLP expertise", "Production ML systems"],
    icon: Brain
  },
  { 
    title: "Product Manager", 
    department: "Product", 
    location: "Remote (EU/US)", 
    type: "Full-time",
    description: "Drive product strategy and roadmap for our workflow automation suite. Work closely with customers and engineering.",
    requirements: ["4+ years PM experience", "B2B SaaS background", "Technical aptitude", "Customer focus"],
    icon: Rocket
  },
  { 
    title: "Enterprise Account Executive", 
    department: "Sales", 
    location: "Paris or London", 
    type: "Full-time",
    description: "Close strategic deals with enterprise companies. Build relationships with C-level executives.",
    requirements: ["5+ years enterprise sales", "SaaS experience", "Proven track record", "Hunter mentality"],
    icon: TrendingUp
  },
  { 
    title: "Customer Success Manager", 
    department: "Customer Success", 
    location: "Remote (EU)", 
    type: "Full-time",
    description: "Ensure our enterprise customers achieve their automation goals. Drive adoption and expansion.",
    requirements: ["3+ years CSM experience", "Technical background", "Enterprise customers", "Problem solver"],
    icon: Headphones
  },
  { 
    title: "DevOps Engineer", 
    department: "Infrastructure", 
    location: "Remote (EU)", 
    type: "Full-time",
    description: "Build and maintain our cloud infrastructure. Ensure reliability, security, and performance at scale.",
    requirements: ["4+ years DevOps", "Kubernetes", "AWS or GCP", "Infrastructure as Code"],
    icon: Code
  }
];

const values = [
  { 
    title: "Move Fast, Ship Quality",
    description: "We iterate quickly but never compromise on quality. Every feature we ship is something we're proud of."
  },
  { 
    title: "Customer Obsession",
    description: "Our customers' success is our success. We listen deeply and build what truly matters."
  },
  { 
    title: "Radical Transparency",
    description: "We share openly – financials, strategy, challenges. Everyone has the context to make great decisions."
  },
  { 
    title: "Ownership Mentality",
    description: "Take initiative. Make decisions. Own the outcome. We trust you to drive your work forward."
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-12 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5" />
          <div className="absolute top-20 right-10 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4 md:mb-6">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">We're Hiring!</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6 px-2">
              Build the Future of{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-accent bg-clip-text text-transparent">
                Enterprise AI
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-4">
              Join a team of ambitious builders creating technology that transforms how businesses work. 
              We're remote-first, fast-moving, and just getting started.
            </p>
            <Button size="lg" asChild className="shadow-lg shadow-primary/25">
              <a href="#openings">
                View Open Positions
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-12 md:py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">Our Story</h2>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  AETHER was founded in 2025 by <strong className="text-foreground">Youriy</strong> and{" "}
                  <strong className="text-foreground">Maxime Maître</strong>, two emlyon business school students 
                  who became roommates during their exchange program in Shanghai.
                </p>
                <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                  What started as late-night conversations in their Putuo apartment has grown into an enterprise AI 
                  platform serving companies across the globe.
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  We're still that same team of curious builders, now looking for more people who share our 
                  passion for solving hard problems and moving fast.
                </p>
                <Link to="/about" className="text-primary font-medium mt-4 inline-flex items-center gap-2 hover:gap-3 transition-all text-sm md:text-base">
                  Read our full story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {values.map((value) => (
                  <div key={value.title} className="p-3 md:p-4 rounded-xl bg-card border border-border">
                    <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1 md:mb-2">{value.title}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 text-center">Why Join AETHER?</h2>
            <p className="text-sm md:text-base text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto px-2">
              We believe in treating our team exceptionally well. Here's what you get.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="p-4 md:p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4">
                    <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 md:mb-2 text-sm md:text-base">{benefit.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{benefit.description}</p>
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
                  className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <job.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req) => (
                          <span key={req} className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Button className="shrink-0 shadow-lg shadow-primary/20">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Not Sure If You're a Fit?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We value potential over credentials. If you're passionate about AI and automation, 
              we'd love to hear from you – even if you don't check every box.
            </p>
            <a 
              href="mailto:careers@aether-ai.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Get in Touch
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}