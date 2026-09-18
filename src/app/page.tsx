'use client';

import React from 'react';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { Testimonials } from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoBanner />
      <Testimonials />
    </div>
  );
}
