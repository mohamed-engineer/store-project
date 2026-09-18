'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Copy, Check, Zap } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export function PromoBanner() {
  const { language, t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('TECH10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-14 shadow-xl text-white text-start">
          {/* Subtle Ambient light */}
          <div className="absolute top-0 end-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t.home.promoBannerTag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.home.promoBannerTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {t.home.promoBannerSubtitle}
            </p>

            {/* Coupon Code Pill */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700">
                <Tag className="w-4 h-4 text-blue-400" />
                <span className="font-mono font-bold text-sm tracking-widest text-white">
                  TECH10
                </span>
                <button
                  onClick={handleCopyCoupon}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy coupon code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <Link href="/products?category=chargers">
                <Button variant="tech" size="md" className="font-bold">
                  {t.home.promoBannerCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
