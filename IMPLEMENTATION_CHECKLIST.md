# Implementation Checklist - Pages Requiring Updates

## ⚠️ Critical: Pages That Need Changes

### 1. `src/app/admin/orders/page.tsx` - NEEDS UPDATE

**Current Issue:**
```typescript
// ❌ WRONG - orders doesn't exist in productStore
const orders = useProductStore((s) => s.orders);
```

**Fix Required:**
```typescript
// ✅ CORRECT - use orderStore
import { useOrderStore } from '@/store/orderStore';

export default function AdminOrdersPage() {
  const { currentOrder, fetchOrder, updateOrderStatus } = useOrderStore();
  // ... rest of component
}
```

**Full Implementation Guide:**

1. Import orderStore at top:
   ```typescript
   import { useOrderStore } from '@/store/orderStore';
   ```

2. Replace productStore.orders reference:
   ```typescript
   // Find this line:
   const orders = useProductStore((s) => s.orders);
   
   // Replace with:
   const { currentOrder, fetchOrder } = useOrderStore();
   ```

3. For listing all orders, implement a filter/search approach:
   ```typescript
   const [orders, setOrders] = useState<Order[]>([]);
   const [isLoading, setIsLoading] = useState(false);

   const handleSearch = async (orderNumber: string) => {
     setIsLoading(true);
     try {
       const order = await fetchOrderByNumber(orderNumber);
       setOrders([order]);
     } catch (error) {
       showError(error.message);
     } finally {
       setIsLoading(false);
     }
   };
   ```

4. Update status change handler:
   ```typescript
   const handleQuickStatusUpdate = async (orderId: string, status: OrderStatus) => {
     try {
       await updateOrderStatus(orderId, status);
       showSuccess('Order status updated');
       // Refresh order
       const updated = await fetchOrder(orderId);
     } catch (error) {
       showError(error.message);
     }
   };
   ```

---

### 2. `src/app/account/page.tsx` - NEEDS UPDATE

**Current Issue:**
```typescript
// ❌ WRONG - orders and reviews don't exist as stored arrays
const orders = useProductStore((s) => s.orders);
const reviews = useProductStore((s) => s.reviews);
```

**Fix Required:**
```typescript
// ✅ CORRECT - use orderStore for orders, productStore for reviews
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';

export default function AccountPage() {
  const { currentOrder, fetchOrderByNumber } = useOrderStore();
  const { reviews } = useProductStore();
  // ... rest of component
}
```

**Full Implementation Guide:**

1. Import both stores:
   ```typescript
   import { useOrderStore } from '@/store/orderStore';
   import { useProductStore } from '@/store/productStore';
   ```

2. Replace references:
   ```typescript
   // Remove this:
   const orders = useProductStore((s) => s.orders);
   
   // Add these:
   const { currentOrder, fetchOrderByNumber } = useOrderStore();
   const { reviews } = useProductStore();
   ```

3. For order lookup (most common use case):
   ```typescript
   const [userOrder, setUserOrder] = useState<Order | null>(null);

   const handleOrderLookup = async (orderNumber: string) => {
     try {
       const order = await fetchOrderByNumber(orderNumber);
       setUserOrder(order);
     } catch (error) {
       showError('Order not found');
     }
   };

   return (
     <div>
       {userOrder ? (
         <OrderDetails order={userOrder} />
       ) : (
         <OrderLookupForm onSearch={handleOrderLookup} />
       )}
     </div>
   );
   ```

4. For displaying user reviews (if tracking reviews per user):
   ```typescript
   // Note: Current schema doesn't have user_id in reviews
   // Consider adding user_id to reviews table if needed:
   
   const userReviews = Object.values(reviews)
     .flat()
     .filter(r => r.userName === currentUser?.name);
   
   return (
     <div>
       {userReviews.map(review => (
         <ReviewCard key={review.id} review={review} />
       ))}
     </div>
   );
   ```

---

## ✅ Pages Already Correct

### Verified: `src/app/products/page.tsx`
```typescript
// ✅ Already correct
const products = useProductStore((s) => s.products);
const { language, t } = useI18n();
// Uses productStore correctly
```

### Verified: `src/app/admin/products/page.tsx`
```typescript
// ✅ Already correct
const products = useProductStore((s) => s.products);
const fetchProducts = useProductStore((s) => s.fetchProducts);
const deleteProduct = useProductStore((s) => s.deleteProduct);
// Uses productStore correctly
```

### Verified: `src/app/checkout/page.tsx`
```typescript
// ✅ Already correct (mostly)
const { items, applyCoupon } = useCartStore();
// Note: applyCoupon is now async - make sure handlers await it
```

---

## 📋 Testing Checklist After Updates

### Admin Orders Page
- [ ] Page loads without errors
- [ ] Can search/lookup orders by order number
- [ ] Can view order details (items, customer, total)
- [ ] Can update order status (pending → processing → shipped → delivered)
- [ ] Status change reflects in database

### Account Page
- [ ] Page loads without errors
- [ ] Can lookup user order by order number
- [ ] Order details display correctly
- [ ] Timeline/status updates show properly
- [ ] Can print/export order if that feature exists

### Integration Tests
- [ ] Create new order → Shows in admin
- [ ] Update status in admin → Visible in account page
- [ ] All error messages display properly
- [ ] Loading states work correctly

---

## 🔧 Code Templates Ready to Copy

### Template: Order Lookup Component
```typescript
'use client';
import { useState } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { useI18n } from '@/context/I18nContext';
import { Order } from '@/types';

export default function OrderLookup() {
  const { t, isRtl } = useI18n();
  const { fetchOrderByNumber, isLoading, error } = useOrderStore();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetchOrderByNumber(orderNumber.trim());
      setOrder(result);
    } catch (err) {
      alert(t.errors?.orderNotFound || 'Order not found');
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter order number..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {order && (
        <div>
          <h3>{t.order?.title}: {order.orderNumber}</h3>
          <p>{t.order?.status}: {order.status}</p>
          <p>{t.order?.total}: {order.total} SAR</p>
          {/* Display more order details */}
        </div>
      )}
    </div>
  );
}
```

### Template: Admin Status Update
```typescript
const handleStatusUpdate = async (orderId: string, newStatus: string) => {
  try {
    const { updateOrderStatus } = useOrderStore.getState();
    
    const note = {
      en: `Status changed to ${newStatus}`,
      ar: `تم تغيير الحالة إلى ${newStatus}`
    };

    await updateOrderStatus(orderId, newStatus, note);
    showSuccessMessage('Order status updated');
    
    // Refresh the order
    const { fetchOrder } = useOrderStore.getState();
    await fetchOrder(orderId);
  } catch (error) {
    showErrorMessage(error instanceof Error ? error.message : 'Failed to update status');
  }
};
```

---

## 📞 Need Help?

If you encounter issues during updates:

1. **Check the Error Message**
   - Browser console (F12)
   - Supabase Dashboard → Logs
   - Network tab for API errors

2. **Verify Store Imports**
   ```typescript
   // Correct import paths:
   import { useProductStore } from '@/store/productStore';
   import { useOrderStore } from '@/store/orderStore';
   import { useCartStore } from '@/store/cartStore';
   ```

3. **Verify Async Handling**
   ```typescript
   // Remember: applyCoupon is now async!
   const result = await applyCoupon(code);  // ✅ CORRECT
   // NOT: applyCoupon(code);  // ❌ WRONG
   ```

4. **Check Database**
   - Go to Supabase Dashboard
   - Verify tables have data
   - Check RLS policies are correct

---

## 🎯 Success Criteria

✅ All pages load without TypeScript errors
✅ All store references are correct
✅ Orders can be created and retrieved
✅ Coupon validation works (async)
✅ Admin CRUD operations work
✅ No console errors in production build

---

## 📅 Recommended Order of Updates

1. **First**: Update `admin/orders/page.tsx` (simpler)
2. **Second**: Update `account/page.tsx` (depends on orderStore working)
3. **Third**: Test entire flow (create order → view in admin → lookup in account)
4. **Fourth**: Handle edge cases and error scenarios

---

**Once these updates are complete, your application will be 100% Supabase-powered!** 🎉
