'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Layers } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';

export function CategoryGrid() {
  const { language, t, isRtl } = useI18n();
  const categories = useProductStore((s) => s.categories);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-14 bg-slate-50/50 dark:bg-slate-900/30 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 text-start">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>{t.home.categoriesTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t.home.categoriesSubtitle}
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{t.common.viewAll}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative bg-card rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-lg transition-all duration-200 text-start"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 p-4 mb-4">
                <Image
                  src={cat.image}
                  alt={language === 'ar' ? cat.name.ar : cat.name.en}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-out"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language === 'ar' ? cat.name.ar : cat.name.en}
                  </h3>
                  <span className="text-[11px] text-muted-foreground font-semibold">
                    {cat.itemCount}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {language === 'ar' ? cat.description.ar : cat.description.en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
