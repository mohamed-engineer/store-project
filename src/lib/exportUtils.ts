import { Product, Order, Language } from '@/types';
import { formatPrice, formatDate } from './utils';

/**
 * Exports products array to a clean UTF-8 CSV file with BOM for Excel Arabic support
 */
export function exportProductsToCSV(products: Product[], locale: Language = 'en'): void {
  const headers = locale === 'ar'
    ? ['رمز SKU', 'اسم المنتج', 'التصنيف', 'السعر (ر.س)', 'السعر الأصلي', 'المخزون', 'التقييم', 'عدد التقييمات', 'تاريخ الإضافة']
    : ['SKU', 'Product Title', 'Category', 'Price (SAR)', 'Original Price', 'Stock Level', 'Rating', 'Reviews Count', 'Created Date'];

  const rows = products.map((p) => [
    `"${p.sku}"`,
    `"${(locale === 'ar' ? p.title.ar : p.title.en).replace(/"/g, '""')}"`,
    `"${p.category}"`,
    p.price,
    p.compareAtPrice || '',
    p.stock,
    p.rating,
    p.reviewCount,
    `"${p.createdAt.split('T')[0]}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `Hakim_Store_Inventory_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exports orders array to a clean UTF-8 CSV file with BOM
 */
export function exportOrdersToCSV(orders: Order[], locale: Language = 'en'): void {
  const headers = locale === 'ar'
    ? ['رقم الطلب', 'التاريخ', 'اسم العميل', 'رقم الجوال', 'المدينة', 'طريقة الدفع', 'الحالة', 'المجموع الفرعي', 'الضريبة', 'الخصم', 'الإجمالي (ر.س)']
    : ['Order Number', 'Date', 'Customer Name', 'Phone', 'City', 'Payment Method', 'Status', 'Subtotal', 'Tax', 'Discount', 'Total (SAR)'];

  const rows = orders.map((o) => [
    `"${o.orderNumber}"`,
    `"${o.createdAt.split('T')[0]}"`,
    `"${o.customer.fullName.replace(/"/g, '""')}"`,
    `"${o.customer.phone}"`,
    `"${o.customer.city}"`,
    `"${o.paymentMethod.toUpperCase()}"`,
    `"${o.status.toUpperCase()}"`,
    o.subtotal,
    o.tax,
    o.discount,
    o.total,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  downloadBlob(csvContent, `Hakim_Store_Orders_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Creates and triggers a professional print/PDF invoice window
 */
export function printOrderInvoice(order: Order, locale: Language = 'en'): void {
  const isAr = locale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px; text-align: ${isAr ? 'right' : 'left'};">
          <strong>${isAr ? item.productTitle.ar : item.productTitle.en}</strong>
          ${item.variantInfo ? `<br><span style="font-size: 12px; color: #6b7280;">(${item.variantInfo})</span>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: ${isAr ? 'left' : 'right'};">${formatPrice(item.price, locale)}</td>
        <td style="padding: 12px 8px; text-align: ${isAr ? 'left' : 'right'}; font-weight: bold;">${formatPrice(item.price * item.quantity, locale)}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="${locale}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <title>${isAr ? 'فاتورة طلب' : 'Invoice'} - ${order.orderNumber}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; margin: 0; padding: 32px; background: #fff; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #b88730; padding-bottom: 20px; margin-bottom: 24px; }
        .logo { font-size: 24px; font-weight: bold; color: #b88730; }
        .invoice-title { font-size: 20px; font-weight: 600; text-align: ${isAr ? 'left' : 'right'}; }
        .section { margin-bottom: 24px; }
        .grid { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .col { flex: 1; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }
        th { background: #f9fafb; padding: 12px 8px; font-size: 13px; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
        .totals { width: 300px; margin-${isAr ? 'right' : 'left'}: auto; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
        .grand-total { font-size: 18px; font-weight: bold; color: #b88730; border-top: 2px solid #b88730; padding-top: 8px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">${isAr ? 'متجر حكيم' : 'HAKIM STORE'}</div>
          <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${isAr ? 'عطور ملكية ومقتنيات فاخرة' : 'Royal Fragrances & Luxury Lifestyle'}</div>
          <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">CR: 1010893201 | VAT: 300928172900003</div>
        </div>
        <div class="invoice-title">
          <div>${isAr ? 'فاتورة ضريبية مبسطة' : 'TAX INVOICE'}</div>
          <div style="font-size: 14px; font-weight: normal; color: #4b5563; margin-top: 4px;">${order.orderNumber}</div>
          <div style="font-size: 12px; font-weight: normal; color: #9ca3af;">${formatDate(order.createdAt, locale)}</div>
        </div>
      </div>

      <div class="grid">
        <div class="col">
          <strong>${isAr ? 'بيانات العميل والشحن:' : 'Billed & Shipped To:'}</strong>
          <div style="margin-top: 6px; font-size: 14px; line-height: 1.6;">
            ${order.customer.fullName}<br>
            ${order.customer.phone} | ${order.customer.email}<br>
            ${order.customer.streetAddress}, ${order.customer.district}<br>
            ${order.customer.city}, ${order.customer.country}
          </div>
        </div>
        <div class="col" style="text-align: ${isAr ? 'left' : 'right'};">
          <strong>${isAr ? 'معلومات الدفع والتوصيل:' : 'Payment & Status:'}</strong>
          <div style="margin-top: 6px; font-size: 14px; line-height: 1.6;">
            ${isAr ? 'طريقة الدفع:' : 'Payment:'} ${order.paymentMethod.toUpperCase()}<br>
            ${isAr ? 'حالة السداد:' : 'Payment Status:'} ${order.paymentStatus.toUpperCase()}<br>
            ${isAr ? 'حالة الطلب:' : 'Order Status:'} ${order.status.toUpperCase()}<br>
            ${order.trackingNumber ? `${isAr ? 'رقم التتبع:' : 'Tracking #:'} ${order.trackingNumber}` : ''}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="text-align: ${isAr ? 'right' : 'left'};">${isAr ? 'المنتج' : 'Item Description'}</th>
            <th style="text-align: center;">${isAr ? 'الكمية' : 'Qty'}</th>
            <th style="text-align: ${isAr ? 'left' : 'right'};">${isAr ? 'السعر' : 'Unit Price'}</th>
            <th style="text-align: ${isAr ? 'left' : 'right'};">${isAr ? 'الإجمالي' : 'Total'}</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">
          <span>${isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
          <span>${formatPrice(order.subtotal, locale)}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="total-row" style="color: #10b981;">
            <span>${isAr ? 'الخصم الترويجي:' : 'Discount:'}</span>
            <span>-${formatPrice(order.discount, locale)}</span>
          </div>
        ` : ''}
        <div class="total-row">
          <span>${isAr ? 'ضريبة القيمة المضافة (15%):' : 'VAT (15%):'}</span>
          <span>${formatPrice(order.tax, locale)}</span>
        </div>
        <div class="total-row">
          <span>${isAr ? 'الشحن والتوصيل:' : 'Shipping:'}</span>
          <span>${order.shipping === 0 ? (isAr ? 'مجاني' : 'FREE') : formatPrice(order.shipping, locale)}</span>
        </div>
        <div class="total-row grand-total">
          <span>${isAr ? 'المجموع النهائي:' : 'Total Amount:'}</span>
          <span>${formatPrice(order.total, locale)}</span>
        </div>
      </div>

      <div class="footer">
        ${isAr 
          ? 'شكراً لتسوقكم من متجر حكيم. للإستفسارات وخدمة العملاء: support@hakimstore.com | هاتف: 800-123-4567' 
          : 'Thank you for choosing Hakim Store. Customer Care: support@hakimstore.com | Phone: 800-123-4567'}
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
