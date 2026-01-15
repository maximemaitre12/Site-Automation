import React from 'react';
import { ProductTourHeader } from '@/components/tour/ProductTourHeader';
import { ProductTourVideoPlayer } from '@/components/tour/ProductTourVideoPlayer';

const ProductTour = () => {
  return (
    <div className="h-[100svh] flex flex-col bg-background overflow-hidden">
      <ProductTourHeader />
      <main className="flex-1 min-h-0 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="h-full w-full max-w-7xl mx-auto rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl border border-border">
          <ProductTourVideoPlayer />
        </div>
      </main>
    </div>
  );
};

export default ProductTour;
