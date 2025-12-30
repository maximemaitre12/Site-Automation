import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Sparkles, Clock, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TourConclusionProps {
  isActive: boolean;
}

const stats = [
  { icon: Clock, value: '90%', label: 'Time Saved', color: 'text-blue-500' },
  { icon: TrendingUp, value: '3x', label: 'Productivity', color: 'text-emerald-500' },
  { icon: Shield, value: '99%', label: 'Accuracy', color: 'text-amber-500' },
];

const features = [
  '6 Specialized AI Agents',
  'Cross-Agent Intelligence',
  'No-Code Automation',
  'Enterprise Security',
  'Real-Time Analytics',
  '24/7 AI Support',
];

export function TourConclusion({ isActive }: TourConclusionProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isActive) {
      setPhase(0);
      const timers = [
        setTimeout(() => setPhase(1), 300),
        setTimeout(() => setPhase(2), 800),
        setTimeout(() => setPhase(3), 1300),
        setTimeout(() => setPhase(4), 2000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 p-8">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
        {/* Title */}
        <div className={cn(
          "text-center transition-all duration-700",
          phase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Transform Your Business
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of companies already using AETHER to revolutionize their operations
          </p>
        </div>

        {/* Stats */}
        <div className={cn(
          "grid grid-cols-3 gap-8 transition-all duration-700 delay-200",
          phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className={cn(
                "w-16 h-16 mx-auto mb-3 rounded-2xl bg-card border border-border flex items-center justify-center transition-all duration-500",
                phase >= 2 ? "scale-100" : "scale-0"
              )} style={{ transitionDelay: `${i * 100 + 400}ms` }}>
                <stat.icon className={cn("w-8 h-8", stat.color)} />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className={cn(
          "grid grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-700 delay-400",
          phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {features.map((feature, i) => (
            <div
              key={feature}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-border/50 transition-all duration-300",
                phase >= 3 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: `${i * 80 + 600}ms` }}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-600",
          phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <Button asChild size="lg" className="text-lg px-8 py-6 group">
            <Link to="/signup">
              <Sparkles className="w-5 h-5 mr-2" />
              Start for Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
            <Link to="/demo">
              Request a Demo
            </Link>
          </Button>
        </div>

        {/* Trust badge */}
        <p className={cn(
          "text-sm text-muted-foreground transition-all duration-700 delay-700",
          phase >= 4 ? "opacity-100" : "opacity-0"
        )}>
          No credit card required • Free 14-day trial • Cancel anytime
        </p>
      </div>
    </div>
  );
}
