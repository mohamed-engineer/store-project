'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, X } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters, FilterState } from '@/components/products/ProductFilters';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

function CatalogContent() {
  const searchParams = useSearchParams();
  const { language, t } = useI18n();
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const fetchCategories = useProductStore((s) => s.fetchCategories);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 5000,
    minRating: 0,
    inStockOnly: false,
  });

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      inStockOnly: false,
    });
    setSearchQuery('');
    setSortBy('featured');
  };

  // Filter & Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category
        if (filters.category !== 'all' && product.category !== filters.category) return false;

        // Price
        if (product.price > filters.maxPrice) return false;

        // Rating
        if (filters.minRating > 0 && product.rating < filters.minRating) return false;

        // In Stock
        if (filters.inStockOnly && product.stock <= 0) return false;

        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle =
            product.title.en.toLowerCase().includes(q) ||
            product.title.ar.toLowerCase().includes(q);
          const matchDesc =
            product.description.en.toLowerCase().includes(q) ||
            product.description.ar.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchTags = product.tags.some((tag) => tag.toLowerCase().includes(q));

          if (!matchTitle && !matchDesc && !matchSku && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, filters, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Catalog Header Banner */}
        <div className="mb-10 text-start space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.catalog.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {t.catalog.subtitle.replace('{count}', products.length.toString())}
          </h1>
        </div>

        {/* Top Control Bar (Search + Sort + Mobile Filter Toggle) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border/80 mb-8 shadow-sm">
          {/* Search Input Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.catalog.filterTitle + '...'}
              className="w-full h-11 ps-10 pe-4 text-xs sm:text-sm bg-muted/40 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {/* Mobile Filter Trigger */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden gap-2 text-xs font-semibold rounded-2xl flex-1 sm:flex-none"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>{t.catalog.filterTitle}</span>
            </Button>

            {/* Sort Selector */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="h-11 ps-4 pe-8 text-xs font-semibold bg-muted/40 border border-input rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground"
              >
                <option value="featured">{t.catalog.sortFeatured}</option>
                <option value="price-asc">{t.catalog.sortPriceLowHigh}</option>
                <option value="price-desc">{t.catalog.sortPriceHighLow}</option>
                <option value="newest">{t.catalog.sortNewest}</option>
                <option value="rating">{t.catalog.sortTopRated}</option>
              </select>
              <ArrowUpDown className="absolute end-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Layout Grid (Sidebar Filters + Products Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              maxCatalogPrice={5000}
            />
          </div>

          {/* Product Cards Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                {t.catalog.showingCount
                  .replace('{shown}', filteredAndSortedProducts.length.toString())
                  .replace('{total}', products.length.toString())}
              </span>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-card border border-dashed border-border space-y-4">
                <p className="text-base font-bold text-foreground">{t.catalog.noProducts}</p>
                <p className="text-xs text-muted-foreground">{t.catalog.noProductsSub}</p>
                <Button onClick={handleResetFilters} variant="primary" size="sm">
                  {t.catalog.clearFilters}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title={t.catalog.filterTitle}
        maxWidth="md"
      >
        <ProductFilters
          filters={filters}
          onFilterChange={(newFilters) => {
            setFilters(newFilters);
            setIsMobileFilterOpen(false);
          }}
          onReset={() => {
            handleResetFilters();
            setIsMobileFilterOpen(false);
          }}
          maxCatalogPrice={5000}
        />
      </Modal>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted-foreground">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
