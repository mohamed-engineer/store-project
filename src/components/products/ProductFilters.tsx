'use client';

import React from 'react';
import { Filter, RotateCcw, Star, Check } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  maxCatalogPrice: number;
}

export function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  maxCatalogPrice = 2000,
}: ProductFiltersProps) {
  const { language, t, formatPrice } = useI18n();
  const categories = useProductStore((s) => s.categories);
  const products = useProductStore((s) => s.products);

  const handleCategoryChange = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? 'all' : slug,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      maxPrice: Number(e.target.value),
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating,
    });
  };

  const handleStockToggle = () => {
    onFilterChange({
      ...filters,
      inStockOnly: !filters.inStockOnly,
    });
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-6 shadow-sm text-start sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border">
        <div className="flex items-center gap-2 font-bold text-foreground text-sm">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{t.catalog.filterTitle}</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.catalog.clearFilters}</span>
        </button>
      </div>

      {/* Category Section */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.catalog.categoryFilter}
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ ...filters, category: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.category === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                : 'text-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>{t.common.all}</span>
            <span className="text-[11px] opacity-70">{products.length}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            const count = products.filter((p) => p.category === cat.slug).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                    : 'text-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{language === 'ar' ? cat.name.ar : cat.name.en}</span>
                <span className="text-[11px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.catalog.priceRange}
          </h4>
          <span className="text-xs font-bold text-foreground font-mono">
            {formatPrice(filters.maxPrice)}
          </span>
        </div>

        <input
          type="range"
          min={50}
          max={maxCatalogPrice}
          step={25}
          value={filters.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{formatPrice(50)}</span>
          <span>{formatPrice(maxCatalogPrice)}</span>
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t.catalog.ratingFilter}
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => {
            const isSelected = filters.minRating === stars;
            return (
              <button
                key={stars}
                onClick={() => handleRatingChange(stars)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-foreground font-bold'
                    : 'text-foreground hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ms-1.5 text-xs text-muted-foreground">
                    {language === 'ar' ? 'فأكثر' : '& up'}
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Checkbox */}
      <div className="pt-2 border-t border-border">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={handleStockToggle}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-border"
          />
          <span className="text-xs font-semibold text-foreground">
            {t.catalog.inStockOnly}
          </span>
        </label>
      </div>
    </div>
  );
}
