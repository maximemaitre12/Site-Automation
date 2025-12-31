import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AetherLogo } from '@/components/ui/aether-logo';

export const ProductTourHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <AetherLogo size="sm" />
          <span className="font-semibold text-lg text-foreground">Aether</span>
        </a>

        {/* Back button (replaces hamburger) */}
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </header>
  );
};
