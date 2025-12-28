import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Users, Target, Lightbulb, Award, Globe, Zap, Rocket, GraduationCap, MapPin, Sparkles } from "lucide-react";

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

const founders = [
  { 
    name: "Youriy", 
    role: "Co-Founder & CEO", 
    initials: "Y",
    bio: "Passionate about AI and entrepreneurship, Youriy brings a unique vision for democratizing enterprise automation."
  },
  { 
    name: "Maxime Maître", 
    role: "Co-Founder & CTO", 
    initials: "MM",
    bio: "With deep expertise in machine learning and software architecture, Maxime leads the technical vision of AETHER."
  }
];

const timeline = [
  { year: "2023", event: "First Meeting", description: "Youriy and Maxime meet at emlyon business school and discover a shared passion for AI" },
  { year: "2024", event: "Shanghai Roommates", description: "During their exchange in Shanghai, they become roommates and the AETHER idea takes shape" },
  { year: "2024", event: "First Prototype", description: "Late nights in their Shanghai apartment lead to the first working version of AETHER" },
  { year: "2025", event: "Official Launch", description: "AETHER launches globally with growing enterprise client base across Europe and Asia" }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-12 md:py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4 md:mb-6">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium">Born in Shanghai, Built for the World</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6">
              Two Students.{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-accent bg-clip-text text-transparent">
                One Vision.
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              AETHER was born from a simple observation: enterprises spend too much time on repetitive tasks. 
              We're here to change that with the power of AI.
            </p>
          </div>
        </section>

        {/* Origin Story */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">emlyon business school</p>
                    <p className="text-sm text-muted-foreground">2nd Year Exchange Program</p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  A Story That Began in{" "}
                  <span className="text-primary">Shanghai</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Youriy</strong> and <strong className="text-foreground">Maxime Maître</strong> first 
                    met a year and a half ago at emlyon business school. Two ambitious second-year students who quickly 
                    bonded over their shared passion for technology and entrepreneurship.
                  </p>
                  <p>
                    Four months ago, fate brought them even closer: they became roommates during their exchange program 
                    in Shanghai – a city where the future feels tangible, where innovation pulses through every street corner. 
                    Living together, they discovered they shared the same frustration: why were businesses still drowning in 
                    manual, repetitive tasks when AI could handle them?
                  </p>
                  <p>
                    Late-night coding sessions in their Putuo apartment. Endless discussions about machine learning over 
                    xiaolongbao. A shared conviction that enterprise AI should be accessible to everyone.
                    This is how AETHER was born.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-violet-500/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&h=400&fit=crop"
                    alt="Shanghai Skyline"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Shanghai, China – Where it all started</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4 text-center">Meet the Founders</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Two visionaries who turned a Shanghai dream into a global enterprise AI platform.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {founders.map((founder) => (
                <div 
                  key={founder.name} 
                  className="group relative p-6 md:p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl mx-auto mb-6 bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                    <span className="text-2xl md:text-3xl font-bold text-white">{founder.initials}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-foreground text-center">{founder.name}</h3>
                  <p className="text-primary text-center mb-4 text-sm md:text-base">{founder.role}</p>
                  <p className="text-muted-foreground text-center text-xs md:text-sm">{founder.bio}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">emlyon</span>
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 text-xs font-medium">Shanghai 2024</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 md:py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 md:mb-12 text-center">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-violet-500 to-accent md:-translate-x-0.5" />
              <div className="space-y-8 md:space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className={`relative flex items-center gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-4 md:left-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-primary border-2 md:border-4 border-background md:-translate-x-1.5 md:-translate-x-2" />
                    <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                      <div className="p-4 md:p-6 rounded-xl border border-border bg-card">
                        <span className="text-xs font-bold text-primary">{item.year}</span>
                        <h3 className="text-base md:text-lg font-semibold text-foreground mt-1">{item.event}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4 text-center">Our Values</h2>
            <p className="text-muted-foreground text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm md:text-base px-2">
              The principles that guide everything we build at AETHER.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {values.map((value) => (
                <div key={value.title} className="group p-4 md:p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary/10 to-violet-500/10 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <value.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent mb-2">100+</div>
                <div className="text-muted-foreground text-sm">Enterprise Clients</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent mb-2">10M+</div>
                <div className="text-muted-foreground text-sm">Tasks Automated</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent mb-2">12+</div>
                <div className="text-muted-foreground text-sm">Team Members</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent mb-2">8+</div>
                <div className="text-muted-foreground text-sm">Countries</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Rocket className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Journey</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're building the future of enterprise automation. Want to be part of the adventure?
            </p>
            <div className="flex justify-center gap-4">
              <a href="/careers" className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                View Careers
              </a>
              <a href="/contact" className="px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}