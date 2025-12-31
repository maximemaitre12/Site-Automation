import { Link } from "react-router-dom";
import { Play, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database } from "lucide-react";
import aetherLogo from "@/assets/aether-new-logo.jpeg";

const agents = [
  { icon: Users, color: 'from-violet-500 to-purple-600' },
  { icon: TrendingUp, color: 'from-emerald-500 to-teal-600' },
  { icon: Headphones, color: 'from-amber-500 to-orange-600' },
  { icon: Brain, color: 'from-cyan-500 to-blue-600' },
  { icon: Shield, color: 'from-red-500 to-rose-600' },
  { icon: GitBranch, color: 'from-indigo-500 to-violet-600' },
  { icon: Database, color: 'from-orange-500 to-amber-600' },
];

export function DemoSection() {
  return (
    <section className="py-10 lg:py-12 bg-secondary/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Compact layout: title left, preview right on desktop */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
          {/* Text content */}
          <div className="text-center lg:text-left lg:flex-1">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              See It in Action
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto lg:mx-0">
              Take a 3-minute guided tour of all 7 AI agents.
            </p>
          </div>
          
          {/* Preview card - compact */}
          <Link to="/product-tour" className="block w-full lg:w-auto">
            <div className="relative group cursor-pointer">
              {/* Card */}
              <div className="relative rounded-xl border border-border bg-white dark:bg-slate-900 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col items-center min-w-[280px]">
                {/* Logo */}
                <img 
                  src={aetherLogo} 
                  alt="AETHER" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Agent icons row */}
                <div className="flex items-center gap-1.5 mb-4">
                  {agents.map((agent, index) => {
                    const Icon = agent.icon;
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br ${agent.color} shadow-sm`}
                      >
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                    );
                  })}
                </div>
                
                {/* Play button */}
                <div className="flex items-center gap-2 text-primary group-hover:text-primary/80 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                  <span className="text-sm font-medium">Watch Demo</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
