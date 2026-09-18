'use client';

import React, { useState } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Zap,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ArrowLeft,
  Cpu,
  BatteryCharging,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useI18n } from '@/context/I18nContext';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ReviewsSection } from '@/components/products/ReviewsSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { calculateDiscount, cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { language, t, formatPrice, isRtl } = useI18n();
  const products = useProductStore((s) => s.products);
  const fetchProductById = useProductStore((s) => s.fetchProductById);
  const addItem = useCartStore((s) => s.addItem);

  React.useEffect(() => {
    if (id && !products.some((product) => product.id === id)) {
      fetchProductById(id).catch((error) => console.error('Failed to fetch product details:', error));
    }
  }, [id, products, fetchProductById]);

  const product = products.find((item) => item.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'shipping'>('specs');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
        </h2>
        <Link href="/products">
          <Button variant="primary">{t.cart.continueShopping}</Button>
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.[selectedVariantIndex];
  const priceModifier = selectedVariant?.priceModifier || 0;
  const currentPrice = product.price + priceModifier;
  const comparePrice = product.compareAtPrice ? product.compareAtPrice + priceModifier : undefined;
  const discount = calculateDiscount(currentPrice, comparePrice);

  const handleAddToCart = () => {
    addItem(product, quantity, {
      color: selectedVariant?.type === 'color' ? selectedVariant.name[language] : undefined,
      size: selectedVariant?.type === 'size' ? selectedVariant.name[language] : undefined,
      volume: selectedVariant?.type === 'volume' ? selectedVariant.name[language] : undefined,
      priceModifier,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, {
      color: selectedVariant?.type === 'color' ? selectedVariant.name[language] : undefined,
      size: selectedVariant?.type === 'size' ? selectedVariant.name[language] : undefined,
      volume: selectedVariant?.type === 'volume' ? selectedVariant.name[language] : undefined,
      priceModifier,
    });
    router.push('/checkout');
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 text-start">
          <Link href="/" className="hover:text-foreground">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">
            {t.nav.shop}
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-xs">
            {language === 'ar' ? product.title.ar : product.title.en}
          </span>
        </nav>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 text-start">
          {/* Left Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              images={product.images}
              title={language === 'ar' ? product.title.ar : product.title.en}
            />
          </div>

          {/* Right Product Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header & Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="tech" className="text-[11px] uppercase tracking-wider">
                  {product.category}
                </Badge>
                {product.isBestSeller && (
                  <Badge variant="default" className="text-[11px] uppercase font-bold">
                    {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                  </Badge>
                )}
                <span className="text-xs font-mono text-muted-foreground ms-auto">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                {language === 'ar' ? product.title.ar : product.title.en}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount} {language === 'ar' ? 'تقييم موثق' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-border flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  {formatPrice(currentPrice)}
                </span>
                {comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <Badge variant="destructive" className="font-bold text-xs">
                  {language === 'ar' ? `خصم ${discount}%` : `${discount}% OFF`}
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {language === 'ar' ? product.description.ar : product.description.en}
            </p>

            {/* Variants Picker if available */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>{t.product.selectVariant}</span>
                  <span className="text-foreground font-semibold">
                    {selectedVariant?.name[language]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={cn(
                        'px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2',
                        selectedVariantIndex === idx
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 shadow-sm'
                          : 'border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground'
                      )}
                    >
                      {v.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.name[language]}</span>
                      {v.priceModifier && v.priceModifier > 0 && (
                        <span className="text-[10px] opacity-70">
                          (+{formatPrice(v.priceModifier)})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Stock Indicator */}
            <div className="text-xs font-semibold">
              {product.stock > 5 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {t.common.inStock} ({product.stock} {language === 'ar' ? 'قطعة متوفرة للشحن الفوري' : 'units in stock'})
                </span>
              ) : product.stock > 0 ? (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-current" />
                  {t.common.lowStock.replace('{count}', product.stock.toString())}
                </span>
              ) : (
                <span className="text-destructive flex items-center gap-1.5">
                  {t.common.outOfStock}
                </span>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-border rounded-xl bg-slate-50 dark:bg-slate-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-9 text-center text-xs font-bold font-mono text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart */}
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  variant={isAdded ? "secondary" : "primary"}
                  size="lg"
                  className={cn("flex-1 text-xs sm:text-sm font-bold gap-2 shadow-sm", isAdded && "bg-emerald-600 text-white")}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.product.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{t.product.addToCart}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Instant Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                variant="tech"
                size="lg"
                className="w-full text-xs sm:text-sm font-bold gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{t.product.buyNow}</span>
              </Button>
            </div>

            {/* Trust Assurance Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{language === 'ar' ? 'توصيل سريع خلال 24-48 ساعة' : 'Fast Express 24-48h'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{language === 'ar' ? 'ضمان رسمي لمدة سنتين' : '2-Year Official Warranty'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Tabbed Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-card border border-border text-start space-y-6 shadow-sm">
          <div className="flex border-b border-border gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'specs'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.product.specifications}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'shipping'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.product.shippingAndReturns}
            </button>
          </div>

          {activeTab === 'specs' ? (
            <div className="space-y-4 text-xs sm:text-sm">
              <h4 className="font-bold text-foreground">{t.product.fragranceNotes}</h4>
              <ul className="space-y-2.5 text-muted-foreground">
                {(language === 'ar' ? product.features.ar : product.features.en).map(
                  (feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          ) : (
            <div className="space-y-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              <p>
                {language === 'ar'
                  ? 'جميع الأجهزة التقنية مشمولة بضمان استبدال وصيانة رسمي لمدة سنتين ضد عيوب التصنيع. التوصيل متوفر لكافة مدن المملكة العربية السعودية ودول الخليج.'
                  : 'All tech products come with a 2-Year official replacement and repair warranty against manufacturer defects. Express shipping across KSA and GCC.'}
              </p>
              <p>
                {language === 'ar'
                  ? 'نوفر سياسة استبدال واسترجاع سهلة وميسرة لمدة 30 يوماً من تاريخ استلام الشحنة.'
                  : 'We offer an effortless 30-day return policy for unopened and undamaged items.'}
              </p>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <ReviewsSection product={product} />
      </div>
    </div>
  );
}
