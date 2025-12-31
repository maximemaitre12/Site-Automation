import React from 'react';
import { CinematicTourPlayer } from '@/components/tour/CinematicTourPlayer';
import { LandingHeader } from '@/components/landing/LandingHeader';

const ProductTour = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <LandingHeader />
      <CinematicTourPlayer />
    </div>
  );
};

export default ProductTour;
