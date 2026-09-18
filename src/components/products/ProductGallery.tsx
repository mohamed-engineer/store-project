'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80'];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail column */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0 max-h-[480px]">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all shrink-0 bg-slate-50 dark:bg-slate-900 p-2',
                activeIndex === idx
                  ? 'border-slate-900 dark:border-white shadow-sm scale-102'
                  : 'border-border opacity-70 hover:opacity-100 hover:border-slate-400'
              )}
            >
              <Image src={img} alt={`${title} thumbnail ${idx + 1}`} fill className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}

      {/* Main Active Image Showcase */}
      <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden border border-border bg-slate-50/70 dark:bg-slate-900/60 p-8 shadow-sm group flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            <Image
              src={displayImages[activeIndex]}
              alt={`${title} - view ${activeIndex + 1}`}
              fill
              priority
              className={cn(
                'object-contain transition-transform duration-300 cursor-zoom-in p-4',
                isZoomed ? 'scale-150' : 'group-hover:scale-105'
              )}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom Toggle */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-4 end-4 p-2 rounded-xl bg-background/80 backdrop-blur-md border border-border text-foreground hover:bg-background transition-colors"
          title="Toggle Zoom"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
