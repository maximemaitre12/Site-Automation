import React from 'react';
import { ProductTourHeader } from '@/components/tour/ProductTourHeader';
import { ProductTourVideoPlayer } from '@/components/tour/ProductTourVideoPlayer';

const ProductTour = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <ProductTourHeader />
      <main className="flex-1 min-h-0 p-4">
        <div className="h-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-border">
          <ProductTourVideoPlayer />
        </div>
      </main>
    </div>
  );
};

export default ProductTour;
