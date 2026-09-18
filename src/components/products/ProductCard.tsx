'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { calculateDiscount, cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { language, formatPrice } = useI18n();
  const addItem = useCartStore((s) => s.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const discount = calculateDiscount(product.price, product.compareAtPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      className={cn(
        'group relative bg-card rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden',
        className
      )}
    >
      <div>
        {/* Thumbnail Image container */}
        <Link href={`/products/${product.id}`} className="block relative aspect-square w-full overflow-hidden bg-slate-50 dark:bg-slate-900/60 p-6">
          <Image
            src={product.thumbnail}
            alt={language === 'ar' ? product.title.ar : product.title.en}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5 z-10">
            {discount > 0 && (
              <Badge variant="destructive" className="font-bold text-[10px]">
                -{discount}%
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="tech" className="text-[10px] uppercase">
                {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
              </Badge>
            )}
            {product.isNew && (
              <Badge variant="default" className="text-[10px] uppercase">
                {language === 'ar' ? 'جديد' : 'New'}
              </Badge>
            )}
          </div>

          {/* Stock Tag if low */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute bottom-2 start-2 end-2 bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold py-1 px-2 rounded-lg text-center">
              {language === 'ar' ? `متبقي ${product.stock} قطع بالمخزون!` : `Only ${product.stock} left in stock!`}
            </div>
          )}
        </Link>

        {/* Product Info */}
        <div className="p-4 sm:p-5 space-y-2 text-start">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize text-[11px] font-semibold tracking-wider text-muted-foreground">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-foreground text-xs">{product.rating}</span>
              <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {language === 'ar' ? product.title.ar : product.title.en}
            </h3>
          </Link>

          {/* Description preview */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {language === 'ar' ? product.description.ar : product.description.en}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Footer */}
      <div className="p-4 sm:p-5 pt-0 border-t border-border/40 mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-col text-start">
          <span className="text-base sm:text-lg font-black text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          variant={isAdded ? "secondary" : "primary"}
          size="sm"
          className={cn(
            "rounded-xl gap-1.5 transition-all text-xs font-semibold px-3",
            isAdded && "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600"
          )}
          aria-label={language === 'ar' ? 'إضافة للسلة' : 'Add to cart'}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'أُضيف' : 'Added'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
