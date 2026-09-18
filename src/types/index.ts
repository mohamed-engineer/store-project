export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface ProductVariant {
  id: string;
  name: LocalizedString;
  type: 'color' | 'size' | 'volume' | 'material';
  value: string;
  colorHex?: string;
  priceModifier?: number;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  images?: string[];
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku: string;
  title: LocalizedString;
  description: LocalizedString;
  features: {
    en: string[];
    ar: string[];
  };
  price: number;
  compareAtPrice?: number;
  category: string; // Category slug or id
  images: string[];
  thumbnail: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  discountPercentage?: number;
  variants?: ProductVariant[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item id (e.g., `${product.id}-${selectedVariants}`)
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVolume?: string;
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'credit_card' | 'apple_pay' | 'mada';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  district: string;
  streetAddress: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productTitle: LocalizedString;
  productImage: string;
  price: number;
  quantity: number;
  variantInfo?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  trackingNumber?: string;
  timeline: {
    status: OrderStatus;
    timestamp: string;
    note?: LocalizedString;
  }[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  expiresAt?: string;
  description: LocalizedString;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  activeProducts: number;
  productsGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
  percentage: number;
}

export interface RealtimeOrderNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  itemCount: number;
  timestamp: string;
}
