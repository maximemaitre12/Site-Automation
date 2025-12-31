import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import aetherLogo from '@/assets/aether-new-logo.jpeg';

export const ProductTourHeader = () => {
  return (
    <header className="relative z-50 bg-background border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo - same size as LP */}
        <Link to="/" className="flex items-center">
          <img src={aetherLogo} alt="Aether" className="h-14 w-auto" />
        </Link>

        {/* Back button - always goes to LP */}
        <Link
          to="/"
          className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </Link>
      </div>
    </header>
  );
};
