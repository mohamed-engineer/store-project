'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, BatteryCharging, Cpu } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export function HeroBanner() {
  const { language, t, isRtl } = useI18n();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-background pt-8 pb-16 lg:py-20 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-start"
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'ar' ? 'أحدث تقنيات الشحن والصوتيات ٢٠٢٦' : 'Next-Gen GaN & Smart Wireless Gear'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              {language === 'ar' ? (
                <>
                  إلكترونيات الجيل القادم <span className="text-blue-600 dark:text-blue-400">لأداء فائق</span>
                </>
              ) : (
                <>
                  Next-Gen Tech for <span className="text-blue-600 dark:text-blue-400">Peak Performance</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {t.home.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/products">
                <Button variant="primary" size="lg" className="gap-2 text-sm sm:text-base font-bold shadow-md">
                  <span>{t.home.heroCtaPrimary}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/products?category=chargers">
                <Button variant="outline" size="lg" className="text-sm sm:text-base font-semibold">
                  <span>{t.home.heroCtaSecondary}</span>
                </Button>
              </Link>
            </div>

            {/* Key Tech Specs row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80 max-w-lg">
              <div>
                <div className="text-lg sm:text-xl font-black text-foreground flex items-center gap-1">
                  <span>100W</span>
                  <BatteryCharging className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {language === 'ar' ? 'شحن GaN فائق' : 'GaN Fast Charge'}
                </p>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-black text-foreground flex items-center gap-1">
                  <span>45dB</span>
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {language === 'ar' ? 'عزل ضوضاء ANC' : 'Active Noise Cancel'}
                </p>
              </div>

              <div>
                <div className="text-lg sm:text-xl font-black text-foreground flex items-center gap-1">
                  <span>2 Years</span>
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {language === 'ar' ? 'ضمان شامل' : 'Official Warranty'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/4.5] rounded-3xl overflow-hidden border border-border bg-white dark:bg-slate-900 shadow-xl p-8 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=85"
                alt="Hakim Tech Apex Pro Wireless Earbuds"
                fill
                priority
                className="object-contain p-6 hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Tech Spec Badge */}
              <div className="absolute bottom-6 start-6 end-6 p-4 rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-border shadow-lg text-start">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      {language === 'ar' ? 'الأعلى مبيعاً' : 'Flagship Release'}
                    </span>
                    <h4 className="text-sm font-bold text-foreground mt-0.5">
                      {language === 'ar' ? 'سماعات أبيكس برو اللاسلكية' : 'Apex Pro Wireless ANC'}
                    </h4>
                  </div>
                  <div className="text-end">
                    <span className="text-xs text-muted-foreground line-through">499 SAR</span>
                    <p className="text-base font-black text-blue-600 dark:text-blue-400">399 SAR</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
