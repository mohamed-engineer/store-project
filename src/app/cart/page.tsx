'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, Truck, ShieldCheck, Check } from 'lucide-react';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/cartStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getDiscount,
    getTax,
    getShipping,
    getTotal,
    couponCode,
    applyCoupon,
    removeCoupon,
    getFreeShippingRemaining,
  } = useCartStore();

  const { language, t, formatPrice, isRtl } = useI18n();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const tax = getTax();
  const shipping = getShipping();
  const total = getTotal();
  const freeShippingRemaining = getFreeShippingRemaining();
  const freeShippingPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    const result = await applyCoupon(couponInput);

    if (result.success) {
      setCouponSuccess(true);
      setCouponError(null);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError(
        result.error === 'min_spend'
          ? (language === 'ar' ? 'الحد الأدنى لتطبيق هذا الكوبون هو 150 ر.س' : 'Minimum order amount not met for this coupon')
          : (language === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired coupon code')
      );
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground shadow-sm">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h2 className="text-lg font-bold text-foreground">{t.cart.emptyTitle}</h2>
          <p className="text-xs text-muted-foreground">{t.cart.emptySubtitle}</p>
        </div>
        <Link href="/products">
          <Button variant="primary" size="md">
            {t.cart.startShopping}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-start">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {t.cart.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {items.length} {t.common.items}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Bar */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs">
              <div className="flex items-center justify-between font-semibold mb-2 text-foreground">
                <span className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {freeShippingRemaining === 0
                    ? t.common.freeShippingEligible
                    : t.common.freeShippingThreshold.replace('{amount}', formatPrice(freeShippingRemaining))}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{freeShippingPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Table / List of items */}
            <div className="divide-y divide-border rounded-3xl bg-card border border-border p-2 sm:p-4 shadow-sm">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-border p-2">
                      <Image
                        src={item.product.thumbnail}
                        alt={language === 'ar' ? item.product.title.ar : item.product.title.en}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-sm font-bold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {language === 'ar' ? item.product.title.ar : item.product.title.en}
                        </h3>
                      </Link>
                      {(item.selectedColor || item.selectedSize || item.selectedVolume) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.selectedVolume || item.selectedSize || item.selectedColor}
                        </p>
                      )}
                      <p className="text-xs font-bold text-foreground sm:hidden mt-1">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="flex items-center border border-border rounded-xl bg-slate-50 dark:bg-slate-900 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground rounded"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground rounded"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="hidden sm:block text-sm font-black text-foreground w-28 text-end">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title={t.common.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-sm">
              <h2 className="text-base font-bold text-foreground pb-3 border-b border-border">
                {t.checkout.orderSummary}
              </h2>

              {/* Coupon Form */}
              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold">
                    <Tag className="w-4 h-4" />
                    <span>{couponCode}</span>
                    <span>(-{formatPrice(discount)})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-muted-foreground hover:text-red-600 underline font-semibold"
                  >
                    {t.common.remove}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t.cart.couponPlaceholder}
                      className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-input rounded-xl uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="submit" variant="secondary" size="sm" className="h-10 text-xs px-4">
                      {t.common.apply}
                    </Button>
                  </div>
                  {couponError && <p className="text-[11px] text-destructive">{couponError}</p>}
                  {couponSuccess && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> {t.cart.couponApplied.replace('{code}', couponCode || '')}
                    </p>
                  )}
                </form>
              )}

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-muted-foreground pt-3 border-t border-border">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>{t.cart.discount}</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.cart.tax}</span>
                  <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="font-semibold text-foreground">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {t.cart.shippingFree}
                      </span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
                  <span>{t.cart.total}</span>
                  <span className="text-foreground text-xl font-black">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link href="/checkout" className="block w-full">
                <Button variant="primary" size="lg" className="w-full gap-2 shadow-sm font-bold">
                  <span>{t.cart.checkoutBtn}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-muted-foreground pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{t.checkout.secureNotice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
