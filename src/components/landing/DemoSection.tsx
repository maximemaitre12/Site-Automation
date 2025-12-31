import { Link } from "react-router-dom";
import { Play, Users, TrendingUp, Headphones, Brain, Shield, GitBranch, Database } from "lucide-react";

const agents = [
  { icon: Users, color: "from-violet-500 to-purple-600", name: "HR" },
  { icon: TrendingUp, color: "from-emerald-500 to-teal-600", name: "Sales" },
  { icon: Headphones, color: "from-amber-500 to-orange-600", name: "Support" },
  { icon: Brain, color: "from-cyan-500 to-blue-600", name: "Brain" },
  { icon: Shield, color: "from-red-500 to-rose-600", name: "Compliance" },
  { icon: GitBranch, color: "from-indigo-500 to-violet-600", name: "Flow" },
  { icon: Database, color: "from-orange-500 to-amber-600", name: "Data" },
];

export function DemoSection() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Play className="w-3.5 h-3.5" />
          <span>Interactive Demo</span>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-3">
          See the Platform in Action
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-10">
          Take a guided tour of all 7 AI agents and discover how they work together to automate your business.
        </p>
        
        {/* Preview card */}
        <Link to="/product-tour" className="block">
          <div className="relative group cursor-pointer max-w-3xl mx-auto">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-violet-500/20 to-primary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Card */}
            <div className="relative rounded-2xl border border-border bg-card p-8 sm:p-10 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
              {/* Agent icons */}
              <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                {agents.map((agent) => (
                  <div
                    key={agent.name}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${agent.color} shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    title={agent.name}
                  >
                    <agent.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                ))}
              </div>
              
              {/* Play button */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground ml-1" />
              </div>
              
              {/* Text */}
              <p className="mt-6 text-base sm:text-lg font-semibold text-foreground">
                Start Interactive Tour
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                3 minutes • No signup required
              </p>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
