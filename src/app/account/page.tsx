'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  User,
  ShoppingBag,
  MapPin,
  Star,
  Printer,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Truck,
  Zap,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { printOrderInvoice } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';
import { OrderStatus } from '@/types';

export default function AccountPage() {
  const { language, t, formatPrice } = useI18n();
  const orders = useOrderStore((s) => s.orders ?? []);
  const reviews = useProductStore((s) => s.reviews ?? {});

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'reviews'>('orders');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">{t.account.statusPending}</Badge>;
      case 'processing':
        return <Badge variant="tech">{t.account.statusProcessing}</Badge>;
      case 'shipped':
        return <Badge variant="default">{t.account.statusShipped}</Badge>;
      case 'delivered':
        return <Badge variant="success">{t.account.statusDelivered}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{t.account.statusCancelled}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-start space-y-8">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center font-bold text-xl shadow-sm">
              <User className="w-7 h-7 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">Mohammed Al-Qahtani</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                  Tech Member
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">m.qahtani@example.com • +966 50 123 4567</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border min-w-24">
              <span className="text-base font-bold text-foreground block">{orders.length}</span>
              <span>{t.account.tabs.orders}</span>
            </div>
            <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border min-w-24">
              <span className="text-base font-bold text-foreground block">{reviews.length}</span>
              <span>{t.account.tabs.reviews}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border gap-6 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.account.tabs.orders} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{t.account.tabs.addresses}</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>{t.account.tabs.reviews}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.account.tabs.profile}</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-16 text-center rounded-3xl bg-card border border-dashed border-border text-muted-foreground">
                <p className="text-sm font-semibold">{t.account.noOrders}</p>
                <Link href="/products" className="inline-block mt-4">
                  <Button variant="primary" size="sm">{t.cart.startShopping}</Button>
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4 transition-all"
                  >
                    {/* Order summary row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-foreground">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.account.orderDate} {formatDate(order.createdAt, language)} • {order.items.length} {t.common.items}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-end">
                          <span className="text-xs text-muted-foreground block">{t.cart.total}</span>
                          <span className="text-base font-bold text-foreground">
                            {formatPrice(order.total)}
                          </span>
                        </div>

                        <Button
                          onClick={() => printOrderInvoice(order, language)}
                          variant="outline"
                          size="sm"
                          className="h-9 px-3 text-xs gap-1.5"
                          title="Print invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{language === 'ar' ? 'الفاتورة' : 'Invoice'}</span>
                        </Button>

                        <button
                          onClick={() => toggleExpand(order.id)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable items and timeline */}
                    {isExpanded && (
                      <div className="pt-4 border-t border-border space-y-5 animate-in fade-in duration-200">
                        {/* Timeline */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            {language === 'ar' ? 'سجل تتبع الشحنة' : 'Timeline'}
                          </h4>
                          <div className="space-y-3">
                            {order.timeline.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-3 text-xs">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-foreground capitalize">
                                    {step.status}
                                  </span>
                                  {step.note && (
                                    <p className="text-muted-foreground">
                                      {language === 'ar' ? step.note.ar : step.note.en}
                                    </p>
                                  )}
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {new Date(step.timestamp).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t.orderSuccess.itemsOrdered}
                          </h4>
                          <div className="divide-y divide-border border border-border rounded-2xl p-2 bg-card">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 shrink-0 p-1">
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
                                    <p className="text-[11px] text-muted-foreground">
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
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-card border-2 border-blue-600 dark:border-blue-400 space-y-3 relative shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {language === 'ar' ? 'العنوان الافتراضي (الرئيسي)' : 'Primary Delivery Address'}
                </span>
                <Badge variant="tech">{language === 'ar' ? 'افتراضي' : 'Default'}</Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">Apartment Al-Olaya</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                King Fahd Rd, Tower 4, Apt 1204<br />
                Al-Olaya, Riyadh 12211<br />
                Saudi Arabia<br />
                Phone: +966 50 123 4567
              </p>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-3xl bg-card border border-border space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-border'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{rev.date}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Profile Details Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border max-w-xl space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-foreground pb-2 border-b border-border">
              {t.account.tabs.profile}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block">{t.checkout.fullName}</span>
                <span className="text-foreground font-bold text-sm">Mohammed Al-Qahtani</span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t.checkout.email}</span>
                <span className="text-foreground font-bold text-sm">m.qahtani@example.com</span>
              </div>
              <div>
                <span className="text-muted-foreground block">{t.checkout.phone}</span>
                <span className="text-foreground font-bold text-sm" dir="ltr">+966 50 123 4567</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
