'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { ProductCard } from '@/components/products/ProductCard';

export function FeaturedProducts() {
  const { language, t, isRtl } = useI18n();
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 6 });
  }, [fetchProducts]);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <section className="py-16 bg-background border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 text-start">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t.home.featuredTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t.home.featuredSubtitle}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            {[
              { id: 'all', label: language === 'ar' ? 'الكل' : 'All' },
              { id: 'audio', label: language === 'ar' ? 'سماعات' : 'Audio' },
              { id: 'chargers', label: language === 'ar' ? 'شواحن GaN' : 'Chargers' },
              { id: 'wearables', label: language === 'ar' ? 'ساعات ذكية' : 'Smartwatches' },
              { id: 'power', label: language === 'ar' ? 'بنوك طاقة' : 'Power Banks' },
              { id: 'accessories', label: language === 'ar' ? 'إكسسوارات' : 'Accessories' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-foreground font-bold text-xs transition-all shadow-sm"
          >
            <span>{language === 'ar' ? 'استكشف كافة الأجهزة التقنية' : 'View All Tech Products in Catalog'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
