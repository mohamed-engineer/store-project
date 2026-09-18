# 🚀 Quick Reference - Supabase Integration

## Common Usage Patterns

### Fetch Products in a Component
```typescript
'use client';
import { useProductStore } from '@/store/productStore';
import { useEffect } from 'react';

export default function MyComponent() {
  const { products, fetchProducts, isLoading } = useProductStore();

  useEffect(() => {
    fetchProducts({ categorySlug: 'audio', limit: 10 });
  }, [fetchProducts]);

  if (isLoading) return <Spinner />;
  
  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

### Apply Coupon (Now Async)
```typescript
const { applyCoupon } = useCartStore();

const handleCoupon = async (code: string) => {
  const result = await applyCoupon(code);
  if (result.success) {
    showSuccess('Coupon applied!');
  } else {
    showError(`Error: ${result.error}`);
  }
};
```

### Create Order
```typescript
import { useOrderStore } from '@/store/orderStore';

const { createOrder, isLoading } = useOrderStore();

const handleCheckout = async (formData) => {
  try {
    const order = await createOrder({
      orderNumber: 'HKM-' + Date.now(),
      customer: formData,
      items: cartItems,
      subtotal, discount, tax, shipping, total,
      status: 'pending',
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
    });
    
    router.push(`/checkout/success?orderId=${order.id}`);
  } catch (error) {
    showError(error.message);
  }
};
```

### Fetch Reviews for Product
```typescript
const { reviews, fetchReviews, isLoading } = useProductStore();

useEffect(() => {
  fetchReviews(productId, 10, 0);  // limit=10, offset=0
}, [productId, fetchReviews]);

return reviews[productId]?.map(r => <ReviewCard key={r.id} review={r} />);
```

### Admin: Delete Product
```typescript
const { deleteProduct, isLoading } = useProductStore();

const handleDelete = async (productId) => {
  try {
    await deleteProduct(productId);
    showSuccess('Product deleted');
  } catch (error) {
    showError(error.message);
  }
};
```

### Direct Service Usage (Advanced)
```typescript
import { productsService } from '@/lib/supabaseServices';

// Fetch without using store
const products = await productsService.fetchAll({ 
  categorySlug: 'audio',
  isFeatured: true,
  limit: 5 
});

// Search
const results = await productsService.search('wireless');

// Create (admin)
const newProduct = await productsService.create({
  sku: 'HKM-NEW-001',
  title: { en: 'Product Name', ar: 'اسم المنتج' },
  // ... other fields
});
```

### Validate Coupon Directly
```typescript
import { validateCoupon } from '@/lib/couponUtils';

const result = await validateCoupon('TECH10', 200);
if (result.success) {
  console.log('Coupon valid:', result.coupon);
} else {
  console.log('Error:', result.error);
}
```

### Submit Review
```typescript
import { submitReview } from '@/lib/reviewUtils';

const review = await submitReview({
  productId: 'prod-123',
  userName: 'John Doe',
  rating: 5,
  title: 'Great product!',
  comment: 'Works perfectly as described.',
  verifiedPurchase: true,
});
```

---

## Store API Reference

### useProductStore
```typescript
// State
products[]              // Array of products
categories[]            // Array of categories
reviews{}               // Record<productId, Review[]>
isLoading               // boolean
isLoadingCategories     // boolean
error                   // string | null

// Actions
fetchProducts(filters)  // Async
fetchProductById(id)    // Async → Product
createProduct(data)     // Async → Product
updateProduct(id, data) // Async → Product
deleteProduct(id)       // Async → void
searchProducts(query)   // Async → Product[]

fetchCategories()       // Async
fetchCategoryBySlug()   // Async → Category
createCategory(data)    // Async → Category
updateCategory(id, data)// Async → Category
deleteCategory(id)      // Async → void

fetchReviews(id)        // Async
createReview(data)      // Async → Review
updateReviewHelpful()   // Async → void
```

### useOrderStore
```typescript
// State
orders[]                // Array of orders
currentOrder            // Order | null
isLoading               // boolean
error                   // string | null

// Actions
createOrder(data)       // Async → Order
fetchOrder(id)          // Async → Order
fetchOrderByNumber(no)  // Async → Order
updateOrderStatus(id, status, note) // Async → Order
updateOrderTracking(id, number)     // Async → Order
setCurrentOrder(order)  // Sync
clearError()            // Sync
```

### useCartStore
```typescript
// State
items[]                 // CartItem[]
isOpen                  // boolean
couponCode              // string | null
couponDiscountPercentage// number
couponFixedDiscount     // number
couponError             // string | null

// Actions
openCart()              // Sync
closeCart()             // Sync
toggleCart()            // Sync
addItem(product, qty, variants) // Sync
removeItem(itemId)      // Sync
updateQuantity(itemId, qty) // Sync
clearCart()             // Sync
applyCoupon(code)       // Async → {success, error?}
removeCoupon()          // Sync

// Computed
getSubtotal()           // number
getDiscount()           // number
getTax()                // number
getShipping()           // number
getTotal()              // number
getItemCount()          // number
getFreeShippingRemaining() // number
```

---

## Service API Reference

### productsService
```typescript
fetchAll(filters?)      // {categorySlug?, isFeatured?, isNew?, 
fetchById(id)           // limit?, offset?}
create(data)
update(id, updates)
delete(id)
search(query)
```

### categoriesService
```typescript
fetchAll()
fetchBySlug(slug)
create(data)
update(id, updates)
delete(id)
```

### reviewsService
```typescript
fetchByProductId(id, limit?, offset?)
create(data)
updateHelpful(id)
```

### couponsService
```typescript
fetchActive()
validate(code)          // Checks expiry, active status
create(data)
update(code, updates)
delete(code)
```

### ordersService
```typescript
create(data)
fetchById(id)
fetchByOrderNumber(orderNumber)
updateStatus(id, status, note?)
updateTracking(id, trackingNumber)
```

---

## Utility Functions

### couponUtils
```typescript
validateCoupon(code, subtotal?)
calculateDiscount(coupon, subtotal)
getCouponDescription(coupon, language)
formatCouponValue(coupon)
isCouponExpired(coupon)
```

### reviewUtils
```typescript
submitReview(payload)
markReviewHelpful(reviewId)
calculateAverageRating(reviews)
getRatingDistribution(reviews)
filterReviewsByRating(reviews, rating)
sortReviewsByHelpful(reviews)
sortReviewsByDate(reviews)
formatReviewDate(date, language)
validateReview(payload)
```

---

## Type Definitions

```typescript
// Core types from @/types/index.ts

interface Product {
  id: string;
  sku: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  features: { en: string[]; ar: string[] };
  price: number;
  compareAtPrice?: number;
  category: string;
  categoryId?: string;
  images: string[];
  thumbnail: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  discountPercentage: number;
  variants: ProductVariant[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    district: string;
    streetAddress: string;
    postalCode?: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'credit_card' | 'apple_pay' | 'mada';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  couponCode?: string;
  trackingNumber?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  expiresAt?: string;
  description?: { en: string; ar: string };
  isActive: boolean;
  createdAt?: string;
}
```

---

## Error Handling Pattern

```typescript
try {
  const product = await useProductStore((s) => s.fetchProductById)(id);
  // Use product
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('Failed to fetch product:', message);
  // Show user-friendly error message
}
```

---

## Debugging Tips

### Check Store State
```typescript
// In browser console
const store = useProductStore.getState();
console.log(store.products);
console.log(store.isLoading);
console.log(store.error);
```

### View Database Directly
```
Supabase Dashboard → Table Editor → Select table
```

### Check Supabase Logs
```
Supabase Dashboard → Logs → Recent Queries/Errors
```

### Test Service Directly
```typescript
import { productsService } from '@/lib/supabaseServices';

// In browser console or test file
const products = await productsService.fetchAll();
console.log(products);
```

---

## Environment Setup

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

**That's it! You're ready to use Supabase for all your data operations.** 🚀
