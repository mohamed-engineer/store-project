'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { printOrderInvoice } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const { language, t, formatPrice } = useI18n();
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  if (!order) return null;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    updateOrderStatus(
      order.id,
      newStatus,
      `Status updated to ${newStatus} by admin`,
      `تم تحديث الحالة إلى ${newStatus} بواسطة الإدارة`
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t.admin.orders.orderDetails} - ${order.orderNumber}`}
      maxWidth="3xl"
    >
      <div className="space-y-6 text-start">
        {/* Status Selector Bar */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground block">{t.admin.orders.filterStatus}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-foreground capitalize">{order.status}</span>
              <span className="text-xs text-muted-foreground font-mono">
                • {formatDate(order.createdAt, language)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={order.status}
              onChange={handleStatusChange}
              className="h-10 px-3 text-xs font-bold bg-card border border-input rounded-xl focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button
              onClick={() => printOrderInvoice(order, language)}
              variant="outline"
              size="sm"
              className="h-10 gap-1.5 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.admin.orders.printInvoice}</span>
            </Button>
          </div>
        </div>

        {/* Customer and Shipping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl border border-border text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{t.admin.orders.customerInfo}</span>
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              <strong>{order.customer.fullName}</strong><br />
              {order.customer.streetAddress}, {order.customer.district}<br />
              {order.customer.city}, {order.customer.country}<br />
              {order.customer.phone} • {order.customer.email}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-foreground">
              {t.admin.orders.paymentMethod} & Tracking
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Payment: <strong>{order.paymentMethod.toUpperCase()}</strong> ({order.paymentStatus.toUpperCase()})<br />
              Coupon: {order.couponCode || 'None'}<br />
              Tracking: <span className="font-mono">{order.trackingNumber || 'Pending'}</span>
            </p>
          </div>
        </div>

        {/* Ordered Line Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.admin.orders.orderItems}
          </h4>
          <div className="divide-y divide-border/60 border border-border rounded-2xl p-2 bg-card">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.productImage}
                      alt={language === 'ar' ? item.productTitle.ar : item.productTitle.en}
                      fill
                      className="object-cover"
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

        {/* Financial Summary */}
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/80 space-y-1.5 text-xs text-muted-foreground">
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
            <span className="font-semibold text-foreground">{formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-foreground pt-2 border-t border-border">
            <span>{t.cart.total}</span>
            <span className="text-primary font-black text-base">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            {t.common.close}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
