'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, ArrowRight, ArrowLeft, Sparkles, Tag } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/types';

interface InstantSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstantSearchModal({ isOpen, onClose }: InstantSearchModalProps) {
  const router = useRouter();
  const { language, formatPrice, isRtl } = useI18n();
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!query.trim() && selectedCategory === 'all') {
      return products.slice(0, 4); // featured initial suggestions
    }

    const cleanQuery = query.toLowerCase().trim();

    return products.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      if (!matchCategory) return false;

      if (!cleanQuery) return true;

      const titleMatch =
        product.title.en.toLowerCase().includes(cleanQuery) ||
        product.title.ar.toLowerCase().includes(cleanQuery);
      const descMatch =
        product.description.en.toLowerCase().includes(cleanQuery) ||
        product.description.ar.toLowerCase().includes(cleanQuery);
      const skuMatch = product.sku.toLowerCase().includes(cleanQuery);
      const tagMatch = product.tags.some((t) => t.toLowerCase().includes(cleanQuery));

      return titleMatch || descMatch || skuMatch || tagMatch;
    });
  }, [products, query, selectedCategory]);

  const handleSelectProduct = (product: Product) => {
    onClose();
    router.push(`/products/${product.id}`);
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl" className="p-0">
      <div className="flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center gap-3 bg-muted/30">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث فوراً بالاسم، الفئة، أو رقم SKU...' : 'Instant search by name, category, or SKU...'}
            className="w-full bg-transparent text-base sm:text-lg text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Filter Pills */}
        <div className="px-5 py-3 border-b border-border/40 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {language === 'ar' ? 'جميع الأقسام' : 'All Categories'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {language === 'ar' ? cat.name.ar : cat.name.en}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
          {!query.trim() && selectedCategory === 'all' && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground px-2 pb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'المقترحات الأكثر طلباً:' : 'Popular Suggestions:'}</span>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-sm font-medium">
                {language === 'ar' ? 'لم نتمكن من العثور على نتائج مطابقة.' : 'No products found matching your search.'}
              </p>
              <p className="text-xs mt-1">
                {language === 'ar' ? 'جرب البحث بكلمات عامة مثل "عود" أو "عطر" أو "ساعة"' : 'Try searching for general keywords like "oud", "amber", or "watch"'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/40 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0 border border-border/50">
                    <Image
                      src={product.thumbnail}
                      alt={language === 'ar' ? product.title.ar : product.title.en}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {language === 'ar' ? product.title.ar : product.title.en}
                      </h4>
                      {product.isBestSeller && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 max-w-md">
                      {language === 'ar' ? product.description.ar : product.description.en}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-muted-foreground">SKU: {product.sku}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs font-bold text-primary">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <ArrowIcon className="w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-border/60 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {language === 'ar'
              ? `${filteredProducts.length} منتج متاح`
              : `${filteredProducts.length} items available`}
          </span>
          <span className="hidden sm:inline">
            {language === 'ar' ? 'اضغط ESC للإغلاق' : 'Press ESC to exit'}
          </span>
        </div>
      </div>
    </Modal>
  );
}
