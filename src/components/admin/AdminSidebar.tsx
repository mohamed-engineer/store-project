'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileSpreadsheet,
  ExternalLink,
  Zap,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { cn } from '@/lib/utils';

export function AdminSidebar({ className, onClose }: { className?: string; onClose?: () => void }) {
  const pathname = usePathname();
  const { language, t, isRtl } = useI18n();

  const navItems = [
    {
      href: '/admin',
      label: t.admin.nav.overview,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/products',
      label: t.admin.nav.products,
      icon: Package,
      exact: false,
    },
    {
      href: '/admin/orders',
      label: t.admin.nav.orders,
      icon: ShoppingBag,
      exact: false,
    },
    {
      href: '/admin/reports',
      label: t.admin.nav.reports,
      icon: FileSpreadsheet,
      exact: false,
    },
  ];

  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <aside
      className={cn(
        'w-64 bg-card border-e border-border flex flex-col justify-between p-4 h-full select-none text-start',
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-foreground block">
              {language === 'ar' ? 'إدارة حكيم تك' : 'Hakim Tech Admin'}
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              {t.admin.liveBadge}
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronIcon className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to storefront */}
      <div className="pt-4 border-t border-border space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4" />
            <span>{t.admin.nav.storefront}</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
