import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Users, Target, Lightbulb, Award, Globe, Zap } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We believe AI should empower businesses to focus on what truly matters - human creativity and strategic thinking."
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We constantly push the boundaries of what's possible with enterprise AI, staying ahead of the curve."
  },
  {
    icon: Users,
    title: "Customer-Centric",
    description: "Every feature we build starts with understanding our customers' real challenges and needs."
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We hold ourselves to the highest standards in everything we do, from code quality to customer support."
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "We're building technology that transforms how businesses operate across industries worldwide."
  },
  {
    icon: Zap,
    title: "Speed & Agility",
    description: "We move fast, iterate quickly, and adapt to the ever-changing landscape of AI technology."
  }
];

const team = [
  { name: "Alexandre Martin", role: "CEO & Co-Founder", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { name: "Sophie Dubois", role: "CTO & Co-Founder", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face" },
  { name: "Thomas Bernard", role: "VP Engineering", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
  { name: "Marie Laurent", role: "VP Product", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" },
  { name: "Pierre Moreau", role: "VP Sales", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
  { name: "Camille Petit", role: "VP Customer Success", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Building the Future of{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Enterprise AI
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AETHER was founded with a simple vision: make powerful AI accessible to every business, 
              automating repetitive tasks so teams can focus on what humans do best.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Founded in 2023, AETHER emerged from a frustration shared by many enterprise teams: 
                despite the promise of AI, most businesses were still drowning in manual, repetitive tasks. 
                Email classification, document processing, customer support triage – these essential workflows 
                consumed countless hours that could be spent on strategic work.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our founding team, with decades of combined experience in enterprise software and AI research, 
                set out to change this. We built AETHER as an intelligent automation platform that doesn't just 
                process data – it understands context, learns from patterns, and takes action.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Today, AETHER powers automation for hundreds of enterprises across industries, from financial 
                services to healthcare, retail to manufacturing. We're just getting started on our mission to 
                make AI a true partner for every business.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Leadership Team</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Our team brings together expertise from leading tech companies and research institutions.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Enterprise Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50M+</div>
                <div className="text-muted-foreground">Tasks Automated</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">120+</div>
                <div className="text-muted-foreground">Team Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
