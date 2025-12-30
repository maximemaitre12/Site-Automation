import React from 'react';
import { cn } from '@/lib/utils';

interface TourAgentWrapperProps {
  children: React.ReactNode;
  title: string;
  url?: string;
  className?: string;
}

export function TourAgentWrapper({ children, title, url, className }: TourAgentWrapperProps) {
  return (
    <div className={cn("w-full max-w-5xl mx-auto", className)}>
      {/* Browser frame */}
      <div className="bg-card rounded-xl border border-border shadow-2xl overflow-hidden">
        {/* Browser header */}
        <div className="bg-muted/50 border-b border-border px-4 py-3 flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          
          {/* URL bar */}
          <div className="flex-1 bg-background/50 rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{url || `app.aether.ai/${title.toLowerCase()}`}</span>
          </div>
          
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-primary">LIVE</span>
          </div>
        </div>
        
        {/* Content area */}
        <div className="bg-background min-h-[400px] max-h-[500px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
