'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Tag, Truck, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, FREE_SHIPPING_THRESHOLD } from '@/store/cartStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError(null);
    const result = applyCoupon(couponInput);

    if (result.success) {
      setCouponSuccess(true);
      setCouponError(null);
      setTimeout(() => setCouponSuccess(false), 3000);
    } else {
      setCouponError(
        result.error === 'min_spend'
          ? (language === 'ar' ? 'الحد الأدنى لتطبيق هذا الكوبون هو 200 ر.س' : 'Minimum order amount not met for this coupon')
          : (language === 'ar' ? 'كود الخصم غير صالح أو منتهي الصلاحية' : 'Invalid or expired coupon code')
      );
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 end-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-card border-s border-border shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">{t.cart.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {items.length} {t.common.items}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-5 py-3 bg-amber-500/10 border-b border-amber-500/20 text-xs">
                <div className="flex items-center justify-between font-semibold mb-1.5 text-foreground">
                  <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                    <Truck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {freeShippingRemaining === 0
                      ? t.common.freeShippingEligible
                      : t.common.freeShippingThreshold.replace('{amount}', formatPrice(freeShippingRemaining))}
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{freeShippingPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{t.cart.emptyTitle}</h3>
                      <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
                        {t.cart.emptySubtitle}
                      </p>
                    </div>
                    <Button onClick={closeCart} variant="primary" size="md">
                      <Link href="/products">{t.cart.startShopping}</Link>
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3 rounded-2xl border border-border/80 bg-card/50 hover:border-primary/30 transition-all"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50">
                        <Image
                          src={item.product.thumbnail}
                          alt={language === 'ar' ? item.product.title.ar : item.product.title.en}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-foreground line-clamp-1">
                              {language === 'ar' ? item.product.title.ar : item.product.title.en}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title={t.common.remove}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {(item.selectedColor || item.selectedSize || item.selectedVolume) && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.selectedVolume || item.selectedSize || item.selectedColor}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-border rounded-lg bg-muted/40 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground rounded"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-end">
                            <span className="text-xs font-bold text-primary">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer & Calculations */}
              {items.length > 0 && (
                <div className="p-5 border-t border-border bg-card space-y-4">
                  {/* Coupon Code Section */}
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{couponCode}</span>
                        <span>(-{formatPrice(discount)})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-muted-foreground hover:text-destructive underline font-medium"
                      >
                        {t.common.remove}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder={t.cart.couponPlaceholder}
                            className="w-full h-9 ps-9 pe-3 text-xs bg-muted/40 border border-input rounded-xl uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <Button type="submit" variant="secondary" size="sm" className="h-9 text-xs">
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

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/60">
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

                    <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                      <span>{t.cart.total}</span>
                      <span className="text-primary font-bold text-base">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link href="/checkout" onClick={closeCart} className="block w-full">
                    <Button variant="primary" size="lg" className="w-full gap-2 shadow-md">
                      <span>{t.cart.checkoutBtn}</span>
                      <ArrowIcon className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
