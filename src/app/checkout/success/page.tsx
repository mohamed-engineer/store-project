'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Printer,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Truck,
  MapPin,
  Zap,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { printOrderInvoice } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'HKM-9104';

  const { language, t, formatPrice, isRtl } = useI18n();
  const getOrderByNumber = useProductStore((s) => s.getOrderByNumber);

  const order = getOrderByNumber(orderNumber) || useProductStore((s) => s.orders[0]);

  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#3b82f6', '#10b981', '#0f172a'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    if (order) {
      printOrderInvoice(order, language);
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-start space-y-8">
        {/* Success Header Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 stroke-[2]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {t.orderSuccess.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {t.orderSuccess.subtitle.replace('{orderNumber}', order?.orderNumber || orderNumber)}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground font-mono font-bold text-sm">
            <span>{order?.orderNumber || orderNumber}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        {order && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border space-y-6 shadow-sm">
            {/* Tracking Status Timeline */}
            <div className="space-y-3 pb-6 border-b border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {language === 'ar' ? 'متابعة مسار الشحنة' : 'Fulfillment Status'}
              </h3>

              <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                {[
                  { status: 'pending', label: language === 'ar' ? 'تم الاستلام' : 'Received' },
                  { status: 'processing', label: language === 'ar' ? 'قيد التجهيز' : 'Processing' },
                  { status: 'shipped', label: language === 'ar' ? 'تم الشحن' : 'Shipped' },
                  { status: 'delivered', label: language === 'ar' ? 'تم التوصيل' : 'Delivered' },
                ].map((step, idx) => {
                  const isCurrent = order.status === step.status;
                  const isPast =
                    ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx;

                  return (
                    <div key={step.status} className="space-y-1.5">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isPast ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-semibold block ${
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : isPast
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs border border-border">
                  <span className="text-muted-foreground">
                    {language === 'ar' ? 'رقم بوليصة الشحن السريع:' : 'Tracking Number:'}
                  </span>
                  <span className="font-mono font-bold text-foreground">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Shipping & Payment summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border text-xs">
              <div className="space-y-1.5">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{t.orderSuccess.shippingDetails}</span>
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {order.customer.fullName}<br />
                  {order.customer.streetAddress}, {order.customer.district}<br />
                  {order.customer.city}, {order.customer.country}<br />
                  {order.customer.phone}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-foreground">
                  {t.orderSuccess.paymentDetails}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {language === 'ar' ? 'طريقة الدفع:' : 'Method:'} {order.paymentMethod.toUpperCase()}<br />
                  {language === 'ar' ? 'حالة السداد:' : 'Status:'} {order.paymentStatus.toUpperCase()}<br />
                  {language === 'ar' ? 'تاريخ الطلب:' : 'Date:'} {formatDate(order.createdAt, language)}
                </p>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-3 pb-6 border-b border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t.orderSuccess.itemsOrdered}
              </h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 border border-border p-1">
                        <Image
                          src={item.productImage}
                          alt={language === 'ar' ? item.productTitle.ar : item.productTitle.en}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {language === 'ar' ? item.productTitle.ar : item.productTitle.en}
                        </p>
                        <p className="text-muted-foreground text-[11px]">
                          Qty: {item.quantity} {item.variantInfo ? `• ${item.variantInfo}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span className="font-semibold text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{t.cart.discount}</span>
                  <span className="font-semibold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.cart.tax}</span>
                <span className="font-semibold text-foreground">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span className="font-semibold text-foreground">
                  {order.shipping === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {t.cart.shippingFree}
                    </span>
                  ) : (
                    formatPrice(order.shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-foreground pt-3 border-t border-border">
                <span>{t.cart.total}</span>
                <span className="text-foreground text-xl font-black">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button onClick={handlePrint} variant="outline" size="md" className="gap-2 flex-1 text-xs">
                <Printer className="w-4 h-4" />
                <span>{t.orderSuccess.downloadInvoice}</span>
              </Button>

              <Link href="/" className="flex-1">
                <Button variant="primary" size="md" className="w-full gap-2 font-bold text-xs">
                  <span>{t.orderSuccess.continueShopping}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted-foreground">Loading order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
