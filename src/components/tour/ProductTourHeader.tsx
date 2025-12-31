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
    <header className="relative z-50 bg-background border-b border-border/50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo only */}
        <a href="/" className="flex items-center">
          <AetherLogo size="sm" />
        </a>

        {/* Back button */}
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
      </div>
    </header>
  );
};
