import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import aetherLogo from '@/assets/aether-logo-final.png';

export const ProductTourHeader = () => {
  return (
    <header className="relative z-50 bg-background border-b border-border/50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 h-12 sm:h-14 md:h-16 flex items-center justify-between">
        {/* Logo - responsive size */}
        <Link to="/" className="flex items-center">
          <img src={aetherLogo} alt="Aether" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto" />
        </Link>

        {/* Back button - always goes to LP */}
        <Link
          to="/"
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Retour à l'accueil"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-foreground" />
        </Link>
      </div>
    </header>
  );
};
