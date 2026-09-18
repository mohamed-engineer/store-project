'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Crown,
  Eye,
  Plus,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function AdminOverviewPage() {
  const { language, t, formatPrice, isRtl } = useI18n();
  const products = useProductStore((s) => s.products);
  const orders = useOrderStore((s) => s.orders);

  // Placeholder metrics computed from available data
  const metrics = useMemo(() => {
    const totalRevenue = 0; // TODO: Calculate from orders once orders are persisted
    const totalOrders = orders.length;
    const activeProducts = products.filter((p) => p.stock > 0).length;
    const totalCustomers = 0; // TODO: Track unique customers

    return {
      totalRevenue,
      revenueGrowth: 12,
      totalOrders,
      ordersGrowth: 8,
      activeProducts,
      productsGrowth: 3,
      totalCustomers,
      customersGrowth: 5,
    };
  }, [products, orders]);

  // Placeholder sales trend data for charts
  const salesTrend = [
    { name: 'Mon', sales: 2400, revenue: 2210 },
    { name: 'Tue', sales: 1398, revenue: 2290 },
    { name: 'Wed', sales: 9800, revenue: 2000 },
    { name: 'Thu', sales: 3908, revenue: 2108 },
    { name: 'Fri', sales: 4800, revenue: 2105 },
    { name: 'Sat', sales: 3800, revenue: 2180 },
    { name: 'Sun', sales: 4300, revenue: 2250 },
  ];

  // Placeholder category sales data
  const categorySales = [
    { category: 'Audio', value: 2400 },
    { category: 'Chargers', value: 1398 },
    { category: 'Wearables', value: 9800 },
    { category: 'Power Banks', value: 3908 },
    { category: 'Accessories', value: 4800 },
  ];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const kpiCards = [
    {
      title: t.admin.metrics.revenue,
      value: formatPrice(metrics.totalRevenue),
      growth: `+${metrics.revenueGrowth}%`,
      icon: DollarSign,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: t.admin.metrics.orders,
      value: metrics.totalOrders.toString(),
      growth: `+${metrics.ordersGrowth}%`,
      icon: ShoppingBag,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: t.admin.metrics.activeProducts,
      value: metrics.activeProducts.toString(),
      growth: `+${metrics.productsGrowth}%`,
      icon: Package,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: t.admin.metrics.customers,
      value: metrics.totalCustomers.toString(),
      growth: `+${metrics.customersGrowth}%`,
      icon: Users,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-8 text-start">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t.admin.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.admin.welcome}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>{t.admin.products.addNew}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4 hover:border-primary/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{kpi.title}</span>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">{kpi.value}</h3>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{kpi.growth}</span>
                  <span className="text-muted-foreground font-normal text-[11px]">
                    {t.admin.metrics.growthVsLastMonth}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Recharts Section */}
      <AnalyticsCharts salesTrend={salesTrend} categorySales={categorySales} />

      {/* Recent Orders Live Feed */}
      <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t.admin.charts.recentOrders}
            </h3>
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'أحدث المعاملات الواردة من المتجر' : 'Live stream of newly placed customer orders'}
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>{t.common.viewAll}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                <th className="pb-3 text-start">{t.admin.orders.colOrderNo}</th>
                <th className="pb-3 text-start">{t.admin.orders.colCustomer}</th>
                <th className="pb-3 text-start">{t.admin.orders.colDate}</th>
                <th className="pb-3 text-start">{t.admin.orders.colStatus}</th>
                <th className="pb-3 text-start">{t.admin.orders.colPayment}</th>
                <th className="pb-3 text-end">{t.admin.orders.colTotal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 font-mono font-bold text-foreground">{order.orderNumber}</td>
                    <td className="py-3 font-semibold text-foreground">{order.customer.fullName}</td>
                    <td className="py-3 text-muted-foreground">{formatDate(order.createdAt, language)}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          order.status === 'delivered'
                            ? 'success'
                            : order.status === 'processing'
                            ? 'default'
                            : order.status === 'shipped'
                            ? 'gold'
                            : 'warning'
                        }
                        className="capitalize text-[10px]"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 uppercase font-mono text-[10px] text-muted-foreground">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 text-end font-bold text-primary">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    {t.admin.orders.noOrders || 'No orders yet. Start selling!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
