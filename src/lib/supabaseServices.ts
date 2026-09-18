/**
 * Supabase Services - Complete CRUD operations for all entities
 * Handles products, categories, reviews, coupons, and orders
 */

import { supabase as nullableSupabase } from './supabase';
import { Product, Category, Review, Coupon, Order } from '@/types';

const supabase = nullableSupabase as NonNullable<typeof nullableSupabase>;

// ============================================================================
// PRODUCTS SERVICE
// ============================================================================

export const productsService = {
  /**
   * Fetch all products with optional filters
   */
  async fetchAll(filters?: {
    categorySlug?: string;
    isFeatured?: boolean;
    isNew?: boolean;
    isBestSeller?: boolean;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase.from('products').select('*');

    if (filters?.categorySlug) {
      query = query.eq('category_slug', filters.categorySlug);
    }
    if (filters?.isFeatured) {
      query = query.eq('is_featured', true);
    }
    if (filters?.isNew) {
      query = query.eq('is_new', true);
    }
    if (filters?.isBestSeller) {
      query = query.eq('is_bestseller', true);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset || 0) + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Error fetching products: ${error.message}`);
    return formatProducts(data || []);
  },

  /**
   * Fetch a single product by ID
   */
  async fetchById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(`Error fetching product: ${error.message}`);
    return formatProduct(data);
  },

  /**
   * Create a new product (Admin only)
   */
  async create(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const dbProduct = {
      sku: productData.sku,
      title_en: productData.title.en,
      title_ar: productData.title.ar,
      description_en: productData.description.en,
      description_ar: productData.description.ar,
      features_en: productData.features?.en || [],
      features_ar: productData.features?.ar || [],
      price: productData.price,
      compare_at_price: productData.compareAtPrice,
      category_slug: productData.category,
      images: productData.images || [],
      thumbnail: productData.thumbnail,
      stock: productData.stock || 0,
      rating: productData.rating || 5.0,
      review_count: productData.reviewCount || 0,
      is_featured: productData.isFeatured || false,
      is_new: productData.isNew || false,
      is_bestseller: productData.isBestSeller || false,
      discount_percentage: productData.discountPercentage || 0,
      tags: productData.tags || [],
      variants: productData.variants || [],
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) throw new Error(`Error creating product: ${error.message}`);
    return formatProduct(data);
  },

  /**
   * Update an existing product (Admin only)
   */
  async update(id: string, updates: Partial<Product>) {
    const dbUpdates: Record<string, any> = {};

    if (updates.title) {
      dbUpdates.title_en = updates.title.en;
      dbUpdates.title_ar = updates.title.ar;
    }
    if (updates.description) {
      dbUpdates.description_en = updates.description.en;
      dbUpdates.description_ar = updates.description.ar;
    }
    if (updates.features) {
      dbUpdates.features_en = updates.features.en;
      dbUpdates.features_ar = updates.features.ar;
    }
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.compareAtPrice !== undefined) dbUpdates.compare_at_price = updates.compareAtPrice;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviewCount !== undefined) dbUpdates.review_count = updates.reviewCount;
    if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
    if (updates.isNew !== undefined) dbUpdates.is_new = updates.isNew;
    if (updates.isBestSeller !== undefined) dbUpdates.is_bestseller = updates.isBestSeller;
    if (updates.discountPercentage !== undefined) dbUpdates.discount_percentage = updates.discountPercentage;
    if (updates.images) dbUpdates.images = updates.images;
    if (updates.thumbnail) dbUpdates.thumbnail = updates.thumbnail;
    if (updates.tags) dbUpdates.tags = updates.tags;
    if (updates.variants) dbUpdates.variants = updates.variants;

    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating product: ${error.message}`);
    return formatProduct(data);
  },

  /**
   * Delete a product (Admin only)
   */
  async delete(id: string) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(`Error deleting product: ${error.message}`);
  },

  /**
   * Search products by title or tags
   */
  async search(query: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`title_en.ilike.%${query}%,title_ar.ilike.%${query}%`)
      .limit(20);

    if (error) throw new Error(`Error searching products: ${error.message}`);
    return formatProducts(data || []);
  },
};

// ============================================================================
// CATEGORIES SERVICE
// ============================================================================

export const categoriesService = {
  /**
   * Fetch all categories
   */
  async fetchAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('slug', { ascending: true });

    if (error) throw new Error(`Error fetching categories: ${error.message}`);
    return formatCategories(data || []);
  },

  /**
   * Fetch a single category by slug
   */
  async fetchBySlug(slug: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw new Error(`Error fetching category: ${error.message}`);
    return formatCategory(data);
  },

  /**
   * Create a new category (Admin only)
   */
  async create(categoryData: Omit<Category, 'id'>) {
    const dbCategory = {
      slug: categoryData.slug,
      name_en: categoryData.name.en,
      name_ar: categoryData.name.ar,
      description_en: categoryData.description?.en,
      description_ar: categoryData.description?.ar,
      image: categoryData.image,
      item_count: categoryData.itemCount || 0,
      featured: categoryData.featured || false,
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([dbCategory])
      .select()
      .single();

    if (error) throw new Error(`Error creating category: ${error.message}`);
    return formatCategory(data);
  },

  /**
   * Update a category (Admin only)
   */
  async update(id: string, updates: Partial<Category>) {
    const dbUpdates: Record<string, any> = {};

    if (updates.name) {
      dbUpdates.name_en = updates.name.en;
      dbUpdates.name_ar = updates.name.ar;
    }
    if (updates.description) {
      dbUpdates.description_en = updates.description.en;
      dbUpdates.description_ar = updates.description.ar;
    }
    if (updates.image) dbUpdates.image = updates.image;
    if (updates.itemCount !== undefined) dbUpdates.item_count = updates.itemCount;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;

    const { data, error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating category: ${error.message}`);
    return formatCategory(data);
  },

  /**
   * Delete a category (Admin only)
   */
  async delete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(`Error deleting category: ${error.message}`);
  },
};

// ============================================================================
// REVIEWS SERVICE
// ============================================================================

export const reviewsService = {
  /**
   * Fetch reviews for a product
   */
  async fetchByProductId(productId: string, limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Error fetching reviews: ${error.message}`);
    return formatReviews(data || []);
  },

  /**
   * Create a new review
   */
  async create(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const dbReview = {
      product_id: reviewData.productId,
      user_name: reviewData.userName,
      user_avatar: reviewData.userAvatar,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      verified_purchase: reviewData.verifiedPurchase || false,
      helpful_count: reviewData.helpfulCount || 0,
      images: reviewData.images || [],
    };

    const { data, error } = await supabase
      .from('reviews')
      .insert([dbReview])
      .select()
      .single();

    if (error) throw new Error(`Error creating review: ${error.message}`);
    return formatReview(data);
  },

  /**
   * Update helpful count for a review
   */
  async updateHelpful(id: string, increment = 1) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ helpful_count: supabase.rpc('increment_helpful', { id }) })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Error updating review: ${error.message}`);
    return formatReview(data);
  },
};

// ============================================================================
// COUPONS SERVICE
// ============================================================================

export const couponsService = {
  /**
   * Fetch all active coupons
   */
  async fetchActive() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) throw new Error(`Error fetching coupons: ${error.message}`);
    return formatCoupons(data || []);
  },

  /**
   * Validate and fetch a specific coupon
   */
  async validate(code: string) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Coupon not found');
      }
      throw new Error(`Error validating coupon: ${error.message}`);
    }

    // Check if coupon has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      throw new Error('Coupon has expired');
    }

    return formatCoupon(data);
  },

  /**
   * Create a new coupon (Admin only)
   */
  async create(couponData: Omit<Coupon, 'createdAt'>) {
    const dbCoupon = {
      code: couponData.code.trim().toUpperCase(),
      discount_type: couponData.discountType,
      discount_value: couponData.discountValue,
      min_spend: couponData.minSpend || 0,
      max_discount: couponData.maxDiscount,
      expires_at: couponData.expiresAt,
      description_en: couponData.description?.en,
      description_ar: couponData.description?.ar,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('coupons')
      .insert([dbCoupon])
      .select()
      .single();

    if (error) throw new Error(`Error creating coupon: ${error.message}`);
    return formatCoupon(data);
  },

  /**
   * Update a coupon (Admin only)
   */
  async update(code: string, updates: Partial<Coupon>) {
    const dbUpdates: Record<string, any> = {};

    if (updates.discountValue !== undefined) dbUpdates.discount_value = updates.discountValue;
    if (updates.minSpend !== undefined) dbUpdates.min_spend = updates.minSpend;
    if (updates.maxDiscount !== undefined) dbUpdates.max_discount = updates.maxDiscount;
    if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt;
    if (updates.description) {
      dbUpdates.description_en = updates.description.en;
      dbUpdates.description_ar = updates.description.ar;
    }
    const { data, error } = await supabase
      .from('coupons')
      .update(dbUpdates)
      .eq('code', code)
      .select()
      .single();

    if (error) throw new Error(`Error updating coupon: ${error.message}`);
    return formatCoupon(data);
  },

  /**
   * Delete a coupon (Admin only)
   */
  async delete(code: string) {
    const { error } = await supabase.from('coupons').delete().eq('code', code);
    if (error) throw new Error(`Error deleting coupon: ${error.message}`);
  },
};

// ============================================================================
// ORDERS SERVICE
// ============================================================================

export const ordersService = {
  /**
   * Create a new order
   */
  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    // First, create the order
    const dbOrder = {
      order_number: orderData.orderNumber,
      customer_name: orderData.customer.fullName,
      customer_email: orderData.customer.email,
      customer_phone: orderData.customer.phone,
      shipping_address: orderData.customer,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      tax: orderData.tax,
      shipping: orderData.shipping || 0,
      total: orderData.total,
      status: orderData.status || 'pending',
      payment_method: orderData.paymentMethod,
      payment_status: orderData.paymentStatus || 'pending',
      coupon_code: orderData.couponCode,
      tracking_number: orderData.trackingNumber,
      timeline: orderData.timeline || [],
    };

    const { data: orderData_, error: orderError } = await supabase
      .from('orders')
      .insert([dbOrder])
      .select()
      .single();

    if (orderError) throw new Error(`Error creating order: ${orderError.message}`);

    // Then, create order items
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item) => ({
        order_id: orderData_.id,
        product_id: item.productId,
        product_title_en: item.productTitle.en,
        product_title_ar: item.productTitle.ar,
        product_image: item.productImage,
        unit_price: item.price,
        quantity: item.quantity,
        variant_info: item.variantInfo,
        total_price: item.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    return formatOrder(orderData_);
  },

  /**
   * Fetch an order by ID
   */
  async fetchById(orderId: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw new Error(`Error fetching order: ${orderError.message}`);

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw new Error(`Error fetching order items: ${itemsError.message}`);

    return formatOrderWithItems(order, items || []);
  },

  /**
   * Fetch orders by order number
   */
  async fetchByOrderNumber(orderNumber: string) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single();

    if (orderError) throw new Error(`Error fetching order: ${orderError.message}`);

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError) throw new Error(`Error fetching order items: ${itemsError.message}`);

    return formatOrderWithItems(order, items || []);
  },

  /**
   * Update order status (Admin only)
   */
  async updateStatus(orderId: string, status: string, note?: { en: string; ar: string }) {
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('timeline')
      .eq('id', orderId)
      .single();

    if (fetchError) throw new Error(`Error fetching order: ${fetchError.message}`);

    const timeline = order.timeline || [];
    timeline.push({
      status,
      timestamp: new Date().toISOString(),
      note,
    });

    const { data, error } = await supabase
      .from('orders')
      .update({ status, timeline })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(`Error updating order: ${error.message}`);
    return formatOrder(data);
  },

  /**
   * Update tracking number (Admin only)
   */
  async updateTracking(orderId: string, trackingNumber: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ tracking_number: trackingNumber })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(`Error updating order: ${error.message}`);
    return formatOrder(data);
  },
};

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

function formatProduct(data: any): Product {
  return {
    id: data.id,
    sku: data.sku,
    title: { en: data.title_en, ar: data.title_ar },
    description: { en: data.description_en, ar: data.description_ar },
    features: {
      en: data.features_en || [],
      ar: data.features_ar || [],
    },
    price: data.price,
    compareAtPrice: data.compare_at_price,
    category: data.category_slug,
    images: data.images || [],
    thumbnail: data.thumbnail,
    stock: data.stock,
    rating: data.rating,
    reviewCount: data.review_count,
    isFeatured: data.is_featured,
    isNew: data.is_new,
    isBestSeller: data.is_bestseller,
    discountPercentage: data.discount_percentage,
    variants: data.variants || [],
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function formatProducts(dataArray: any[]): Product[] {
  return dataArray.map(formatProduct);
}

function formatCategory(data: any): Category {
  return {
    id: data.id,
    slug: data.slug,
    name: { en: data.name_en, ar: data.name_ar },
    description: { en: data.description_en, ar: data.description_ar },
    image: data.image,
    itemCount: data.item_count,
    featured: data.featured,
  };
}

function formatCategories(dataArray: any[]): Category[] {
  return dataArray.map(formatCategory);
}

function formatReview(data: any): Review {
  return {
    id: data.id,
    productId: data.product_id,
    userName: data.user_name,
    userAvatar: data.user_avatar,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    date: data.created_at?.split('T')[0],
    verifiedPurchase: data.verified_purchase,
    helpfulCount: data.helpful_count,
    images: data.images || [],
  };
}

function formatReviews(dataArray: any[]): Review[] {
  return dataArray.map(formatReview);
}

function formatCoupon(data: any): Coupon {
  return {
    code: data.code,
    discountType: data.discount_type as 'percentage' | 'fixed',
    discountValue: data.discount_value,
    minSpend: data.min_spend,
    maxDiscount: data.max_discount,
    expiresAt: data.expires_at,
    description: { en: data.description_en, ar: data.description_ar },
  };
}

function formatCoupons(dataArray: any[]): Coupon[] {
  return dataArray.map(formatCoupon);
}

function formatOrder(data: any): Order {
  return {
    id: data.id,
    orderNumber: data.order_number,
    customer: {
      fullName: data.customer_name,
      phone: data.customer_phone,
      email: data.customer_email,
      country: data.shipping_address?.country,
      city: data.shipping_address?.city,
      district: data.shipping_address?.district,
      streetAddress: data.shipping_address?.streetAddress,
      postalCode: data.shipping_address?.postalCode,
      notes: data.shipping_address?.notes,
    },
    items: [],
    subtotal: data.subtotal,
    discount: data.discount,
    tax: data.tax,
    shipping: data.shipping,
    total: data.total,
    status: data.status,
    paymentMethod: data.payment_method,
    paymentStatus: data.payment_status,
    couponCode: data.coupon_code,
    trackingNumber: data.tracking_number,
    timeline: data.timeline || [],
    createdAt: data.created_at,
  };
}

function formatOrderWithItems(orderData: any, items: any[]): Order {
  const order = formatOrder(orderData);
  order.items = items.map((item) => ({
    productId: item.product_id,
    productTitle: { en: item.product_title_en, ar: item.product_title_ar },
    productImage: item.product_image,
    price: item.unit_price,
    quantity: item.quantity,
    variantInfo: item.variant_info,
  }));
  return order;
}
