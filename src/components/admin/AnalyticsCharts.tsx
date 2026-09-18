'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useI18n } from '@/context/I18nContext';
import { SalesDataPoint, CategorySalesData } from '@/types';

interface AnalyticsChartsProps {
  salesTrend: SalesDataPoint[];
  categorySales: CategorySalesData[];
}

const TECH_COLORS = ['#2563eb', '#0284c7', '#0d9488', '#6366f1', '#64748b'];

export function AnalyticsCharts({ salesTrend, categorySales }: AnalyticsChartsProps) {
  const { language, formatPrice } = useI18n();

  const customTooltipFormatter = (value: number) => {
    return [formatPrice(value), language === 'ar' ? 'الإيرادات' : 'Revenue'];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-start">
      {/* Revenue Over Time Area Chart */}
      <div className="lg:col-span-8 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {language === 'ar' ? 'أداء المبيعات اليومية (آخر 7 أيام)' : 'Daily Revenue Performance (Past 7 Days)'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'تتبع فوري لإجمالي قيمة المبيعات' : 'Live stream of daily tech sales volume'}
          </p>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesTrend}>
              <defs>
                <linearGradient id="techRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Tooltip
                formatter={customTooltipFormatter}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#techRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown Donut Chart */}
      <div className="lg:col-span-4 p-6 rounded-3xl bg-card border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {language === 'ar' ? 'حجم المبيعات حسب التصنيف' : 'Sales by Category'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {language === 'ar' ? 'نسبة كل قسم من إجمالي الأرباح' : 'Revenue distribution by product type'}
          </p>
        </div>

        <div className="h-60 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categorySales}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="percentage"
              >
                {categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TECH_COLORS[index % TECH_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                }}
                formatter={(val: number) => [`${val}%`, language === 'ar' ? 'النسبة' : 'Share']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend pills */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
          {categorySales.map((item, idx) => (
            <div key={item.category} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: TECH_COLORS[idx % TECH_COLORS.length] }}
              />
              <span className="text-muted-foreground truncate">{item.category}</span>
              <span className="font-bold text-foreground ms-auto">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
