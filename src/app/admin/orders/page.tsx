'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Printer,
  ShoppingBag,
  Clock,
  Filter,
  CheckCircle,
  Truck,
  Package,
} from 'lucide-react';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { exportOrdersToCSV, printOrderInvoice } from '@/lib/exportUtils';
import { formatDate } from '@/lib/utils';

export default function AdminOrdersPage() {
  const { language, t, formatPrice } = useI18n();
  const orders = useOrderStore((s) => s.orders ?? []);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchNo = order.orderNumber.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);

      return matchNo || matchName || matchEmail || matchPhone;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleQuickStatusUpdate = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(
      orderId,
      status,
      `Order status updated to ${status}`,
      `تم تحديث حالة الطلب إلى ${status}`
    );
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">{t.account.statusPending}</Badge>;
      case 'processing':
        return <Badge variant="default">{t.account.statusProcessing}</Badge>;
      case 'shipped':
        return <Badge variant="gold">{t.account.statusShipped}</Badge>;
      case 'delivered':
        return <Badge variant="success">{t.account.statusDelivered}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{t.account.statusCancelled}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            {t.admin.orders.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {t.admin.orders.subtitle} ({orders.length} {language === 'ar' ? 'طلب مسجل' : 'total orders'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => exportOrdersToCSV(orders, language)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {language === 'ar' ? 'تصدير الطلبات CSV' : 'Export Orders CSV'}
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.admin.orders.searchOrders}
            className="w-full h-10 ps-10 pe-4 text-xs bg-muted/40 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-muted/40 border-b border-border/80 text-muted-foreground font-semibold">
              <tr>
                <th className="p-4 text-start">{t.admin.orders.colOrderNo}</th>
                <th className="p-4 text-start">{t.admin.orders.colDate}</th>
                <th className="p-4 text-start">{t.admin.orders.colCustomer}</th>
                <th className="p-4 text-start">{t.admin.orders.colItems}</th>
                <th className="p-4 text-start">{t.admin.orders.colPayment}</th>
                <th className="p-4 text-start">{t.admin.orders.colStatus}</th>
                <th className="p-4 text-start">{t.admin.orders.colTotal}</th>
                <th className="p-4 text-end">{t.admin.orders.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    {language === 'ar' ? 'لا توجد طلبات مطابقة' : 'No orders found matching criteria'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(order.createdAt, language)}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-foreground">{order.customer.fullName}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {order.customer.phone}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-foreground">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} {t.common.items}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] uppercase font-bold text-foreground">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleQuickStatusUpdate(order.id, e.target.value as OrderStatus)}
                        className="h-8 px-2 text-[11px] font-bold bg-muted/40 border border-input rounded-lg focus:ring-1 focus:ring-primary text-foreground cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 font-bold text-primary text-sm">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => setSelectedOrder(order)}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs gap-1"
                          title={t.admin.orders.viewDetails}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{language === 'ar' ? 'عرض' : 'View'}</span>
                        </Button>

                        <button
                          onClick={() => printOrderInvoice(order, language)}
                          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Print invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
