'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  CheckCircle,
  Package,
  ShoppingBag,
  DollarSign,
  Printer,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/Button';
import { exportProductsToCSV, exportOrdersToCSV } from '@/lib/exportUtils';

export default function AdminReportsPage() {
  const { language, t, formatPrice } = useI18n();
  const products = useProductStore((s) => s.products ?? []);
  const orders = useOrderStore((s) => s.orders ?? []);

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const metrics = {
    totalRevenue: orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    totalOrders: orders.length,
    averageOrderValue: orders.length ? orders.reduce((sum, order) => sum + Number(order.total || 0), 0) / orders.length : 0,
  };

  const handleExportProducts = () => {
    exportProductsToCSV(products, language);
    setDownloadSuccess(t.admin.reports.exportProductsCsv);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleExportOrders = () => {
    exportOrdersToCSV(orders, language);
    setDownloadSuccess(t.admin.reports.exportOrdersCsv);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-start">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          {t.admin.reports.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {t.admin.reports.subtitle}
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle className="w-4 h-4" />
          <span>{downloadSuccess} - {t.admin.reports.downloadReady}</span>
        </div>
      )}

      {/* Export Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products CSV */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t.admin.reports.exportProductsCsv}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'ar'
                ? 'ملف إكسل كامل يضم كافة المنتجات، رموز SKU، الأسعار، ومستويات المخزون الحالية لغرض الجرد والمحاسبة.'
                : 'Complete spreadsheet containing all SKUs, categories, unit prices, and live stock levels for inventory auditing.'}
            </p>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground font-mono">
              {products.length} {t.common.items}
            </span>
            <Button onClick={handleExportProducts} variant="gold" size="sm" className="gap-2 font-bold">
              <Download className="w-4 h-4" />
              <span>{language === 'ar' ? 'تحميل CSV' : 'Download CSV'}</span>
            </Button>
          </div>
        </div>

        {/* Orders CSV */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {t.admin.reports.exportOrdersCsv}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {language === 'ar'
                ? 'سجل المبيعات والطلبات المتضمن لبيانات العملاء، مبالغ الضريبة 15%، الخصومات، وطرق السداد للإقرارات الضريبية.'
                : 'Detailed sales journal including customer info, 15% VAT breakdown, discounts, and payment methods for tax filing.'}
            </p>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground font-mono">
              {orders.length} {language === 'ar' ? 'طلبات' : 'orders'} ({formatPrice(metrics.totalRevenue)})
            </span>
            <Button onClick={handleExportOrders} variant="gold" size="sm" className="gap-2 font-bold">
              <Download className="w-4 h-4" />
              <span>{language === 'ar' ? 'تحميل CSV' : 'Download CSV'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Accounting Summary Snapshot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-muted/20 border border-border/80 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {language === 'ar' ? 'ملخص الإقرار المالي السريع' : 'Financial Statement Summary'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'بيانات لحظية للمبيعات والمخزون' : 'Real-time aggregated ledger'}
            </p>
          </div>
          <Button onClick={handlePrintSummary} variant="outline" size="sm" className="gap-1.5 text-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طباعة الملخص' : 'Print Summary'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <span className="text-muted-foreground block">{t.admin.metrics.revenue}</span>
            <span className="text-lg font-black text-foreground mt-1 block">
              {formatPrice(metrics.totalRevenue)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border">
            <span className="text-muted-foreground block">{language === 'ar' ? 'ضريبة القيمة المضافة (15%)' : 'Total VAT (15%)'}</span>
            <span className="text-lg font-black text-foreground mt-1 block">
              {formatPrice(metrics.totalRevenue * 0.15)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border">
            <span className="text-muted-foreground block">{t.admin.metrics.orders}</span>
            <span className="text-lg font-black text-foreground mt-1 block">
              {metrics.totalOrders}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border">
            <span className="text-muted-foreground block">{t.admin.metrics.aov}</span>
            <span className="text-lg font-black text-primary mt-1 block">
              {formatPrice(metrics.averageOrderValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
