import React from 'react';
import { ProductTourHeader } from '@/components/tour/ProductTourHeader';
import { ProductTourVideoPlayer } from '@/components/tour/ProductTourVideoPlayer';

const ProductTour = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProductTourHeader />
      <main className="pt-24 pb-16">
        <ProductTourVideoPlayer />
      </main>
    </div>
  );
};

export default ProductTour;
