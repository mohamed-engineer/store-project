'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useRealtimeNotifications } from '@/context/RealtimeNotificationContext';
import { useI18n } from '@/context/I18nContext';

export function ToastContainer() {
  const { notifications, dismissNotification } = useRealtimeNotifications();
  const { language, formatPrice, isRtl } = useI18n();

  return (
    <div
      className="fixed bottom-6 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4"
      style={{ [isRtl ? 'left' : 'right']: '1.5rem' }}
    >
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-card/95 backdrop-blur-md border border-blue-500/30 rounded-2xl shadow-xl text-card-foreground"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>

            <div className="flex-1 min-w-0 text-start">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {language === 'ar' ? 'طلب وارد جديد!' : 'New Order Received!'}
                </span>
                <button
                  onClick={() => dismissNotification(n.id)}
                  className="text-muted-foreground hover:text-foreground p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs font-bold text-foreground mt-0.5 truncate">
                {n.customerName}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                <span className="font-mono font-medium text-foreground">{n.orderNumber}</span>
                <span className="font-bold text-foreground">{formatPrice(n.total)}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-border flex items-center justify-end">
                <Link
                  href="/admin/orders"
                  onClick={() => dismissNotification(n.id)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>{language === 'ar' ? 'عرض في لوحة الإدارة' : 'View in Admin'}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
