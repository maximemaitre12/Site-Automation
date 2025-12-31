import React from 'react';
import { ProductTourHeader } from '@/components/tour/ProductTourHeader';
import { ProductTourVideoPlayer } from '@/components/tour/ProductTourVideoPlayer';

const ProductTour = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProductTourHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl aspect-video max-h-[85svh] rounded-xl overflow-hidden shadow-2xl border border-border">
          <ProductTourVideoPlayer />
        </div>
      </main>
    </div>
  );
};

export default ProductTour;
